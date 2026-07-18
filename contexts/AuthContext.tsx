import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { googleProvider, githubProvider } from '../firebase/providers';
import { createUserDocument } from '../services/authService';
import { mapFirebaseError } from '../utils/firebaseErrors';
import { User as AppUser, UserSettings, DEFAULT_SETTINGS } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
updateUserAccount: (updatedUser: AppUser) => Promise<void>;  

}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Listen to Firestore document changes for real-time appUser updates
        unsubscribeSnapshot = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
           if (docSnap.exists()) {
             const data = docSnap.data();
             const mappedAppUser: AppUser = {
                username: data.username || currentUser.displayName || "User",
                email: data.email || currentUser.email || "",
                enrolledDate: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                settings: data.preferences?.settings || DEFAULT_SETTINGS
             };
             setAppUser(mappedAppUser);
             setLoading(false);
           } else {
             // In case the document takes a second to be created during signup
             setAppUser({
                username: currentUser.displayName || "User",
                email: currentUser.email || "",
                enrolledDate: new Date().toISOString(),
                settings: DEFAULT_SETTINGS
             });
             setLoading(false);
           }
        });
      } else {
        setAppUser(null);
        setLoading(false);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
       unsubscribeAuth();
       if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      await createUserDocument(result.user);
    } catch (error) {
      throw new Error(mapFirebaseError(error));
    }
  };

  const signup = async (email: string, pass: string, username: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, { displayName: username });
      await createUserDocument(result.user, username);
      await sendEmailVerification(result.user);
    } catch (error) {
      throw new Error(mapFirebaseError(error));
    }
  };

  const logout = async () => {
    return signOut(auth);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(mapFirebaseError(error));
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
    } catch (error) {
      throw new Error(mapFirebaseError(error));
    }
  };

  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await createUserDocument(result.user);
    } catch (error) {
      throw new Error(mapFirebaseError(error));
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
       try {
         await sendEmailVerification(auth.currentUser);
       } catch (error) {
         throw new Error(mapFirebaseError(error));
       }
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
    }
  };

const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
  if (!auth.currentUser) return;

  const userRef = doc(db, "users", auth.currentUser.uid);

  const mergedSettings: UserSettings = {
    ...(appUser?.settings ?? DEFAULT_SETTINGS),
    ...newSettings,
  };

  try {
    await setDoc(
      userRef,
      {
        preferences: {
          settings: mergedSettings,
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

const updateUserAccount = async (updatedUser: AppUser) => {
  if (!auth.currentUser) return;

  const userRef = doc(db, "users", auth.currentUser.uid);

  try {
    await updateProfile(auth.currentUser, {
      displayName: updatedUser.username,
    });

    await setDoc(
      userRef,
      {
        username: updatedUser.username,
        preferences: {
          settings: updatedUser.settings,
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating user account:", error);
    throw error;
  }
};

const value: AuthContextType = {
  user,
  appUser,
  loading,
  login,
  signup,
  logout,
  resetPassword,
  loginWithGoogle,
  loginWithGithub,
  resendVerificationEmail,
  updateUserProfile,
  updateUserSettings,
  updateUserAccount,
};

return (
  <AuthContext.Provider value={value}>
    {!loading && children}
  </AuthContext.Provider>
);
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};


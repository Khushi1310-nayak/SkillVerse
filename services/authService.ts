import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { User } from "firebase/auth";
import { DEFAULT_SETTINGS } from "../types";

export const createUserDocument = async (user: User, username?: string) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const email = user.email || "";
    // If no username is provided (e.g., social login), generate a default one from email or display name
    let finalUsername = username;
    if (!finalUsername) {
       finalUsername = user.displayName?.split(" ")[0].toLowerCase() || email.split("@")[0].replace(/[^a-z0-9_]/g, "");
    }

    try {
      await setDoc(userRef, {
        uid: user.uid,
        username: finalUsername,
        email,
        photoURL: user.photoURL || "",
        provider: user.providerData[0]?.providerId || "password",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        emailVerified: user.emailVerified,
        role: "user",
        xp: 0,
        level: 1,
        streak: 0,
        courses: [],
        badges: [],
        preferences: {
            settings: DEFAULT_SETTINGS
        }
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  } else {
    // Update lastLogin on subsequent logins
    try {
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    } catch (error) {
        console.error("Error updating user document", error);
    }
  }
};

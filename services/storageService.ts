
import { User, Progress, UserSettings, CareerProgress } from '../types';

const USER_SESSION_KEY = 'skillverse_current_session';
const USERS_DB_KEY = 'skillverse_users_db';
const PROGRESS_KEY = 'skillverse_progress';
const CAREER_KEY = 'skillverse_career';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  gradientIntensity: 'medium',
  dailyGoal: 30,
  reminders: true,
  autoSave: true,
  instantFeedback: true,
  showAnswers: true,
  retryQuiz: true,
  certificateName: '',
  avatarId: '1',
  onboardingCompleted: false, // Default to false for new users
  hasSeenTour: false,
  interests: [],
  targetRoles: []
};

const DEFAULT_CAREER_PROGRESS: CareerProgress = {
  practicedQuestions: [],
  savedQuestions: [],
  mockInterviewScores: [],
};

// Internal helper to get the user database
const getUsersDB = (): Record<string, User & { password?: string }> => {
  const db = localStorage.getItem(USERS_DB_KEY);
  return db ? JSON.parse(db) : {};
};

const saveUsersDB = (db: Record<string, User & { password?: string }>) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
};

// Security: Simple hashing function to avoid storing plain text passwords
// In a real app, this would happen on the backend with bcrypt/argon2
const hashPassword = (pwd: string): string => {
  let hash = 0;
  if (pwd.length === 0) return hash.toString();
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return "sv_sec_" + Math.abs(hash).toString(16);
};

export const storageService = {
  // --- AUTHENTICATION ---

  register: (username: string, email: string, password: string): { success: boolean; message?: string; user?: User } => {
    const db = getUsersDB();
    const normalizedEmail = email.toLowerCase();

    if (db[normalizedEmail]) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const newUser: User & { password: string } = {
      username,
      email: normalizedEmail,
      enrolledDate: new Date().toISOString(),
      settings: { ...DEFAULT_SETTINGS, certificateName: username },
      // Securely store hashed password
      password: hashPassword(password)
    };

    db[normalizedEmail] = newUser;
    saveUsersDB(db);
    
    // Auto-login after register
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  login: (email: string, password: string): { success: boolean; message?: string; user?: User } => {
    const db = getUsersDB();
    const normalizedEmail = email.toLowerCase();
    const user = db[normalizedEmail];

    if (!user) {
      return { success: false, message: 'Account not found. Please sign up.' };
    }

    // Compare hashed input with stored hash
    if (user.password !== hashPassword(password)) {
      return { success: false, message: 'Incorrect password.' };
    }

    // Success
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    return { success: true, user: user };
  },

  resetPassword: (email: string, newPassword: string): { success: boolean; message?: string } => {
    const db = getUsersDB();
    const normalizedEmail = email.toLowerCase();
    const user = db[normalizedEmail];

    if (!user) {
      return { success: false, message: 'Email not found.' };
    }

    user.password = hashPassword(newPassword);
    saveUsersDB(db);
    return { success: true, message: 'Password updated successfully. Please log in.' };
  },

  logout: () => {
    localStorage.removeItem(USER_SESSION_KEY);
  },

  getUser: (): User | null => {
    const data = localStorage.getItem(USER_SESSION_KEY);
    if (!data) return null;
    const user = JSON.parse(data);
    
    // Strip password for security in memory usage (optional but good practice)
    const { password, ...safeUser } = user;
    return safeUser;
  },

  updateUser: (user: User) => {
    // Update current session
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    
    // Update DB record
    const db = getUsersDB();
    const normalizedEmail = user.email.toLowerCase();
    if (db[normalizedEmail]) {
      // Preserve the password when updating other settings
      const existingPassword = db[normalizedEmail].password;
      db[normalizedEmail] = { ...db[normalizedEmail], ...user, password: existingPassword };
      saveUsersDB(db);
    }
  },

  // --- PROGRESS ---

  saveProgress: (progress: Progress) => {
    const current = storageService.getAllProgress();
    const existingIndex = current.findIndex(p => p.courseId === progress.courseId);
    
    if (existingIndex >= 0) {
      current[existingIndex] = progress;
    } else {
      current.push(progress);
    }
    
    // Progress is currently shared per device, but could be keyed by user email in future
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(current));
  },

  getAllProgress: (): Progress[] => {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getProgress: (courseId: string): Progress | undefined => {
    const all = storageService.getAllProgress();
    return all.find(p => p.courseId === courseId);
  },

  resetProgress: () => {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(CAREER_KEY);
  },

  clearData: () => {
    localStorage.clear();
  },

  // --- CAREER MODE METHODS ---

  getCareerProgress: (): CareerProgress => {
    const data = localStorage.getItem(CAREER_KEY);
    return data ? JSON.parse(data) : DEFAULT_CAREER_PROGRESS;
  },

  toggleQuestionPractice: (questionId: string) => {
    const progress = storageService.getCareerProgress();
    const index = progress.practicedQuestions.indexOf(questionId);
    
    if (index === -1) {
      progress.practicedQuestions.push(questionId);
    } else {
      progress.practicedQuestions.splice(index, 1);
    }
    
    localStorage.setItem(CAREER_KEY, JSON.stringify(progress));
    return progress;
  },

  toggleQuestionSave: (questionId: string) => {
    const progress = storageService.getCareerProgress();
    const index = progress.savedQuestions.indexOf(questionId);
    
    if (index === -1) {
      progress.savedQuestions.push(questionId);
    } else {
      progress.savedQuestions.splice(index, 1);
    }
    
    localStorage.setItem(CAREER_KEY, JSON.stringify(progress));
    return progress;
  },

  saveMockInterviewScore: (companyId: string, score: number) => {
    const progress = storageService.getCareerProgress();
    progress.mockInterviewScores.push({
      companyId,
      score,
      date: new Date().toISOString()
    });
    localStorage.setItem(CAREER_KEY, JSON.stringify(progress));
    return progress;
  }
};

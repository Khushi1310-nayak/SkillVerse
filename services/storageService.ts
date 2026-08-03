import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { Progress, CareerProgress, SavedAINote } from '../types';

const PROGRESS_KEY = 'skillverse_progress';
const CAREER_KEY = 'skillverse_career';
const LAST_VISITED_KEY = 'skillverse_last_visited';
const AI_NOTES_KEY = 'skillverse_ai_notes';
const STREAK_KEY = 'skillverse_streak_data';

// --- STREAK DATA TYPES ---
export interface DailyActivity {
  date: string;       // YYYY-MM-DD
  xp: number;         // XP earned that day
  courses: string[];  // course IDs completed that day
  level: 0 | 1 | 2 | 3; // 0=none, 1=low, 2=medium, 3=high
}

export interface StreakData {
  longestStreak: number;
  activities: Record<string, DailyActivity>; // keyed by YYYY-MM-DD
}

const DEFAULT_CAREER_PROGRESS: CareerProgress = {
  practicedQuestions: [],
  savedQuestions: [],
  mockInterviewScores: [],
  srsData: {},
};

export const storageService = {
  updateUser: async (user: any) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const settingsToSave = user?.settings ?? user;

    try {
      await setDoc(
        userRef,
        {
          username: user.username,
          photoURL: user.photoURL || "",
          preferences: {
            settings: settingsToSave,
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating user settings in Firestore:', error);
      throw error;
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

  // --- LAST VISITED (Continue where you left off) ---

  setLastVisited: (courseId: string) => {
    const record = { courseId, visitedAt: new Date().toISOString() };
    localStorage.setItem(LAST_VISITED_KEY, JSON.stringify(record));
  },

  getLastVisited: (): { courseId: string; visitedAt: string } | null => {
    const data = localStorage.getItem(LAST_VISITED_KEY);
    return data ? JSON.parse(data) : null;
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
  },

  updateQuestionSRS: (questionId: string, gotRight: boolean) => {
    const progress = storageService.getCareerProgress();
    if (!progress.srsData) {
      progress.srsData = {};
    }

    const current = progress.srsData[questionId] || {
      questionId,
      srsInterval: 0,
      nextReviewDate: new Date().toISOString()
    };

    let newInterval = 1;
    if (gotRight) {
      newInterval = Math.min(5, current.srsInterval + 1);
    } else {
      newInterval = 1;
    }

    const daysMap: Record<number, number> = {
      1: 1,
      2: 3,
      3: 7,
      4: 14,
      5: 30
    };
    const days = daysMap[newInterval] || 1;
    const nextDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    progress.srsData[questionId] = {
      questionId,
      srsInterval: newInterval,
      nextReviewDate: nextDate.toISOString()
    };

    // Automatically mark as practiced if answered in SRS
    if (!progress.practicedQuestions.includes(questionId)) {
      progress.practicedQuestions.push(questionId);
    }

    localStorage.setItem(CAREER_KEY, JSON.stringify(progress));
    return progress;
  },

  // --- AI ASSISTANT: SAVED NOTES ---

  getSavedAINotes: (): SavedAINote[] => {
    const data = localStorage.getItem(AI_NOTES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAINote: (note: SavedAINote) => {
    const notes = storageService.getSavedAINotes();
    notes.unshift(note);
    localStorage.setItem(AI_NOTES_KEY, JSON.stringify(notes));
    return notes;
  },

  deleteAINote: (id: string) => {
    const notes = storageService.getSavedAINotes().filter(n => n.id !== id);
    localStorage.setItem(AI_NOTES_KEY, JSON.stringify(notes));
    return notes;
  },
  // --- STREAK CALENDAR ---

  getStreakData: (): StreakData => {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { longestStreak: 0, activities: {} };
  },

  saveStreakData: (data: StreakData): void => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  },

  /**
   * Upsert today's activity entry. Called when the streak tab mounts.
   * Derives activity level from xp: 0=none, 1=1-49, 2=50-99, 3=100+
   */
  recordDayActivity: (date: string, xp: number, courses: string[]): void => {
    const data = storageService.getStreakData();
    const level: 0 | 1 | 2 | 3 =
      xp === 0 ? 0 : xp < 50 ? 1 : xp < 100 ? 2 : 3;
    data.activities[date] = { date, xp, courses, level };
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  },
};

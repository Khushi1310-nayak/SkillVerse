import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { Progress, CareerProgress, SavedAINote, LessonNote } from '../types';
import { safeStorage, isArray, isPlainObject } from '../utils/safeStorage';

const PROGRESS_KEY = 'skillverse_progress';
const CAREER_KEY = 'skillverse_career';
const LAST_VISITED_KEY = 'skillverse_last_visited';
const AI_NOTES_KEY = 'skillverse_ai_notes';
const LESSON_NOTES_KEY = 'skillverse_lesson_notes';
const STREAK_KEY = 'skillverse_streak_data';
const STUDY_TIME_KEY = 'skillverse_study_time';

const getLocalDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


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

/**
 * Career progress is read from storage in several places, so normalise the
 * arrays here rather than trusting whatever shape was persisted. An older
 * build (or a hand-edited value) that is missing `savedQuestions` would
 * otherwise crash the first caller that reaches for `.includes`.
 */
const normalizeCareerProgress = (value: CareerProgress): CareerProgress => ({
  practicedQuestions: isArray(value.practicedQuestions) ? value.practicedQuestions : [],
  savedQuestions: isArray(value.savedQuestions) ? value.savedQuestions : [],
  mockInterviewScores: isArray(value.mockInterviewScores) ? value.mockInterviewScores : [],
  srsData: isPlainObject(value.srsData) ? value.srsData : {},
});

const normalizeStreakData = (value: StreakData): StreakData => ({
  longestStreak: typeof value.longestStreak === 'number' ? value.longestStreak : 0,
  activities: isPlainObject(value.activities) ? value.activities : {},
});

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

    safeStorage.writeJSON(PROGRESS_KEY, current);
  },

  getAllProgress: (): Progress[] => safeStorage.readJSON<Progress[]>(PROGRESS_KEY, [], isArray),

  getProgress: (courseId: string): Progress | undefined => {
    const all = storageService.getAllProgress();
    return all.find(p => p.courseId === courseId);
  },

  // --- LAST VISITED (Continue where you left off) ---

  setLastVisited: (courseId: string) => {
    const record = { courseId, visitedAt: new Date().toISOString() };
    safeStorage.writeJSON(LAST_VISITED_KEY, record);
  },

  getLastVisited: (): { courseId: string; visitedAt: string } | null =>
    safeStorage.readJSON<{ courseId: string; visitedAt: string } | null>(
      LAST_VISITED_KEY,
      null,
      isPlainObject
    ),

  resetProgress: () => {
    safeStorage.remove(PROGRESS_KEY);
    safeStorage.remove(CAREER_KEY);
  },

  clearData: () => {
    safeStorage.clear();
  },

  // --- CAREER MODE METHODS ---

  getCareerProgress: (): CareerProgress => {
    const stored = safeStorage.readJSON<CareerProgress>(
      CAREER_KEY,
      DEFAULT_CAREER_PROGRESS,
      isPlainObject
    );
    return normalizeCareerProgress(stored);
  },

  toggleQuestionPractice: (questionId: string) => {
    const progress = storageService.getCareerProgress();
    const index = progress.practicedQuestions.indexOf(questionId);

    if (index === -1) {
      progress.practicedQuestions.push(questionId);
    } else {
      progress.practicedQuestions.splice(index, 1);
    }

    safeStorage.writeJSON(CAREER_KEY, progress);
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

    safeStorage.writeJSON(CAREER_KEY, progress);
    return progress;
  },

  saveMockInterviewScore: (companyId: string, score: number) => {
    const progress = storageService.getCareerProgress();
    progress.mockInterviewScores.push({
      companyId,
      score,
      date: new Date().toISOString()
    });
    safeStorage.writeJSON(CAREER_KEY, progress);
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

    safeStorage.writeJSON(CAREER_KEY, progress);
    return progress;
  },

  // --- AI ASSISTANT: SAVED NOTES ---

  getSavedAINotes: (): SavedAINote[] =>
    safeStorage.readJSON<SavedAINote[]>(AI_NOTES_KEY, [], isArray),

  saveAINote: (note: SavedAINote) => {
    const notes = storageService.getSavedAINotes();
    notes.unshift(note);
    safeStorage.writeJSON(AI_NOTES_KEY, notes);
    return notes;
  },

  deleteAINote: (id: string) => {
    const notes = storageService.getSavedAINotes().filter(n => n.id !== id);
    safeStorage.writeJSON(AI_NOTES_KEY, notes);
    return notes;
  },

  // --- PERSONAL LESSON NOTES ---

  getAllLessonNotes: (): LessonNote[] =>
    safeStorage.readJSON<LessonNote[]>(LESSON_NOTES_KEY, [], isArray),

  getLessonNotes: (courseId: string, lessonId: string): LessonNote[] => {
    return storageService.getAllLessonNotes()
      .filter(n => n.courseId === courseId && n.lessonId === lessonId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  saveLessonNote: (courseId: string, lessonId: string, text: string): LessonNote => {
    const notes = storageService.getAllLessonNotes();
    const now = new Date().toISOString();
    const note: LessonNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      courseId,
      lessonId,
      text,
      createdAt: now,
      updatedAt: now,
    };
    notes.unshift(note);
    safeStorage.writeJSON(LESSON_NOTES_KEY, notes);
    return note;
  },

  updateLessonNote: (id: string, text: string): LessonNote[] => {
    const notes = storageService.getAllLessonNotes().map(n =>
      n.id === id ? { ...n, text, updatedAt: new Date().toISOString() } : n
    );
    safeStorage.writeJSON(LESSON_NOTES_KEY, notes);
    return notes;
  },

  deleteLessonNote: (id: string): LessonNote[] => {
    const notes = storageService.getAllLessonNotes().filter(n => n.id !== id);
    safeStorage.writeJSON(LESSON_NOTES_KEY, notes);
    return notes;
  },
  // --- STREAK CALENDAR ---

  getStreakData: (): StreakData => {
    const stored = safeStorage.readJSON<StreakData>(
      STREAK_KEY,
      { longestStreak: 0, activities: {} },
      isPlainObject
    );
    return normalizeStreakData(stored);
  },

  saveStreakData: (data: StreakData): void => {
    safeStorage.writeJSON(STREAK_KEY, data);
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
    safeStorage.writeJSON(STREAK_KEY, data);
  },

  // --- STUDY TIME TRACKER ---
  saveStudyTime: (secondsToAdd: number): Record<string, number> => {
    const today = getLocalDateString();
    const currentData = storageService.getStudyTimeRecords();
    currentData[today] = (currentData[today] || 0) + secondsToAdd;
    safeStorage.writeJSON(STUDY_TIME_KEY, currentData);
    return currentData;
  },

  getStudyTimeRecords: (): Record<string, number> =>
    safeStorage.readJSON<Record<string, number>>(STUDY_TIME_KEY, {}, isPlainObject),

  getWeeklyStudyStats: (dailyGoalMinutes: number = 60): {
    totalSeconds: number;
    totalHours: number;
    goalHours: number;
    percentage: number;
    dailyMinutes: Record<string, number>;
  } => {
    const records = storageService.getStudyTimeRecords();

    // Get last 7 days of dates in YYYY-MM-DD format
    const last7Days: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      last7Days.push(`${year}-${month}-${day}`);
    }

    let totalSeconds = 0;
    const dailyMinutes: Record<string, number> = {};

    last7Days.forEach(date => {
      const seconds = records[date] || 0;
      totalSeconds += seconds;
      dailyMinutes[date] = Math.round((seconds / 60) * 10) / 10; // 1 decimal place of minutes
    });

    const totalHours = Math.round((totalSeconds / 3600) * 10) / 10; // 1 decimal place of hours
    const goalHours = Math.round(((dailyGoalMinutes * 7) / 60) * 10) / 10;
    const percentage = goalHours > 0 ? Math.min(100, Math.round((totalSeconds / (goalHours * 3600)) * 100)) : 0;

    return {
      totalSeconds,
      totalHours,
      goalHours,
      percentage,
      dailyMinutes
    };
  },
};

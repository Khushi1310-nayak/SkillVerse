import { doc, setDoc, increment } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { Progress, CareerProgress, SavedAINote, LessonNote, SavedSnippet, StarredQuestion, Company, InterviewQuestion, MicroChallenge, MicroChallengeState } from '../types';
import { safeStorage, isArray, isPlainObject } from '../utils/safeStorage';

const PROGRESS_KEY = 'skillverse_progress';
const CAREER_KEY = 'skillverse_career';
const LAST_VISITED_KEY = 'skillverse_last_visited';
const AI_NOTES_KEY = 'skillverse_ai_notes';
const LESSON_NOTES_KEY = 'skillverse_lesson_notes';
const CODE_SNIPPETS_KEY = 'skillverse_code_snippets';
const STARRED_QUESTIONS_KEY = 'skillverse_starred_questions';
const STREAK_KEY = 'skillverse_streak_data';
const STUDY_TIME_KEY = 'skillverse_study_time';
const DAILY_CHALLENGE_KEY = 'skillverse_daily_challenge';
const MICRO_CHALLENGE_KEY = 'skillverse_micro_challenge';
const DAILY_CHALLENGE_SIZE = 3;
const DAILY_CHALLENGE_XP_BONUS = 50;

export const getLocalDateString = (date: Date = new Date()): string => {
  const d = date;
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

// --- DAILY CHALLENGE ---

/**
 * A single question chosen for today's Daily Challenge. `snapshotReviewDate`
 * captures the question's SRS `nextReviewDate` (or null if it had never been
 * reviewed) at the moment the challenge was generated. Comparing this
 * snapshot against the live SRS record is how we detect "the user reviewed
 * this question today" without CareerMode having to know anything about the
 * Daily Challenge feature.
 */
export interface DailyChallengeQuestionRef {
  questionId: string;
  companyId: string;
  snapshotReviewDate: string | null;
}

export interface DailyChallengeState {
  date: string; // YYYY-MM-DD, the day this challenge was generated for
  questions: DailyChallengeQuestionRef[]; // up to DAILY_CHALLENGE_SIZE entries
  rewardClaimed: boolean; // whether the +50 XP bonus has already been granted for `date`
}

export interface DailyChallengeQuestionView {
  question: InterviewQuestion;
  company: Company;
  completed: boolean;
}

export interface DailyChallengeSummary {
  date: string;
  items: DailyChallengeQuestionView[];
  completedCount: number;
  total: number;
  allCompleted: boolean;
  rewardClaimed: boolean;
}

const DEFAULT_DAILY_CHALLENGE_STATE: DailyChallengeState = {
  date: '',
  questions: [],
  rewardClaimed: false,
};

const normalizeDailyChallengeState = (value: DailyChallengeState): DailyChallengeState => ({
  date: typeof value.date === 'string' ? value.date : '',
  questions: isArray(value.questions)
    ? value.questions.filter(
      (q): q is DailyChallengeQuestionRef =>
        isPlainObject(q) && typeof (q as any).questionId === 'string' && typeof (q as any).companyId === 'string'
    )
    : [],
  rewardClaimed: typeof value.rewardClaimed === 'boolean' ? value.rewardClaimed : false,
});

/**
 * Deterministic same-day shuffle: two calls on the same `date` produce the
 * same ordering (so refreshing the page doesn't reshuffle an in-progress
 * challenge), while different dates produce a different ordering so the
 * question pool actually rotates day to day.
 */
const seededShuffle = <T,>(items: T[], seed: string): T[] => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    const j = hash % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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

  // --- DAILY CHALLENGE ---

  /**
   * Returns today's Daily Challenge, generating a fresh one (persisted to
   * localStorage) the first time it's requested on a given day. Selection
   * prefers questions already due in the Leitner SRS queue and backfills
   * with never-practiced questions so the card always has content, even for
   * brand-new users with an empty SRS queue.
   */
  getDailyChallenge: (companiesList: Company[]): DailyChallengeSummary => {
    const today = getLocalDateString();
    const progress = storageService.getCareerProgress();
    const srsMap = progress.srsData || {};

    const stored = safeStorage.readJSON<DailyChallengeState>(
      DAILY_CHALLENGE_KEY,
      DEFAULT_DAILY_CHALLENGE_STATE,
      isPlainObject
    );
    let state = normalizeDailyChallengeState(stored);

    if (state.date !== today) {
      const now = new Date();
      const due: DailyChallengeQuestionRef[] = [];
      const fresh: DailyChallengeQuestionRef[] = [];

      companiesList.forEach(company => {
        (company.questions || []).forEach(q => {
          const srs = srsMap[q.id];
          if (srs) {
            if (new Date(srs.nextReviewDate) <= now) {
              due.push({ questionId: q.id, companyId: company.id, snapshotReviewDate: srs.nextReviewDate });
            }
          } else {
            fresh.push({ questionId: q.id, companyId: company.id, snapshotReviewDate: null });
          }
        });
      });

      const pool = [...seededShuffle(due, today), ...seededShuffle(fresh, today)];
      state = {
        date: today,
        questions: pool.slice(0, DAILY_CHALLENGE_SIZE),
        rewardClaimed: false,
      };
      safeStorage.writeJSON(DAILY_CHALLENGE_KEY, state);
    }

    const items: DailyChallengeQuestionView[] = [];
    state.questions.forEach(ref => {
      const company = companiesList.find(c => c.id === ref.companyId);
      const question = company?.questions.find(q => q.id === ref.questionId);
      if (!company || !question) return; // question data changed/removed since generation

      const liveSrs = srsMap[ref.questionId];
      const liveReviewDate = liveSrs ? liveSrs.nextReviewDate : null;
      const completed = liveReviewDate !== ref.snapshotReviewDate;

      items.push({ question, company, completed });
    });

    const completedCount = items.filter(i => i.completed).length;
    const total = items.length;

    return {
      date: state.date,
      items,
      completedCount,
      total,
      allCompleted: total > 0 && completedCount === total,
      rewardClaimed: state.rewardClaimed,
    };
  },

  /**
   * Claims the +50 XP Daily Challenge bonus exactly once per day. Safe to
   * call repeatedly (e.g. on every Dashboard mount) - it's a no-op unless
   * all questions are freshly completed and the bonus hasn't been claimed
   * yet today. Updates Firestore directly (xp / weeklyXP / monthlyXP /
   * dailyMasteryMultiplier / dailyChallengeCompletedDate) so the change is
   * picked up by the existing real-time user listener.
   */
  completeDailyChallenge: async (companiesList: Company[]): Promise<{ awarded: boolean; xp: number }> => {
    const summary = storageService.getDailyChallenge(companiesList);
    if (!summary.allCompleted || summary.rewardClaimed) {
      return { awarded: false, xp: 0 };
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      // Can't persist a claim without a signed-in user; leave rewardClaimed
      // false so the bonus can still be granted once the user is available.
      return { awarded: false, xp: 0 };
    }

    // Optimistically mark the local state as claimed first so a second,
    // near-simultaneous call (e.g. two mounted components) can't award the
    // bonus twice.
    const stored = safeStorage.readJSON<DailyChallengeState>(
      DAILY_CHALLENGE_KEY,
      DEFAULT_DAILY_CHALLENGE_STATE,
      isPlainObject
    );
    const state = normalizeDailyChallengeState(stored);
    if (state.date !== summary.date || state.rewardClaimed) {
      return { awarded: false, xp: 0 };
    }
    state.rewardClaimed = true;
    safeStorage.writeJSON(DAILY_CHALLENGE_KEY, state);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          xp: increment(DAILY_CHALLENGE_XP_BONUS),
          weeklyXP: increment(DAILY_CHALLENGE_XP_BONUS),
          monthlyXP: increment(DAILY_CHALLENGE_XP_BONUS),
          dailyMasteryMultiplier: increment(1),
          dailyChallengeCompletedDate: summary.date,
        },
        { merge: true }
      );
      return { awarded: true, xp: DAILY_CHALLENGE_XP_BONUS };
    } catch (error) {
      console.error('Error awarding Daily Challenge bonus:', error);
      // Roll back so the bonus can be retried (e.g. after the user is back online).
      state.rewardClaimed = false;
      safeStorage.writeJSON(DAILY_CHALLENGE_KEY, state);
      throw error;
    }
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

  saveLessonNote: (courseId: string, lessonId: string, text: string, visibility: 'private' | 'public' = 'private'): LessonNote => {
    const notes = storageService.getAllLessonNotes();
    const now = new Date().toISOString();
    const note: LessonNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      courseId,
      lessonId,
      text,
      createdAt: now,
      updatedAt: now,
      visibility,
    };
    notes.unshift(note);
    safeStorage.writeJSON(LESSON_NOTES_KEY, notes);
    return note;
  },

  updateLessonNote: (id: string, text: string, visibility?: 'private' | 'public'): LessonNote[] => {
    const notes = storageService.getAllLessonNotes().map(n =>
      n.id === id
        ? {
          ...n,
          text,
          updatedAt: new Date().toISOString(),
          ...(visibility ? { visibility } : {}),
        }
        : n
    );
    safeStorage.writeJSON(LESSON_NOTES_KEY, notes);
    return notes;
  },

  deleteLessonNote: (id: string): LessonNote[] => {
    const notes = storageService.getAllLessonNotes().filter(n => n.id !== id);
    safeStorage.writeJSON(LESSON_NOTES_KEY, notes);
    return notes;
  },

  // --- SAVED CODE SNIPPETS (Playground) ---

  getSavedSnippets: (): SavedSnippet[] =>
    safeStorage.readJSON<SavedSnippet[]>(CODE_SNIPPETS_KEY, [], isArray)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),

  saveSnippet: (name: string, language: string, code: string): SavedSnippet => {
    const snippets = storageService.getSavedSnippets();
    const now = new Date().toISOString();
    const snippet: SavedSnippet = {
      id: `snippet_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name,
      language,
      code,
      createdAt: now,
      updatedAt: now,
    };
    snippets.unshift(snippet);
    safeStorage.writeJSON(CODE_SNIPPETS_KEY, snippets);
    return snippet;
  },

  updateSnippet: (id: string, code: string): SavedSnippet[] => {
    const snippets = storageService.getSavedSnippets().map(s =>
      s.id === id ? { ...s, code, updatedAt: new Date().toISOString() } : s
    );
    safeStorage.writeJSON(CODE_SNIPPETS_KEY, snippets);
    return snippets;
  },

  deleteSnippet: (id: string): SavedSnippet[] => {
    const snippets = storageService.getSavedSnippets().filter(s => s.id !== id);
    safeStorage.writeJSON(CODE_SNIPPETS_KEY, snippets);
    return snippets;
  },

  // --- STARRED QUIZ QUESTIONS ---

  getStarredQuestions: (): StarredQuestion[] =>
    safeStorage.readJSON<StarredQuestion[]>(STARRED_QUESTIONS_KEY, [], isArray),

  toggleStarQuestion: (courseId: string, questionId: number): StarredQuestion[] => {
    const starred = storageService.getStarredQuestions();
    const existingIndex = starred.findIndex(
      sq => sq.courseId === courseId && sq.questionId === questionId
    );

    if (existingIndex >= 0) {
      starred.splice(existingIndex, 1);
    } else {
      starred.push({
        courseId,
        questionId,
        starredAt: new Date().toISOString(),
      });
    }

    safeStorage.writeJSON(STARRED_QUESTIONS_KEY, starred);
    return starred;
  },

  isQuestionStarred: (courseId: string, questionId: number): boolean => {
    const starred = storageService.getStarredQuestions();
    return starred.some(sq => sq.courseId === courseId && sq.questionId === questionId);
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

  // --- DAILY MICRO-CHALLENGE & STREAK SAVER ---

  getMicroChallengeState: (date: string = getLocalDateString()): MicroChallengeState | null => {
    const stored = safeStorage.readJSON<MicroChallengeState | null>(
      MICRO_CHALLENGE_KEY,
      null,
      isPlainObject
    );
    if (!stored || stored.date !== date) return null;
    return stored;
  },

  completeMicroChallenge: async (
    challenge: MicroChallenge,
    selectedAnswer: number
  ): Promise<{ awarded: boolean; xp: number; isCorrect: boolean }> => {
    const today = getLocalDateString();
    const isCorrect = selectedAnswer === challenge.correctAnswer;
    const existing = storageService.getMicroChallengeState(today);

    // If already correctly answered and claimed today, do not award again
    if (existing?.completed && existing?.rewardClaimed) {
      return { awarded: false, xp: 0, isCorrect: existing.isCorrect };
    }

    if (!isCorrect) {
      const state: MicroChallengeState = {
        date: today,
        challengeId: challenge.id,
        completed: false,
        selectedAnswer,
        isCorrect: false,
        rewardClaimed: false,
      };
      safeStorage.writeJSON(MICRO_CHALLENGE_KEY, state);
      return { awarded: false, xp: 0, isCorrect: false };
    }

    // Save successful completion state
    const state: MicroChallengeState = {
      date: today,
      challengeId: challenge.id,
      completed: true,
      selectedAnswer,
      isCorrect: true,
      rewardClaimed: true,
    };
    safeStorage.writeJSON(MICRO_CHALLENGE_KEY, state);

    // Record activity for local streak calendar
    storageService.recordDayActivity(today, challenge.xpReward, ['micro-challenge']);

    // Persist XP to Firestore user document if signed in
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(
          userRef,
          {
            xp: increment(challenge.xpReward),
            weeklyXP: increment(challenge.xpReward),
            monthlyXP: increment(challenge.xpReward),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error updating user XP for micro challenge:', err);
      }
    }

    return { awarded: true, xp: challenge.xpReward, isCorrect: true };
  },
};


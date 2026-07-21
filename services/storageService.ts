import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { Progress, CareerProgress } from '../types';

const PROGRESS_KEY = 'skillverse_progress';
const CAREER_KEY = 'skillverse_career';

const DEFAULT_CAREER_PROGRESS: CareerProgress = {
  practicedQuestions: [],
  savedQuestions: [],
  mockInterviewScores: [],
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


export interface UserSettings {
  theme: 'dark' | 'light';
  gradientIntensity: 'low' | 'medium' | 'high';
  dailyGoal: number; // minutes
  reminders: boolean;
  autoSave: boolean;
  instantFeedback: boolean;
  showAnswers: boolean;
  retryQuiz: boolean;
  certificateName: string;
  avatarId: string;
  // Onboarding Fields
  onboardingCompleted: boolean;
  hasSeenTour: boolean;
  primaryGoal?: string;
  experienceLevel?: string;
  interests?: string[];
  targetRoles?: string[];
  motivation?: string;
  learningStyle?: string;
}

export interface User {
  username: string;
  email: string;
  enrolledDate: string;
  settings: UserSettings;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string; // HTML content
  resources: { title: string; url: string }[];
  quiz: QuizQuestion[];
}

export interface Progress {
  courseId: string;
  completed: boolean;
  score: number;
  passed: boolean;
  completedDate?: string;
}

// --- Career Mode Types ---

export interface InterviewQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  answer: string;
  resourceLink: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string; // URL or icon name
  description: string;
  roles: string[];
  difficulty: 'Moderate' | 'Hard' | 'Very Hard';
  focus: string[]; // e.g., ["DSA", "System Design"]
  questions: InterviewQuestion[];
}

export interface CareerProgress {
  practicedQuestions: string[]; // Array of question IDs
  savedQuestions: string[];
  mockInterviewScores: { companyId: string; score: number; date: string }[];
}

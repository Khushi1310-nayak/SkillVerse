
export interface UserSettings {
  theme: 'dark' | 'light';
  gradientIntensity: 'low' | 'medium' | 'high';
  dailyGoal: number; // minutes
  reminders: boolean;
  autoSave: boolean;
  instantFeedback: boolean;
  showAnswers: boolean;
  retryQuiz: boolean;
  soundEffects?: boolean;
  reducedMotion?: boolean;
  reminderTime?: string; // HH:MM local time for the daily study reminder notification
  fontSize?: 'sm' | 'md' | 'lg';
  dyslexiaFont?: boolean;
  hideFromLeaderboard?: boolean;
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
  unlockedThemes?: string[];
  unlockedCursors?: string[];
  unlockedFrames?: string[];
  activeTheme?: string;
  activeCursor?: string;
  activeFrame?: string;
  customPrimary?: string; // hex color, e.g. #6968A6
  customPrimaryLight?: string; // hex color, e.g. #CF9893
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  gradientIntensity: 'medium',
  dailyGoal: 60,
  reminders: true,
  autoSave: true,
  instantFeedback: true,
  showAnswers: false,
  retryQuiz: true,
  soundEffects: true,
  reminderTime: '18:00',
  fontSize: 'md',
  dyslexiaFont: false,
  certificateName: '',
  avatarId: '1',
  onboardingCompleted: false,
  hasSeenTour: false,
  unlockedThemes: ['dark', 'light'],
  unlockedCursors: ['default'],
  unlockedFrames: ['none'],
  activeTheme: 'dark',
  activeCursor: 'default',
  activeFrame: 'none'
};

export interface User {
  uid?: string;
  username: string;
  email: string;
  enrolledDate: string;
  settings: UserSettings;
  xp: number;
  weeklyXP?: number;
  monthlyXP?: number;
  level: number;
  courses: string[];
  photoURL?: string;
  streak: number;
  lastActiveDate: string;
  streakFreezes?: number;
  badges: string[];
  role?: 'admin' | 'instructor' | 'user';
  following?: string[];
  // --- Daily Challenge (Spaced Repetition Practice Room) ---
  dailyChallengeCompletedDate?: string; // YYYY-MM-DD of the last date the daily challenge bonus was claimed
  dailyMasteryMultiplier?: number; // cumulative count of fully-completed daily challenges
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BadgeRequirement {
  metric: 'courses' | 'streak' | 'mockInterviews';
  target: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  requirement: BadgeRequirement;
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
  chapters?: Chapter[];
  rating?: number; // denormalized average rating (0-5), recomputed on each review
  reviewCount?: number; // denormalized total number of reviews
  prerequisiteCourseIds?: string[]; // IDs of courses that must be passed before this one unlocks
}

export interface Progress {
  courseId: string;
  completed: boolean;
  score: number;
  passed: boolean;
  completedDate?: string;
  missedQuestionIds?: string[]; // IDs of quiz questions answered incorrectly on the most recent attempt
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

export interface QuestionSRSData {
  questionId: string;
  srsInterval: number; // Leitner box (1 to 5)
  nextReviewDate: string; // ISO string format
}

export interface CareerProgress {
  practicedQuestions: string[]; // Array of question IDs
  savedQuestions: string[];
  mockInterviewScores: { companyId: string; score: number; date: string }[];
  srsData?: Record<string, QuestionSRSData>; // Map of questionId to SRS progress
}

export interface SavedAINote {
  id: string;
  text: string;
  courseTitle: string;
  savedAt: string; // ISO timestamp
}

export interface LessonNote {
  id: string;
  courseId: string;
  lessonId: string;
  text: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface SavedSnippet {
  id: string;
  name: string;
  language: string;
  code: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface LessonComment {
  id: string;
  courseId: string;
  lessonId: string;
  userId: string;
  username: string;
  avatarId?: string;
  photoURL?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  parentId?: string | null;
  pinned?: boolean;
}

export interface CodeReviewRequest {
  id: string;
  userId: string;
  username: string;
  code: string;
  language: string;
  problemContext?: string;
  status: 'open' | 'reviewed';
  createdAt: string;
}

export interface CodeReviewComment {
  id: string;
  requestId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  parentId?: string | null;
  pinned?: boolean;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  username: string;
  avatarId?: string;
  photoURL?: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

export type ReportedContentType = 'comment' | 'review';
export type ReportReason = 'spam' | 'harassment' | 'inappropriate' | 'misleading' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface ContentReport {
  id: string; // deterministic: `${contentId}_${reporterId}`, one report per user per content item
  reporterId: string; // reporter's Firebase Auth UID
  contentId: string; // id of the reported comment or review
  contentType: ReportedContentType;
  courseId: string;
  reason: ReportReason;
  status: ReportStatus;
  createdAt: string;
  contentSnapshot?: string;
  contentAuthorUsername?: string;
}


export type NotificationType = 'follow' | 'comment_reply' | 'comment_pinned';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
  actorUsername?: string;
  actorAvatarId?: string;
  actorPhotoURL?: string;
  link?: string;
}

// --- Pair Programming Session ---

export interface PairSessionParticipant {
  userId: string;
  username: string;
  photoURL?: string;
  joinedAt: string;
  lastActiveAt: string;
}

export interface PairSession {
  id: string;
  hostUserId: string;
  code: string;
  language: string;
  lastEditedBy: string;
  lastEditedAt: string;
  output: string;
  outputUpdatedAt: string;
  participants: PairSessionParticipant[];
  createdAt: string;
}

/**
 * Analytics Service
 *
 * Computes derived analytics from user progress, career data, and study-time
 * records so the Analytics Dashboard can render charts and insights without
 * touching raw storage keys directly.
 */

import { storageService } from '../services/storageService';
import { COURSES, CATEGORIES, COMPANIES, BADGE_DEFINITIONS } from '../constants';
import { User, Progress, CareerProgress } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DailyStudyEntry {
  date: string; // YYYY-MM-DD
  minutes: number;
}

export interface WeeklyHeatmapRow {
  day: string; // Mon, Tue, …
  date: string; // YYYY-MM-DD
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = none, 4 = max intensity
}

export interface SubjectBreakdown {
  categoryId: string;
  categoryTitle: string;
  totalCourses: number;
  completedCourses: number;
  averageScore: number;
  completionPercent: number;
  color: string;
}

export interface XPDayPoint {
  date: string; // YYYY-MM-DD
  xp: number;
  label: string; // short label like "Mon 25"
}

export interface MockInterviewTrend {
  companyId: string;
  companyName: string;
  score: number;
  date: string;
  color: string;
}

export interface LearningInsight {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral';
}

export interface AnalyticsSummary {
  totalStudyMinutes: number;
  totalStudyHours: number;
  averageDailyMinutes: number;
  longestStreak: number;
  currentStreak: number;
  totalCoursesCompleted: number;
  totalCoursesAttempted: number;
  totalQuizzesPassed: number;
  averageQuizScore: number;
  totalMockInterviews: number;
  averageMockScore: number;
  totalQuestionsPracticed: number;
  totalXpEarned: number;
  currentLevel: number;
  totalBadgesEarned: number;
  accountAgeDays: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  weeklyHeatmap: WeeklyHeatmapRow[];
  subjectBreakdown: SubjectBreakdown[];
  xpTrend: XPDayPoint[];
  mockInterviewTrends: MockInterviewTrend[];
  insights: LearningInsight[];
  studyStreakDays: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  programming: '#6968A6',
  dsa: '#3B82F6',
  design: '#EC4899',
};

const MOCK_COLORS = [
  '#6968A6', '#3B82F6', '#EC4899', '#10B981', '#F59E0B',
  '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16', '#F97316',
];

function getDayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDateShort(date: Date): string {
  return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}`;
}

function getISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

// ─── Study-Time Heatmap ───────────────────────────────────────────────────────

function buildWeeklyHeatmap(): WeeklyHeatmapRow[] {
  const studyData = storageService.getStudyTimeRecords();
  const rows: WeeklyHeatmapRow[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build last 7 days
  let maxMinutes = 1;
  const rawEntries: { date: Date; minutes: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getISODate(d);
    const minutes = studyData[key] ?? 0;
    rawEntries.push({ date: d, minutes });
    if (minutes > maxMinutes) maxMinutes = minutes;
  }

  for (const entry of rawEntries) {
    const ratio = entry.minutes / maxMinutes;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (entry.minutes > 0) {
      if (ratio > 0.75) level = 4;
      else if (ratio > 0.5) level = 3;
      else if (ratio > 0.25) level = 2;
      else level = 1;
    }
    rows.push({
      day: getDayLabel(entry.date),
      date: getISODate(entry.date),
      minutes: entry.minutes,
      level,
    });
  }

  return rows;
}

// ─── Subject Breakdown ────────────────────────────────────────────────────────

function buildSubjectBreakdown(): SubjectBreakdown[] {
  const allProgress = storageService.getAllProgress();

  return CATEGORIES.map((cat) => {
    const catCourses = COURSES.filter((c) => c.categoryId === cat.id);
    const catProgress = catCourses.map((c) =>
      allProgress.find((p) => p.courseId === c.id)
    );
    const completed = catProgress.filter((p) => p?.passed).length;
    const scores = catProgress.filter((p) => p).map((p) => p!.score);
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    return {
      categoryId: cat.id,
      categoryTitle: cat.title,
      totalCourses: catCourses.length,
      completedCourses: completed,
      averageScore: avgScore,
      completionPercent: catCourses.length
        ? Math.round((completed / catCourses.length) * 100)
        : 0,
      color: CATEGORY_COLORS[cat.id] || '#6968A6',
    };
  });
}

// ─── XP Trend (last 14 days estimate based on completion dates) ───────────────

function buildXPTrend(user: User): XPDayPoint[] {
  const allProgress = storageService.getAllProgress();
  const career = storageService.getCareerProgress();
  const points: XPDayPoint[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build a map of date -> XP earned that day
  const xpByDate: Record<string, number> = {};

  // +25 XP per course completion
  allProgress.forEach((p) => {
    if (p.completedDate) {
      const day = p.completedDate.split('T')[0];
      xpByDate[day] = (xpByDate[day] || 0) + 25;
    }
  });

  // +10 XP per mock interview
  (career.mockInterviewScores || []).forEach((attempt) => {
    const day = attempt.date.split('T')[0];
    xpByDate[day] = (xpByDate[day] || 0) + 10;
  });

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getISODate(d);
    points.push({
      date: key,
      xp: xpByDate[key] || 0,
      label: formatDateShort(d),
    });
  }

  return points;
}

// ─── Mock Interview Trends ────────────────────────────────────────────────────

function buildMockInterviewTrends(): MockInterviewTrend[] {
  const career = storageService.getCareerProgress();
  const scores = career.mockInterviewScores || [];

  if (scores.length === 0) return [];

  const sorted = [...scores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sorted.map((attempt, idx) => {
    const company = COMPANIES.find((c) => c.id === attempt.companyId);
    return {
      companyId: attempt.companyId,
      companyName: company?.name || attempt.companyId,
      score: attempt.score,
      date: attempt.date,
      color: MOCK_COLORS[idx % MOCK_COLORS.length],
    };
  });
}

// ─── Study Streak Days ────────────────────────────────────────────────────────

function buildStreakDays(user: User): string[] {
  const days: string[] = [];
  const studyData = storageService.getStudyTimeRecords();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Walk backwards from today
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getISODate(d);
    if ((studyData[key] ?? 0) > 0) {
      days.push(key);
    } else if (i > 0) {
      // Stop at first gap (unless it's today)
      break;
    }
  }

  return days;
}

// ─── Learning Insights ────────────────────────────────────────────────────────

function buildInsights(
  summary: AnalyticsSummary,
  subjects: SubjectBreakdown[]
): LearningInsight[] {
  const insights: LearningInsight[] = [];

  // Streak insight
  if (summary.currentStreak >= 7) {
    insights.push({
      id: 'streak-hero',
      icon: '🔥',
      title: 'Streak Hero',
      description: `Amazing ${summary.currentStreak}-day streak! You're building a powerful learning habit.`,
      type: 'positive',
    });
  } else if (summary.currentStreak === 0) {
    insights.push({
      id: 'streak-restore',
      icon: '💡',
      title: 'Start Today\'s Streak',
      description: 'Log some study time today to rebuild your learning streak.',
      type: 'warning',
    });
  }

  // Quiz score insight
  if (summary.averageQuizScore >= 80) {
    insights.push({
      id: 'quiz-strong',
      icon: '🎯',
      title: 'Strong Quiz Performance',
      description: `Your average quiz score of ${summary.averageQuizScore}% shows solid understanding. Try advanced courses next!`,
      type: 'positive',
    });
  } else if (summary.averageQuizScore > 0 && summary.averageQuizScore < 50) {
    insights.push({
      id: 'quiz-weak',
      icon: '📚',
      title: 'Quiz Review Recommended',
      description: `Your average score is ${summary.averageQuizScore}%. Review course material before retaking quizzes.`,
      type: 'warning',
    });
  }

  // Subject balance insight
  const weakest = subjects.reduce((min, s) =>
    s.completionPercent < min.completionPercent ? s : min
  );
  const strongest = subjects.reduce((max, s) =>
    s.completionPercent > max.completionPercent ? s : max
  );

  if (strongest.completionPercent - weakest.completionPercent > 40) {
    insights.push({
      id: 'imbalanced',
      icon: '⚖️',
      title: 'Learning Imbalance Detected',
      description: `You're strong in ${strongest.categoryTitle} (${strongest.completionPercent}%) but ${weakest.categoryTitle} is at ${weakest.completionPercent}%. Consider diversifying.`,
      type: 'warning',
    });
  }

  // Career mode insight
  if (summary.totalMockInterviews === 0 && summary.totalCoursesCompleted >= 2) {
    insights.push({
      id: 'try-career',
      icon: '💼',
      title: 'Try Career Mode',
      description: `You've completed ${summary.totalCoursesCompleted} courses — great foundation! Start mock interviews to prepare for real ones.`,
      type: 'neutral',
    });
  } else if (summary.averageMockScore >= 70) {
    insights.push({
      id: 'interview-ready',
      icon: '🚀',
      title: 'Interview Ready',
      description: `Your mock interview average of ${summary.averageMockScore}% suggests strong interview readiness.`,
      type: 'positive',
    });
  }

  // XP & leveling insight
  if (summary.currentLevel >= 5) {
    insights.push({
      id: 'level-up',
      icon: '⭐',
      title: 'Level ${summary.currentLevel} Achiever',
      description: `You've earned ${summary.totalXpEarned} XP and reached Level ${summary.currentLevel}. Keep pushing forward!`,
      type: 'positive',
    });
  }

  // Account age insight
  if (summary.accountAgeDays > 30 && summary.totalCoursesCompleted < 5) {
    insights.push({
      id: 'pace-slow',
      icon: '🐢',
      title: 'Pick Up the Pace',
      description: `You've been with SkillVerse for ${summary.accountAgeDays} days with ${summary.totalCoursesCompleted} completions. Set a daily goal to accelerate!`,
      type: 'warning',
    });
  }

  // General encouragement
  if (insights.length === 0) {
    insights.push({
      id: 'welcome',
      icon: '👋',
      title: 'Welcome to Analytics',
      description: 'Start learning and practicing to see personalized insights about your progress here.',
      type: 'neutral',
    });
  }

  return insights;
}

// ─── Summary Builder ──────────────────────────────────────────────────────────

function buildSummary(user: User): AnalyticsSummary {
  const studyData = storageService.readStudyTime();
  const allProgress = storageService.getAllProgress();
  const career = storageService.getCareerProgress();

  const totalMinutes = Object.values(studyData).reduce((a, b) => a + b, 0);
  const activeDays = Object.values(studyData).filter((m) => m > 0).length;

  const enrolledDate = new Date(user.enrolledDate);
  const today = new Date();
  const accountAge = Math.max(1, daysBetween(enrolledDate, today));

  const scores = allProgress.filter((p) => p).map((p) => p.score);
  const avgQuiz = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const mockScores = career.mockInterviewScores || [];
  const avgMock = mockScores.length > 0
    ? Math.round(mockScores.reduce((a, b) => a + b.score, 0) / mockScores.length)
    : 0;

  return {
    totalStudyMinutes: totalMinutes,
    totalStudyHours: Math.round((totalMinutes / 60) * 10) / 10,
    averageDailyMinutes: activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0,
    longestStreak: user.streak,
    currentStreak: user.streak,
    totalCoursesCompleted: allProgress.filter((p) => p.passed).length,
    totalCoursesAttempted: allProgress.length,
    totalQuizzesPassed: allProgress.filter((p) => p.passed).length,
    averageQuizScore: avgQuiz,
    totalMockInterviews: mockScores.length,
    averageMockScore: avgMock,
    totalQuestionsPracticed: career.practicedQuestions?.length || 0,
    totalXpEarned: user.xp,
    currentLevel: user.level,
    totalBadgesEarned: (user.badges || []).length,
    accountAgeDays: accountAge,
  };
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function computeAnalytics(user: User): AnalyticsData {
  const summary = buildSummary(user);
  const weeklyHeatmap = buildWeeklyHeatmap();
  const subjectBreakdown = buildSubjectBreakdown();
  const xpTrend = buildXPTrend(user);
  const mockInterviewTrends = buildMockInterviewTrends();
  const studyStreakDays = buildStreakDays(user);
  const insights = buildInsights(summary, subjectBreakdown);

  return {
    summary,
    weeklyHeatmap,
    subjectBreakdown,
    xpTrend,
    mockInterviewTrends,
    insights,
    studyStreakDays,
  };
}

import { Course, Company, UserSettings, Progress, CareerProgress } from '../types';
import { COURSES, COMPANIES } from '../constants';

const COURSE_RECOMMENDATION_LIMIT = 5;
const COMPANY_RECOMMENDATION_LIMIT = 3;

// Heuristic mapping of onboarding target roles to company focus tags.
// This is a manual approximation, not derived from the data itself —
// refine as more companies/focus areas are added to constants.ts.
const ROLE_TO_FOCUS_MAP: Record<string, string[]> = {
  frontend: ['Product Design', 'Experience Design', 'Mobile', 'Streaming Architecture'],
  backend: [
    'System Design', 'Database Design', 'Distributed Systems', 'Cloud',
    'Concurrency', 'Big Data', 'Database Internals'
  ],
  fullstack: [
    'System Design', 'Product Design', 'Experience Design',
    'Database Design', 'Mobile'
  ],
  uiux: ['Experience Design', 'Product Design', 'Streaming Architecture', 'Mobile'],
};

/**
 * Recommends courses based on onboarding settings (interests, experience level, goal),
 * excluding courses the user has already passed.
 * Falls back to a simple unscored list if the user has no usable onboarding data yet.
 */
export const getRecommendedCourses = (
  settings: UserSettings | undefined,
  allProgress: Progress[]
): Course[] => {
  const completedIds = new Set(
    allProgress.filter(p => p.passed).map(p => p.courseId)
  );

  const candidates = COURSES.filter(c => !completedIds.has(c.id));

  const scored = candidates.map(course => {
    let score = 0;

    if (settings?.interests?.includes(course.categoryId)) {
      score += 3;
    }

    if (
      settings?.experienceLevel &&
      settings.experienceLevel.toLowerCase() === course.level.toLowerCase()
    ) {
      score += 2;
    }

    if (settings?.primaryGoal === 'skills' || settings?.primaryGoal === 'explore') {
      score += 1;
    }

    return { course, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const hasAnySignal = scored.some(s => s.score > 0);

  const ranked = hasAnySignal
    ? scored.map(s => s.course)
    : candidates; // fallback: no onboarding data yet, show default order

  return ranked.slice(0, COURSE_RECOMMENDATION_LIMIT);
};

/**
 * Recommends companies based on target roles (mapped to focus tags) and
 * career-focused goals, excluding companies the user has already
 * attempted a mock interview for.
 */
export const getRecommendedCompanies = (
  settings: UserSettings | undefined,
  careerProgress: CareerProgress
): Company[] => {
  const practicedCompanyIds = new Set(
    careerProgress.mockInterviewScores.map(s => s.companyId)
  );

  const candidates = COMPANIES.filter(c => !practicedCompanyIds.has(c.id));

  const scored = candidates.map(company => {
    let score = 0;

    const targetRoles = settings?.targetRoles ?? [];
    const relevantFocusTags = targetRoles.flatMap(role => ROLE_TO_FOCUS_MAP[role] ?? []);
    const focusOverlap = company.focus.some(tag => relevantFocusTags.includes(tag));
    if (focusOverlap) {
      score += 3;
    }

    if (settings?.primaryGoal === 'job' || settings?.primaryGoal === 'interviews') {
      score += 2;
    }

    return { company, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const hasAnySignal = scored.some(s => s.score > 0);

  const ranked = hasAnySignal
    ? scored.map(s => s.company)
    : candidates;

  return ranked.slice(0, COMPANY_RECOMMENDATION_LIMIT);
};
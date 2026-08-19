import { Course, Company, UserSettings, Progress, CareerProgress } from '../types';

const COURSE_RECOMMENDATION_LIMIT = 5;
const COMPANY_RECOMMENDATION_LIMIT = 3;
const SKILL_GAP_COURSE_LIMIT = 4;

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
  allProgress: Progress[],
  coursesList: Course[]
): Course[] => {
  const completedIds = new Set(
    allProgress.filter(p => p.passed).map(p => p.courseId)
  );

  const candidates = (coursesList || []).filter(c => !completedIds.has(c.id));

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
  careerProgress: CareerProgress,
  companiesList: Company[]
): Company[] => {
  const practicedCompanyIds = new Set(
    careerProgress.mockInterviewScores.map(s => s.companyId)
  );

  const candidates = (companiesList || []).filter(c => !practicedCompanyIds.has(c.id));

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

export type SkillCategory = 'programming' | 'dsa' | 'design';

export interface SkillGap {
  skill: SkillCategory;
  current: number;
  target: number;
  gap: number; // target - current (always positive)
}

// Heuristic mapping of a company's interview "focus" tags to the three
// skill categories tracked on the Skill Radar Chart. Not derived from the
// data itself — refine as more companies/focus areas are added to constants.ts.
const FOCUS_TO_CATEGORY: Record<string, SkillCategory> = {
  'Graph Algorithms': 'dsa', 'Arrays & Strings': 'dsa', 'Trees': 'dsa', 'Recursion': 'dsa',
  'Linked Lists': 'dsa', 'Graphs': 'dsa', 'Hash Maps': 'dsa', 'Dynamic Programming': 'dsa',
  'Computational Geometry': 'dsa', 'Algorithms': 'dsa', 'Social Graphs': 'dsa', 'Data Processing': 'dsa',
  'System Design': 'design', 'OOP Design': 'design', 'Product Design': 'design', 'Database Design': 'design',
  'Experience Design': 'design', 'Streaming Architecture': 'design', 'Distributed Systems': 'design',
  'Database Internals': 'design', 'Cloud': 'design', 'Mainframe/Legacy': 'design',
  'Leadership Principles': 'programming', 'Hardware/OS': 'programming', 'Concurrency': 'programming',
  'Real-time Systems': 'programming', 'C++': 'programming', 'Java': 'programming', 'Mobile': 'programming',
  'Embedded Systems': 'programming', 'C/C++': 'programming', 'Scala': 'programming', 'Big Data': 'programming',
  'AI': 'programming', 'Low-level optimization': 'programming', 'Hardware': 'programming',
  'GPU Architecture': 'programming', 'Parallel Computing': 'programming',
};

// Baseline skill level (0-100) a learner is expected to hit for a role at
// each interview difficulty tier, before the focus-tag boost below.
const DIFFICULTY_BASE_TARGET: Record<Company['difficulty'], number> = {
  Moderate: 55,
  Hard: 70,
  'Very Hard': 85,
};

/**
 * Derives target skill levels (0-100) for a given company/role, based on its
 * interview difficulty and focus tags. Categories matching the company's
 * focus tags are boosted, since those areas matter more for that role.
 */
export const getTargetRoleSkills = (company: Company): Record<SkillCategory, number> => {
  const base = DIFFICULTY_BASE_TARGET[company.difficulty];
  const targets: Record<SkillCategory, number> = { programming: base, dsa: base, design: base };

  company.focus.forEach(tag => {
    const category = FOCUS_TO_CATEGORY[tag] ?? 'programming';
    targets[category] = Math.min(100, targets[category] + 15);
  });

  return targets;
};

/**
 * Compares a learner's current skill levels against a target role's (company's)
 * required skill levels, returning only the categories where the learner falls
 * short, sorted by largest gap first.
 */
export const getSkillGaps = (
  company: Company,
  mySkills: Record<SkillCategory, number>
): SkillGap[] => {
  const targets = getTargetRoleSkills(company);

  return (['programming', 'dsa', 'design'] as SkillCategory[])
    .map(skill => ({
      skill,
      current: mySkills[skill],
      target: targets[skill],
      gap: targets[skill] - mySkills[skill],
    }))
    .filter(g => g.gap > 0)
    .sort((a, b) => b.gap - a.gap);
};

/**
 * Suggests SkillVerse courses that can help close the given skill gaps,
 * excluding courses the learner has already passed.
 */
export const getCoursesForSkillGaps = (
  gaps: SkillGap[],
  allProgress: Progress[],
  coursesList: Course[]
): Course[] => {
  if (gaps.length === 0) return [];

  const gapCategories = new Set(gaps.map(g => g.skill));
  const completedIds = new Set(allProgress.filter(p => p.passed).map(p => p.courseId));

  return (coursesList || [])
    .filter(c => gapCategories.has(c.categoryId as SkillCategory) && !completedIds.has(c.id))
    .slice(0, SKILL_GAP_COURSE_LIMIT);
};
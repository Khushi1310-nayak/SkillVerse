import { Course, Progress } from '../types';

/**
 * Returns true when ALL prerequisite courses for `course` have been passed by
 * the learner (i.e. exist in `allProgress` with `passed === true`).
 *
 * Courses with no `prerequisiteCourseIds` (or an empty array) are always
 * considered unlocked so existing behaviour is completely unchanged.
 */
export function isCourseUnlocked(course: Course, allProgress: Progress[]): boolean {
  if (!course.prerequisiteCourseIds?.length) return true;
  return course.prerequisiteCourseIds.every(prereqId =>
    allProgress.some(p => p.courseId === prereqId && p.passed)
  );
}

/**
 * Returns the `Course` objects for every prerequisite that the learner has
 * NOT yet passed. An empty array means the course is fully unlocked.
 */
export function getIncompletePrerequisites(
  course: Course,
  allCourses: Course[],
  allProgress: Progress[]
): Course[] {
  if (!course.prerequisiteCourseIds?.length) return [];
  return course.prerequisiteCourseIds
    .filter(prereqId => !allProgress.some(p => p.courseId === prereqId && p.passed))
    .map(prereqId => allCourses.find(c => c.id === prereqId))
    .filter((c): c is Course => c !== undefined);
}

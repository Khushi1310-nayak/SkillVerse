import { PLAYGROUND_PROBLEMS, getGenericPlaygroundProblem, PracticeProblem } from './playgroundProblems';
import { getDayHash } from './dailyQuizGenerator';

/**
 * Returns a dynamic daily practice problem with starter code ("half code")
 * for any course and module index (0 to 7). Problems rotate daily.
 */
export function getDailyPlaygroundProblem(courseId: string, moduleIndex: number, date: Date = new Date()): PracticeProblem {
  const dayHash = getDayHash(date);
  const normalizedId = courseId.toLowerCase().trim();

  // Find exact problem list for course category or generate fallback
  let problemList: PracticeProblem[] | undefined = undefined;

  if (normalizedId.includes('javascript') || normalizedId.includes('js')) {
    problemList = PLAYGROUND_PROBLEMS['javascript'];
  } else if (normalizedId.includes('typescript') || normalizedId.includes('ts')) {
    problemList = PLAYGROUND_PROBLEMS['typescript'];
  } else if (normalizedId.includes('python') || normalizedId.includes('py')) {
    problemList = PLAYGROUND_PROBLEMS['python'];
  } else if (normalizedId.includes('java') && !normalizedId.includes('script')) {
    problemList = PLAYGROUND_PROBLEMS['java'];
  } else if (normalizedId.includes('c++') || normalizedId.includes('cpp')) {
    problemList = PLAYGROUND_PROBLEMS['cpp'];
  } else if (normalizedId === 'c' || normalizedId === 'c-programming' || normalizedId.startsWith('c-')) {
    problemList = PLAYGROUND_PROBLEMS['c'];
  } else if (normalizedId.includes('go') || normalizedId.includes('golang')) {
    problemList = PLAYGROUND_PROBLEMS['go'];
  } else if (normalizedId.includes('rust')) {
    problemList = PLAYGROUND_PROBLEMS['rust'];
  } else if (normalizedId.includes('kotlin') || normalizedId.includes('kt')) {
    problemList = PLAYGROUND_PROBLEMS['kotlin'];
  } else if (normalizedId.includes('php')) {
    problemList = PLAYGROUND_PROBLEMS['php'];
  } else if (normalizedId.includes('string')) {
    problemList = PLAYGROUND_PROBLEMS['strings'];
  } else if (normalizedId.includes('array')) {
    problemList = PLAYGROUND_PROBLEMS['arrays'];
  } else if (normalizedId.includes('linked') || normalizedId.includes('list')) {
    problemList = PLAYGROUND_PROBLEMS['linked-lists'];
  } else if (normalizedId.includes('stack')) {
    problemList = PLAYGROUND_PROBLEMS['stacks'];
  } else if (normalizedId.includes('queue')) {
    problemList = PLAYGROUND_PROBLEMS['queues'];
  } else if (normalizedId.includes('tree')) {
    problemList = PLAYGROUND_PROBLEMS['trees'];
  } else if (normalizedId.includes('graph')) {
    problemList = PLAYGROUND_PROBLEMS['graphs'];
  } else if (normalizedId.includes('recur')) {
    problemList = PLAYGROUND_PROBLEMS['recursion'];
  } else {
    problemList = PLAYGROUND_PROBLEMS[normalizedId];
  }

  if (problemList && problemList.length > 0) {
    // If exact module problem exists in list (0 to 7), use that module's problem
    if (problemList[moduleIndex]) {
      return problemList[moduleIndex];
    }
    // Fallback rotation for smaller lists
    const rotatedIndex = (moduleIndex + (dayHash % problemList.length)) % problemList.length;
    return problemList[rotatedIndex];
  }

  return getGenericPlaygroundProblem(courseId, moduleIndex, dayHash);
}

/**
 * Retrieves all 8 dynamic daily problems for a course topic on a given date.
 */
export function getCoursePlaygroundProblems(courseId: string, date: Date = new Date()): PracticeProblem[] {
  return Array.from({ length: 8 }, (_, i) => getDailyPlaygroundProblem(courseId, i, date));
}

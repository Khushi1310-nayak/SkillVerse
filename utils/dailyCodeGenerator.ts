import { TOPIC_SNIPPETS, getGenericTopicSnippet } from './codeSnippets';

/**
 * Computes a deterministic day hash based on the current date (YYYY-MM-DD).
 * Ensures code snippets change dynamically every day across all courses and modules.
 */
export function getDayHash(date: Date = new Date()): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return date.getFullYear() * 366 + dayOfYear;
}

/**
 * Retrieves a real, executable, topic-specific code snippet for a given course topic and module.
 * Rotates daily based on the current day hash.
 * 
 * @param topic The course title/topic (e.g., 'JavaScript', 'Arrays', 'UI Design')
 * @param moduleIndex Module index (0 to 7)
 * @param date Optional date parameter for testing/rotation
 */
export function getDailyCodeSnippet(topic: string, moduleIndex: number, date: Date = new Date()): string {
  const dayHash = getDayHash(date);
  const topicSnippets = TOPIC_SNIPPETS[topic];

  if (topicSnippets && topicSnippets[moduleIndex] && topicSnippets[moduleIndex].length > 0) {
    const variations = topicSnippets[moduleIndex];
    const selectedVariationIndex = (dayHash + moduleIndex) % variations.length;
    return variations[selectedVariationIndex].code;
  }

  // Generate a topic-tailored, runnable snippet if specific variation list is absent
  return getGenericTopicSnippet(topic, moduleIndex, dayHash);
}

import { TOPIC_QUIZZES, getGenericTopicQuiz, RawQuizItem } from './quizRepository';
import { QuizQuestion } from '../types';

/**
 * Computes a deterministic day hash based on the current date (YYYY-MM-DD).
 */
export function getDayHash(date: Date = new Date()): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return date.getFullYear() * 366 + dayOfYear;
}

/**
 * Deterministic pseudo-random number generator seeded with an integer.
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Generates a dynamic 12-question quiz for any given course topic.
 * Questions and option ordering rotate daily based on current date.
 */
export function getDailyQuiz(topic: string, date: Date = new Date()): QuizQuestion[] {
  const dayHash = getDayHash(date);
  const rawItems: RawQuizItem[] = TOPIC_QUIZZES[topic] || getGenericTopicQuiz(topic, dayHash);

  const rng = seededRandom(dayHash + topic.length);

  return rawItems.map((item, index) => {
    // Make a copy of options
    const optionsCopy = [...item.opts];

    // Fisher-Yates deterministic shuffle using seeded RNG
    for (let i = optionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
    }

    // Locate where the correct answer moved to after shuffle
    let correctIndex = optionsCopy.indexOf(item.correct);
    if (correctIndex === -1) {
      correctIndex = 0; // Fallback safety
    }

    return {
      id: index + 1,
      question: item.q,
      options: optionsCopy,
      correctAnswer: correctIndex
    };
  });
}

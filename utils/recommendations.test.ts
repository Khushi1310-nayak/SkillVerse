import { describe, it, expect } from 'vitest';
import { getWeakTopics, getWeakTopicRecommendations } from './recommendations';
import { Course, Progress } from '../types';

const mockCourses: Course[] = [
  {
    id: 'recursion',
    categoryId: 'dsa',
    title: 'Recursion',
    description: 'Master Recursion',
    icon: 'BookOpen',
    duration: '8 Hours',
    level: 'Beginner',
    content: '',
    resources: [],
    quiz: [{ id: 1, question: 'Q1', options: ['A'], correctAnswer: 0 }]
  },
  {
    id: 'arrays',
    categoryId: 'dsa',
    title: 'Arrays',
    description: 'Master Arrays',
    icon: 'BookOpen',
    duration: '8 Hours',
    level: 'Beginner',
    content: '',
    resources: [],
    quiz: [{ id: 1, question: 'Q1', options: ['A'], correctAnswer: 0 }]
  },
  {
    id: 'graphs',
    categoryId: 'dsa',
    title: 'Graphs',
    description: 'Master Graphs',
    icon: 'BookOpen',
    duration: '8 Hours',
    level: 'Intermediate',
    content: '',
    resources: [],
    quiz: [{ id: 1, question: 'Q1', options: ['A'], correctAnswer: 0 }]
  },
  {
    id: 'trees',
    categoryId: 'dsa',
    title: 'Trees',
    description: 'Master Trees',
    icon: 'BookOpen',
    duration: '8 Hours',
    level: 'Intermediate',
    content: '',
    resources: [],
    quiz: [{ id: 1, question: 'Q1', options: ['A'], correctAnswer: 0 }],
    prerequisiteCourseIds: ['recursion', 'linked-lists']
  },
  {
    id: 'ui-design',
    categoryId: 'design',
    title: 'UI Design',
    description: 'Master UI Design',
    icon: 'BookOpen',
    duration: '8 Hours',
    level: 'Beginner',
    content: '',
    resources: [],
    quiz: [{ id: 1, question: 'Q1', options: ['A'], correctAnswer: 0 }]
  }
];

describe('Weak-Topic-Aware Recommendation Engine (#368)', () => {
  it('Test 1 — No missed questions', () => {
    const progress: Progress[] = [
      { courseId: 'recursion', completed: true, score: 100, passed: true, missedQuestionIds: [] },
      { courseId: 'arrays', completed: true, score: 90, passed: true, missedQuestionIds: [] }
    ];

    const weakTopics = getWeakTopics(progress, mockCourses);
    expect(weakTopics).toEqual([]);

    const recs = getWeakTopicRecommendations(progress, mockCourses);
    expect(recs).toEqual([]);
  });

  it('Test 2 — Single weak topic ranking', () => {
    const progress: Progress[] = [
      { courseId: 'recursion', completed: false, score: 50, passed: false, missedQuestionIds: ['1', '2'] },
      { courseId: 'arrays', completed: false, score: 80, passed: false, missedQuestionIds: ['1'] }
    ];

    const weakTopics = getWeakTopics(progress, mockCourses);
    expect(weakTopics.length).toBe(2);
    expect(weakTopics[0].topicId).toBe('recursion');
    expect(weakTopics[0].mistakeCount).toBe(2);
    expect(weakTopics[1].topicId).toBe('arrays');
    expect(weakTopics[1].mistakeCount).toBe(1);
  });

  it('Test 3 — Repeated weak topic ranking', () => {
    const progress: Progress[] = [
      { courseId: 'recursion', completed: false, score: 20, passed: false, missedQuestionIds: ['1', '2', '3', '4', '5'] },
      { courseId: 'arrays', completed: false, score: 90, passed: false, missedQuestionIds: ['1'] },
      { courseId: 'graphs', completed: false, score: 60, passed: false, missedQuestionIds: ['1', '2'] }
    ];

    const weakTopics = getWeakTopics(progress, mockCourses);
    expect(weakTopics.map(w => w.topicId)).toEqual(['recursion', 'graphs', 'arrays']);
  });

  it('Test 4 — Course matching for weak topics', () => {
    const progress: Progress[] = [
      { courseId: 'recursion', completed: false, score: 40, passed: false, missedQuestionIds: ['1', '2'] }
    ];

    const recs = getWeakTopicRecommendations(progress, mockCourses);
    expect(recs.length).toBeGreaterThan(0);

    const recursionRec = recs.find(r => r.course.id === 'recursion');
    expect(recursionRec).toBeDefined();

    const uiDesignRec = recs.find(r => r.course.id === 'ui-design');
    expect(uiDesignRec).toBeUndefined(); // Unrelated course receives no weak-topic relevance
  });

  it('Test 5 — Multiple matching topics (deduplication & score accumulation)', () => {
    const progress: Progress[] = [
      { courseId: 'recursion', completed: false, score: 40, passed: false, missedQuestionIds: ['1', '2'] },
      { courseId: 'linked-lists', completed: false, score: 40, passed: false, missedQuestionIds: ['1'] }
    ];

    const recs = getWeakTopicRecommendations(progress, mockCourses);
    // Course 'trees' has prerequisiteCourseIds: ['recursion', 'linked-lists']
    const treeRecs = recs.filter(r => r.course.id === 'trees');
    expect(treeRecs.length).toBe(1); // Appears only once!
    expect(treeRecs[0].weakTopics).toContain('Recursion');
  });

  it('Test 6 — Existing recommendation behavior (filtering completed courses)', () => {
    const progress: Progress[] = [
      { courseId: 'recursion', completed: true, score: 70, passed: true, missedQuestionIds: ['1', '2'] }
    ];

    // Since 'recursion' has passed: true, it should not be recommended
    const recs = getWeakTopicRecommendations(progress, mockCourses);
    expect(recs.find(r => r.course.id === 'recursion')).toBeUndefined();
  });

  it('Test 7 — Truthful explanation generation', () => {
    const progress: Progress[] = [
      { courseId: 'recursion', completed: false, score: 40, passed: false, missedQuestionIds: ['1', '2', '3'] }
    ];

    const recs = getWeakTopicRecommendations(progress, mockCourses);
    const rec = recs.find(r => r.course.id === 'recursion');
    expect(rec).toBeDefined();
    expect(rec?.explanation).toContain("Recommended because you've struggled with Recursion.");
  });

  it('Test 8 — Missing question / course metadata handling', () => {
    const progress: Progress[] = [
      { courseId: 'non-existent-course', completed: false, score: 0, passed: false, missedQuestionIds: ['99'] }
    ];

    expect(() => getWeakTopics(progress, mockCourses)).not.toThrow();
    const weakTopics = getWeakTopics(progress, mockCourses);
    expect(weakTopics).toEqual([]);
  });

  it('Test 9 — Duplicate question IDs handling', () => {
    const progress: Progress[] = [
      { courseId: 'recursion', completed: false, score: 50, passed: false, missedQuestionIds: ['1', '1', '1', '2'] }
    ];

    const weakTopics = getWeakTopics(progress, mockCourses);
    expect(weakTopics[0].mistakeCount).toBe(2); // Unique IDs '1' and '2' -> count 2
  });
});

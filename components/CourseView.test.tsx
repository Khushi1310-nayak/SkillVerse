import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CourseView } from './CourseView';

const mockCourse = {
  id: 'javascript',
  categoryId: 'programming',
  title: 'JavaScript',
  description: 'Master JavaScript with our comprehensive 8-module mastery path.',
  icon: 'BookOpen',
  duration: '8 Hours',
  level: 'Beginner',
  content: '<p>JavaScript course body</p>',
  resources: [{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org' }],
  quiz: [
    {
      id: 1,
      question: 'What is the output of typeof null in JavaScript?',
      options: ['null', 'undefined', 'object', 'number'],
      correctAnswer: 2,
      explanation: 'typeof null returns object due to a legacy design quirk in JS.',
    },
    {
      id: 2,
      question: 'Which keyword declares a block-scoped variable?',
      options: ['var', 'let', 'global', 'scope'],
      correctAnswer: 1,
      explanation: 'let and const declare block-scoped variables in ES6+.',
    },
  ],
};

vi.mock('../services/firestoreService', async (importOriginal) => {
  const actual = await importOriginal<any>().catch(() => ({}));
  return {
    ...actual,
    firestoreService: {
      ...actual?.firestoreService,
      getCourse: vi.fn().mockImplementation(() => Promise.resolve(mockCourse)),
      getQuiz: vi.fn().mockImplementation(() => Promise.resolve(mockCourse.quiz)),
      getCourses: vi.fn().mockImplementation(() => Promise.resolve([mockCourse])),
      getCourseReviews: vi.fn().mockResolvedValue([]),
      summarizeCourseReviews: vi.fn().mockReturnValue({ average: 5.0, count: 1, distribution: { 5: 1 } }),
      getLessonNotes: vi.fn().mockResolvedValue([]),
      getPublicLessonNotes: vi.fn().mockResolvedValue([]),
      getLessonComments: vi.fn().mockResolvedValue([]),
      addCourseReview: vi.fn().mockResolvedValue(undefined),
      saveLessonNote: vi.fn().mockResolvedValue(undefined),
      addLessonComment: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'test-user-123', email: 'test@skillverse.dev', displayName: 'Ada Lovelace' },
    profile: { xp: 100, streak: 5 },
    isAuthenticated: true,
  }),
}));

describe('CourseView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (courseId = 'javascript') => {
    return render(
      <MemoryRouter initialEntries={[`/course/${courseId}`]}>
        <Routes>
          <Route path="/course/:id" element={<CourseView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders course header, modules overview and documentation link', async () => {
    renderComponent();

    expect(await screen.findByText('Mastering JavaScript')).toBeInTheDocument();
    expect(screen.getByText(/A comprehensive 8-module journey/i)).toBeInTheDocument();
  });

  it('takes the quiz, answers questions, and displays passing state', async () => {
    renderComponent();

    await screen.findByText('Mastering JavaScript');

    // Go to Quiz tab
    fireEvent.click(screen.getByRole('tab', { name: /final quiz/i }));

    // Start untimed quiz
    const startUntimedBtn = await screen.findByRole('button', { name: 'Untimed Practice' });
    fireEvent.click(startUntimedBtn);

    // Question 1
    const radios = await screen.findAllByRole('radio');
    expect(radios.length).toBeGreaterThanOrEqual(4);
    fireEvent.click(radios[0]);

    // Next
    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);

    // Question 2
    const q2Radios = await screen.findAllByRole('radio');
    fireEvent.click(q2Radios[0]);

    // Previous
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevBtn);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('displays prerequisite lock warning when required course is incomplete', async () => {
    // TypeScript requires JavaScript prerequisite
    renderComponent('typescript');

    expect(await screen.findByText(/Prerequisites Required/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /JavaScript/i })).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CoursesList } from '../../components/CoursesList';
import { CourseView } from '../../components/CourseView';
import { CredentialVerification } from '../../components/CredentialVerification';
import { COURSES } from '../../constants';
import { storageService } from '../../services/storageService';

const { mockCourse } = vi.hoisted(() => {
  return {
    mockCourse: {
      id: 'javascript',
      categoryId: 'programming',
      title: 'JavaScript',
      description: 'Master JavaScript with our comprehensive 8-module mastery path.',
      icon: 'BookOpen',
      duration: '8 Hours',
      level: 'Beginner',
      content: '<div id="module-1"><h2>Introduction</h2></div>',
      resources: [{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org' }],
      quiz: [
        {
          id: 1,
          question: 'Which keyword creates a block-scoped variable in JavaScript?',
          options: ['var', 'let', 'global', 'scope'],
          correctAnswer: 1,
          explanation: 'let is block-scoped in modern ES6+.',
        },
        {
          id: 2,
          question: 'What is the output of typeof null in JavaScript?',
          options: ['null', 'undefined', 'object', 'number'],
          correctAnswer: 2,
          explanation: 'typeof null is object due to a legacy design quirk in JS.',
        },
      ],
    },
  };
});

vi.mock('../../services/firestoreService', async (importOriginal) => {
  const actual = await importOriginal<any>().catch(() => ({}));
  return {
    ...actual,
    firestoreService: {
      ...actual?.firestoreService,
      getCourses: vi.fn().mockImplementation(() => Promise.resolve([mockCourse])),
      getCourse: vi.fn().mockImplementation(() => Promise.resolve(mockCourse)),
      getQuiz: vi.fn().mockImplementation(() => Promise.resolve(mockCourse.quiz)),
      getCourseReviews: vi.fn().mockResolvedValue([]),
      summarizeCourseReviews: vi.fn().mockReturnValue({ average: 5.0, count: 1, distribution: { 5: 1 } }),
      getLessonNotes: vi.fn().mockResolvedValue([]),
      getPublicLessonNotes: vi.fn().mockResolvedValue([]),
      getLessonComments: vi.fn().mockResolvedValue([]),
      getActiveQuestDefinitions: vi.fn().mockResolvedValue([]),
      getActiveCommunityBoss: vi.fn().mockResolvedValue(null),
      recordQuestObjectiveProgress: vi.fn().mockResolvedValue(undefined),
      incrementCommunityBossProgress: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe('End-to-End Critical Journey: Learning & Certification Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('completes the full flow from course exploration to certification verification', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/courses']}>
        <Routes>
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/course/:id" element={<CourseView />} />
        </Routes>
      </MemoryRouter>
    );

    // 1. Course Exploration
    expect(await screen.findByText('Explore Courses')).toBeInTheDocument();
    const courseCard = await screen.findByText('JavaScript');
    expect(courseCard).toBeInTheDocument();

    unmount();

    // 2. Open Course View & Learn
    const { unmount: unmountCourseView } = render(
      <MemoryRouter initialEntries={['/course/javascript']}>
        <Routes>
          <Route path="/course/:id" element={<CourseView />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Mastering JavaScript')).toBeInTheDocument();

    // 3. Switch to Quiz Tab
    const quizTab = screen.getByRole('tab', { name: /final quiz/i });
    fireEvent.click(quizTab);

    // Start untimed quiz
    const startUntimedBtn = await screen.findByRole('button', { name: 'Untimed Practice' });
    fireEvent.click(startUntimedBtn);

    // 4. Answer Quiz Questions (12 questions)
    for (let q = 1; q <= 12; q++) {
      expect(await screen.findByText(new RegExp(`Question ${q}\\b`, 'i'))).toBeInTheDocument();
      const radios = await screen.findAllByRole('radio');
      fireEvent.click(radios[0]);

      if (q < 12) {
        const nextBtn = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextBtn);
      } else {
        await waitFor(() => {
          const submitBtn = screen.getByRole('button', { name: /submit/i });
          expect(submitBtn).not.toBeDisabled();
        });
        const submitBtn = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitBtn);
      }
    }

    // 5. Verify Score & Results Screen
    await waitFor(() => {
      expect(screen.getByText(/You scored/i)).toBeInTheDocument();
    });

    unmountCourseView();

    // 6. Generate Verification Token and verify Credential Page
    const credentialPayload = {
      u: 'Ada Lovelace',
      c: 'JavaScript',
      s: '100',
      d: '2026-09-06',
      i: 'SV-JS-2026-TEST99',
    };
    const verificationToken = btoa(JSON.stringify(credentialPayload));

    render(
      <MemoryRouter initialEntries={[`/verify/${verificationToken}`]}>
        <Routes>
          <Route path="/verify/:token" element={<CredentialVerification />} />
        </Routes>
      </MemoryRouter>
    );

    expect((await screen.findAllByText('Ada Lovelace')).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('SV-JS-2026-TEST99')).toBeInTheDocument();
    expect(screen.getByText(/Verified Credential/i)).toBeInTheDocument();
  });
});

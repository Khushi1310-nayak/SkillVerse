import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CareerMode } from '../../components/CareerMode';
import { Company, DEFAULT_SETTINGS } from '../../types';

const { mockCompanies } = vi.hoisted(() => {
  return {
    mockCompanies: [
      {
        id: 'google',
        name: 'Google',
        logo: '/google.svg',
        difficulty: 'Hard',
        focus: ['algorithms', 'system_design'],
        description: 'Master algorithm challenges and distributed systems for Google interviews.',
        questions: [
          {
            id: 'q-goog-1',
            title: 'Design an LRU Cache with O(1) Operations',
            difficulty: 'Hard',
            tags: ['Data Structures', 'Design', 'LRU'],
            answer: '<p>Implement LRU Cache using a combination of a Doubly Linked List and a Hash Map for O(1) get and put.</p>',
            resourceLink: 'https://developer.mozilla.org',
          },
          {
            id: 'q-goog-2',
            title: 'Median of Two Sorted Arrays',
            difficulty: 'Hard',
            tags: ['Binary Search', 'Algorithms'],
            answer: '<p>Use binary search partitioning on the smaller array in O(log(min(m, n))) time complexity.</p>',
            resourceLink: 'https://developer.mozilla.org',
          },
        ],
      },
      {
        id: 'meta',
        name: 'Meta',
        logo: '/meta.svg',
        difficulty: 'Hard',
        focus: ['fullstack', 'architecture'],
        description: 'Product architecture and graph traversal questions for Meta.',
        questions: [
          {
            id: 'q-meta-1',
            title: 'Binary Tree Vertical Order Traversal',
            difficulty: 'Medium',
            tags: ['BFS', 'Tree'],
            answer: '<p>Traverse level by level maintaining column offsets in a hash map.</p>',
            resourceLink: 'https://developer.mozilla.org',
          },
        ],
      },
    ],
  };
});

vi.mock('../../services/firestoreService', async (importOriginal) => {
  const actual = await importOriginal<any>().catch(() => ({}));
  return {
    ...actual,
    firestoreService: {
      ...actual?.firestoreService,
      getCompanies: vi.fn().mockImplementation(() => Promise.resolve(mockCompanies)),
    },
  };
});

describe('End-to-End Critical Journey: Career Mode & Interview SRS Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('completes the full flow: browse companies, filter, inspect question, advance SRS box, and toggle save', async () => {
    render(
      <MemoryRouter>
        <CareerMode
          user={{
            uid: 'test-career-user',
            email: 'dev@skillverse.io',
            username: 'Grace Hopper',
            enrolledDate: '2026-01-01',
            lastActiveDate: '2026-01-01',
            courses: [],
            xp: 1200,
            level: 4,
            streak: 7,
            badges: ['interview-ready'],
            role: 'user',
            settings: {
              ...DEFAULT_SETTINGS,
              targetRoles: ['google'],
              theme: 'dark',
              gradientIntensity: 'medium',
              dailyGoal: 30,
              reminders: false,
              autoSave: true,
              instantFeedback: false,
              showAnswers: true,
              retryQuiz: true,
              soundEffects: false,
              dyslexiaFont: false,
              fontSize: 'md',
              reducedMotion: false,
              certificateName: 'Grace Hopper',
              avatarId: 'avatar-1',
              onboardingCompleted: true,
              hasSeenTour: true,
            },
          }}
        />
      </MemoryRouter>
    );

    // 1. Verify companies catalog renders after loading
    const googleHeadings = await screen.findAllByRole('heading', { name: 'Google' });
    expect(googleHeadings.length).toBeGreaterThanOrEqual(1);
    expect((await screen.findAllByRole('heading', { name: 'Meta' })).length).toBeGreaterThanOrEqual(1);

    // 2. Search & filter companies
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Meta' } });

    expect((await screen.findAllByRole('heading', { name: 'Meta' })).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Master algorithm challenges and distributed systems for Google interviews.')).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    const headingsAfterClear = await screen.findAllByRole('heading', { name: 'Google' });
    expect(headingsAfterClear.length).toBeGreaterThanOrEqual(1);

    // 3. Click company card heading to open detail view
    fireEvent.click(headingsAfterClear[headingsAfterClear.length - 1]);

    // Verify questions loaded for selected company
    expect(await screen.findByText('Design an LRU Cache with O(1) Operations')).toBeInTheDocument();
    expect(screen.getByText('Median of Two Sorted Arrays')).toBeInTheDocument();

    // 4. Expand question accordion to reveal answer
    const questionHeader = screen.getByText('Design an LRU Cache with O(1) Operations');
    fireEvent.click(questionHeader);

    expect(await screen.findByText(/Doubly Linked List and a Hash Map/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /view solution/i })[0]).toHaveAttribute('href', 'https://developer.mozilla.org');

    // 5. Toggle Question Practice State
    const practiceButtons = screen.getAllByRole('button', { name: '' });
    expect(practiceButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(practiceButtons[0]);

    // 6. Save/Bookmark Question
    const saveButtons = screen.getAllByRole('button', { name: /save question/i });
    expect(saveButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(saveButtons[0]);

    // 7. Return back to company list (close modal)
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);

    expect((await screen.findAllByRole('heading', { name: 'Google' })).length).toBeGreaterThanOrEqual(1);
    expect((await screen.findAllByRole('heading', { name: 'Meta' })).length).toBeGreaterThanOrEqual(1);
  });
});

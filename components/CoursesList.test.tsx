import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CoursesList } from './CoursesList';
const { mockCourses } = vi.hoisted(() => {
  return {
    mockCourses: [
      {
        id: 'javascript',
        categoryId: 'programming',
        title: 'JavaScript',
        description: 'Master JavaScript with our comprehensive path.',
        icon: 'BookOpen',
        duration: '8 Hours',
        level: 'Beginner',
        content: '<p>JavaScript content</p>',
        resources: [],
        quiz: [],
      },
      {
        id: 'python',
        categoryId: 'programming',
        title: 'Python',
        description: 'Master Python with our comprehensive path.',
        icon: 'BookOpen',
        duration: '9 Hours',
        level: 'Beginner',
        content: '<p>Python content</p>',
        resources: [],
        quiz: [],
      },
      {
        id: 'ui-design',
        categoryId: 'design',
        title: 'UI Design',
        description: 'Master UI Design with our comprehensive path.',
        icon: 'Palette',
        duration: '10 Hours',
        level: 'Intermediate',
        content: '<p>UI Design content</p>',
        resources: [],
        quiz: [],
      },
    ],
  };
});

vi.mock('../services/firestoreService', () => ({
  firestoreService: {
    getCourses: vi.fn().mockImplementation(() => Promise.resolve(mockCourses)),
    getCourse: vi.fn(),
  },
}));

describe('CoursesList Component Integration', () => {
  it('renders course list and search bar', async () => {
    render(
      <MemoryRouter>
        <CoursesList />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search courses/i);
    expect(searchInput).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  it('filters courses when typing in search query', async () => {
    render(
      <MemoryRouter>
        <CoursesList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search courses/i);
    fireEvent.change(searchInput, { target: { value: 'Python' } });

    await waitFor(() => {
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.queryByText('UI Design')).not.toBeInTheDocument();
    });
  });

  it('renders all category tracks in the filter bar', async () => {
    render(
      <MemoryRouter>
        <CoursesList />
      </MemoryRouter>
    );

    await screen.findByText('JavaScript');

    expect(screen.getByRole('option', { name: 'Programming' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'DSA' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Design' })).toBeInTheDocument();
  });
});



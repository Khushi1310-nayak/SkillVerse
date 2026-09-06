import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Settings } from './Settings';
import { User, DEFAULT_SETTINGS } from '../types';

const mockUser: User = {
  uid: 'user-456',
  email: 'ada@example.com',
  username: 'Ada Lovelace',
  enrolledDate: new Date('2026-01-01').toISOString(),
  lastActiveDate: new Date().toISOString(),
  courses: [],
  role: 'user',
  xp: 500,
  level: 3,
  streak: 5,
  badges: ['first-steps'],
  settings: {
    ...DEFAULT_SETTINGS,
    theme: 'dark',
    activeTheme: 'dark',
    soundEffects: true,
    instantFeedback: false,
    autoSave: true,
    dailyGoal: 30,
    dyslexiaFont: false,
    fontSize: 'md',
    reducedMotion: false,
    publicProfileEnabled: true,
    hideFromLeaderboard: false,
  },
};

vi.mock('../contexts/InstallPromptContext', () => ({
  useInstallPrompt: () => ({
    isInstallable: false,
    isInstalled: false,
    promptInstall: vi.fn(),
  }),
}));

vi.mock('../services/storageService', () => ({
  storageService: {
    getAllProgress: vi.fn().mockReturnValue([]),
    getAllSavedAINotes: vi.fn().mockReturnValue([]),
    getStreakInfo: vi.fn().mockReturnValue({ currentStreak: 3, highestStreak: 5, lastActiveDate: '2026-09-06' }),
    getAllStarredQuestions: vi.fn().mockReturnValue({}),
    updateUser: vi.fn().mockResolvedValue(undefined),
    resetProgress: vi.fn(),
    clearData: vi.fn(),
  },
}));

describe('Settings Component', () => {
  const onPreviewUpdate = vi.fn();
  const onUpdateUser = vi.fn().mockResolvedValue(undefined);
  const onLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (user = mockUser) => {
    return render(
      <MemoryRouter>
        <Settings
          user={user}
          onPreviewUpdate={onPreviewUpdate}
          onUpdateUser={onUpdateUser}
          onLogout={onLogout}
        />
      </MemoryRouter>
    );
  };

  it('renders user profile form with name and email', () => {
    renderComponent();

    expect(screen.getByDisplayValue('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ada@example.com')).toBeInTheDocument();
  });

  it('switches to appearance tab and changes theme mode', async () => {
    renderComponent();

    // Click Appearance tab
    const appearanceTab = screen.getByRole('tab', { name: /appearance/i });
    fireEvent.click(appearanceTab);

    // Switch to Light theme
    const lightBtn = screen.getByRole('button', { name: 'Light' });
    fireEvent.click(lightBtn);

    expect(onPreviewUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        settings: expect.objectContaining({
          theme: 'light',
          activeTheme: 'light',
        }),
      })
    );
  });

  it('switches to learning preferences tab and navigates sections', () => {
    renderComponent();

    // Click Learning tab
    const learningTab = screen.getByRole('tab', { name: /learning/i });
    fireEvent.click(learningTab);

    expect(screen.getByText(/Daily Study Goal/i)).toBeInTheDocument();
    expect(screen.getByText(/Sound Effects/i)).toBeInTheDocument();
  });

  it('saves profile modifications when clicking Save Changes', async () => {
    renderComponent();

    const nameInput = screen.getByDisplayValue('Ada Lovelace');
    fireEvent.change(nameInput, { target: { value: 'Ada King' } });

    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(onUpdateUser).toHaveBeenCalledTimes(1);
      expect(onUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'Ada King',
        })
      );
    });
  });
});

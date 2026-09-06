import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';
import enTranslation from '../public/locales/en/translation.json';

// Helper to resolve nested keys in translations
function resolveKey(obj: any, path: string): string | undefined {
  const parts = path.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr && typeof curr === 'object' && p in curr) {
      curr = curr[p];
    } else {
      return undefined;
    }
  }
  return typeof curr === 'string' ? curr : undefined;
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock HTMLMediaElement play/pause
window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = vi.fn();

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  currentTime: 0,
  volume: 1,
})) as any;

// Mock canvas getContext
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn().mockReturnValue({ data: [] }),
  putImageData: vi.fn(),
  createImageData: vi.fn().mockReturnValue([]),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 0 }),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
}) as any;

// Mock Monaco Editor for test stability
vi.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange, language }: any) =>
    React.createElement('textarea', {
      'data-testid': 'monaco-editor-mock',
      'data-language': language,
      value: value || '',
      onChange: (e: any) => onChange && onChange(e.target.value),
    }),
}));

// Mock react-i18next with actual English dictionary translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const resolved = resolveKey(enTranslation, key);
      if (resolved) {
        if (options && typeof options === 'object') {
          return Object.keys(options).reduce(
            (acc, k) => acc.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k])),
            resolved
          );
        }
        return resolved;
      }
      return typeof options === 'string' ? options : key;
    },
    i18n: {
      changeLanguage: vi.fn().mockResolvedValue(undefined),
      language: 'en',
    },
  }),
  Trans: ({ children }: any) => children,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock ToastContext
vi.mock('../contexts/ToastContext', async (importOriginal) => {
  const actual = await importOriginal<any>().catch(() => ({}));
  return {
    ...actual,
    useToast: () => ({
      toasts: [],
      showToast: vi.fn().mockReturnValue('toast-123'),
      dismissToast: vi.fn(),
    }),
    ToastProvider: ({ children }: any) => children,
  };
});

// Mock AuthContext
vi.mock('../contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<any>().catch(() => ({}));
  const defaultMockUser = {
    uid: 'test-user-uid-123',
    email: 'ada@example.com',
    displayName: 'Ada Lovelace',
    avatar: '1',
    role: 'user',
    createdAt: new Date().toISOString(),
    settings: {
      theme: 'dark',
      activeTheme: 'dark',
      soundEffects: true,
      instantFeedback: false,
      autoSave: true,
      focusDuration: 25,
      dyslexicFont: false,
      fontSize: 'normal',
      reduceMotion: false,
    },
  };

  return {
    ...actual,
    useAuthContext: () => ({
      user: { uid: 'test-user-uid-123', email: 'ada@example.com' },
      appUser: defaultMockUser,
      loading: false,
      login: vi.fn().mockResolvedValue(undefined),
      signup: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
      resetPassword: vi.fn().mockResolvedValue(undefined),
      loginWithGoogle: vi.fn().mockResolvedValue(undefined),
      loginWithGithub: vi.fn().mockResolvedValue(undefined),
      resendVerificationEmail: vi.fn().mockResolvedValue(undefined),
      updateUserProfile: vi.fn().mockResolvedValue(undefined),
      updateUserSettings: vi.fn().mockResolvedValue(undefined),
      updateUserAccount: vi.fn().mockResolvedValue(undefined),
      updateLocalUser: vi.fn(),
      completeCourse: vi.fn().mockResolvedValue(undefined),
      purchaseItem: vi.fn().mockResolvedValue(undefined),
    }),
    AuthProvider: ({ children }: any) => children,
  };
});



import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useActiveTimer } from './useActiveTimer';
import { storageService } from '../services/storageService';

describe('useActiveTimer Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(storageService, 'saveStudyTime').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('accumulates active time and flushes when unmounting', () => {
    // Mock document visible and hasFocus
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    Object.defineProperty(document, 'hasFocus', { value: () => true, writable: true });

    const { unmount } = renderHook(() => useActiveTimer());

    // Advance 5 seconds
    vi.advanceTimersByTime(5000);
    unmount();

    expect(storageService.saveStudyTime).toHaveBeenCalled();
  });

  it('flushes accumulated time on window blur', () => {
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    Object.defineProperty(document, 'hasFocus', { value: () => true, writable: true });

    renderHook(() => useActiveTimer());

    vi.advanceTimersByTime(3000);
    window.dispatchEvent(new Event('blur'));

    expect(storageService.saveStudyTime).toHaveBeenCalled();
  });
});

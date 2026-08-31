import { useState, useEffect, useRef, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { soundManager } from '../utils/soundManager';

export type PomodoroPhase = 'focus' | 'break';

export const FOCUS_DURATION_SEC = 25 * 60; // 25 minutes
export const BREAK_DURATION_SEC = 5 * 60;   // 5 minutes

export interface UseFocusTimerReturn {
  phase: PomodoroPhase;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skipPhase: () => void;
  formatTime: (seconds: number) => string;
}

export const formatPomodoroTime = (seconds: number): string => {
  const m = Math.floor(Math.max(0, seconds) / 60).toString().padStart(2, '0');
  const s = (Math.max(0, seconds) % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const useFocusTimer = (): UseFocusTimerReturn => {
  const [phase, setPhase] = useState<PomodoroPhase>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(FOCUS_DURATION_SEC);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const totalDuration = phase === 'focus' ? FOCUS_DURATION_SEC : BREAK_DURATION_SEC;

  const targetEndTimeRef = useRef<number | null>(null);
  const accumulatedFocusSecRef = useRef<number>(0);
  const lastCheckTimeRef = useRef<number>(Date.now());
  const isRunningRef = useRef<boolean>(false);
  const phaseRef = useRef<PomodoroPhase>('focus');

  // Keep refs in sync with state for lifecycle/cleanup callbacks
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Flush accumulated focus seconds to storageService.saveStudyTime
  const flushFocusTime = useCallback(() => {
    if (phaseRef.current === 'focus' && accumulatedFocusSecRef.current > 0) {
      const secondsToSave = Math.floor(accumulatedFocusSecRef.current);
      if (secondsToSave > 0) {
        storageService.saveStudyTime(secondsToSave);
        accumulatedFocusSecRef.current -= secondsToSave;
      }
    }
    lastCheckTimeRef.current = Date.now();
  }, []);

  // Timer tick evaluation using wall-clock timestamp comparison
  const tick = useCallback(() => {
    const now = Date.now();

    if (isRunningRef.current && targetEndTimeRef.current !== null) {
      // 1. Calculate focus study time delta if currently in focus phase
      if (phaseRef.current === 'focus') {
        const deltaMs = now - lastCheckTimeRef.current;
        if (deltaMs > 0) {
          accumulatedFocusSecRef.current += deltaMs / 1000;
          if (accumulatedFocusSecRef.current >= 1) {
            const secondsToSave = Math.floor(accumulatedFocusSecRef.current);
            if (secondsToSave > 0) {
              storageService.saveStudyTime(secondsToSave);
              accumulatedFocusSecRef.current -= secondsToSave;
            }
          }
        }
      }
      lastCheckTimeRef.current = now;

      // 2. Calculate remaining phase time based on wall-clock target
      const remainingSec = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
      setTimeLeft(remainingSec);

      // 3. Phase completion check
      if (remainingSec <= 0) {
        targetEndTimeRef.current = null;
        setIsRunning(false);
        isRunningRef.current = false;
        flushFocusTime();

        // Switch phase and play sound alert
        if (phaseRef.current === 'focus') {
          soundManager.playFanfare();
          setPhase('break');
          phaseRef.current = 'break';
          setTimeLeft(BREAK_DURATION_SEC);
        } else {
          soundManager.playCorrect();
          setPhase('focus');
          phaseRef.current = 'focus';
          setTimeLeft(FOCUS_DURATION_SEC);
        }
      }
    } else {
      lastCheckTimeRef.current = now;
    }
  }, [flushFocusTime]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(tick, 1000);
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        tick();
      } else {
        // Flush focus seconds when page is hidden
        flushFocusTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flushFocusTime();
    };
  }, [isRunning, tick, flushFocusTime]);

  const start = useCallback(() => {
    const now = Date.now();
    lastCheckTimeRef.current = now;
    targetEndTimeRef.current = now + timeLeft * 1000;
    setIsRunning(true);
    isRunningRef.current = true;
  }, [timeLeft]);

  const pause = useCallback(() => {
    if (targetEndTimeRef.current !== null) {
      const now = Date.now();
      const remainingSec = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
      setTimeLeft(remainingSec);
      targetEndTimeRef.current = null;
    }
    setIsRunning(false);
    isRunningRef.current = false;
    flushFocusTime();
  }, [flushFocusTime]);

  const resume = useCallback(() => {
    const now = Date.now();
    lastCheckTimeRef.current = now;
    targetEndTimeRef.current = now + timeLeft * 1000;
    setIsRunning(true);
    isRunningRef.current = true;
  }, [timeLeft]);

  const reset = useCallback(() => {
    targetEndTimeRef.current = null;
    setIsRunning(false);
    isRunningRef.current = false;
    flushFocusTime();
    setPhase('focus');
    phaseRef.current = 'focus';
    setTimeLeft(FOCUS_DURATION_SEC);
  }, [flushFocusTime]);

  const skipPhase = useCallback(() => {
    targetEndTimeRef.current = null;
    setIsRunning(false);
    isRunningRef.current = false;
    flushFocusTime();

    if (phase === 'focus') {
      setPhase('break');
      phaseRef.current = 'break';
      setTimeLeft(BREAK_DURATION_SEC);
    } else {
      setPhase('focus');
      phaseRef.current = 'focus';
      setTimeLeft(FOCUS_DURATION_SEC);
    }
  }, [phase, flushFocusTime]);

  return {
    phase,
    timeLeft,
    totalDuration,
    isRunning,
    start,
    pause,
    resume,
    reset,
    skipPhase,
    formatTime: formatPomodoroTime,
  };
};

import { useCallback, useEffect, useRef, useState } from 'react';
import { safeStorage } from '../utils/safeStorage';

/**
 * The retry cooldown that gates a failed quiz.
 *
 * The countdown used to be a plain decrement — `setTimeLeft(prev => prev - 1)`
 * once a second — with the stored start timestamp read only on mount. Browsers
 * throttle `setInterval` in a background tab to roughly once a minute, so the
 * counter stopped tracking wall-clock the moment the user switched tabs: a
 * five-minute cooldown that was started and then backgrounded came back still
 * showing four and a half minutes, and the retry button stayed disabled long
 * after the cooldown had actually expired.
 *
 * Every tick here recomputes the remaining time from the stored deadline
 * instead, so a throttled interval costs update *frequency* and nothing else.
 * A `visibilitychange` listener resyncs the moment the tab is foregrounded, so
 * the user never sees a stale number even for one tick.
 */

/** Storage key for a course's cooldown. The stored value is the start time in
 *  epoch milliseconds — kept in that shape so cooldowns already running in a
 *  user's browser survive this change. */
const cooldownKeyFor = (courseId: string) => `cooldown_${courseId}`;

const secondsRemaining = (startedAt: number, durationMs: number): number =>
  Math.max(0, Math.ceil((startedAt + durationMs - Date.now()) / 1000));

export interface QuizCooldown {
  /** Whole seconds left, 0 when no cooldown is active. */
  secondsLeft: number;
  isActive: boolean;
  /** Starts (or restarts) the cooldown from now. */
  start: () => void;
  /** Ends it early — used when progress is reset. */
  clear: () => void;
}

export const useQuizCooldown = (
  courseId: string | undefined,
  durationMs: number
): QuizCooldown => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Reads the stored deadline and brings `secondsLeft` back in line with the
   * clock. Called on mount, on every tick, and whenever the tab is shown.
   */
  const sync = useCallback(() => {
    if (!courseId) {
      setSecondsLeft(0);
      return 0;
    }

    const key = cooldownKeyFor(courseId);
    const raw = safeStorage.getString(key);
    if (raw === null) {
      setSecondsLeft(0);
      return 0;
    }

    const startedAt = Number.parseInt(raw, 10);
    if (!Number.isFinite(startedAt)) {
      // A hand-edited or half-written value would otherwise produce NaN and
      // leave the retry button disabled forever.
      safeStorage.remove(key);
      setSecondsLeft(0);
      return 0;
    }

    const remaining = secondsRemaining(startedAt, durationMs);
    if (remaining === 0) {
      safeStorage.remove(key);
    }

    setSecondsLeft(remaining);
    return remaining;
  }, [courseId, durationMs]);

  const startTicking = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      // Derived from the deadline, never decremented, so a throttled tick is
      // late rather than wrong.
      if (sync() === 0) stopInterval();
    }, 1000);
  }, [stopInterval, sync]);

  const start = useCallback(() => {
    if (!courseId) return;
    safeStorage.setString(cooldownKeyFor(courseId), Date.now().toString());
    sync();
    startTicking();
  }, [courseId, startTicking, sync]);

  const clear = useCallback(() => {
    if (courseId) safeStorage.remove(cooldownKeyFor(courseId));
    stopInterval();
    setSecondsLeft(0);
  }, [courseId, stopInterval]);

  useEffect(() => {
    if (sync() > 0) startTicking();

    // A background tab may not tick at all for minutes. Resync as soon as it
    // comes back so the button state is right on the first frame.
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (sync() > 0) startTicking();
      else stopInterval();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      stopInterval();
    };
  }, [sync, startTicking, stopInterval]);

  return { secondsLeft, isActive: secondsLeft > 0, start, clear };
};

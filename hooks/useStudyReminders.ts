import { useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { User } from '../types';

const REMINDER_SENT_KEY = 'skillverse_last_reminder_sent_date';
const CHECK_INTERVAL_MS = 60_000; // check once per minute

/**
 * Returns today's local date string in YYYY-MM-DD format.
 */
const todayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns the current local time as HH:MM.
 */
const currentTimeHHMM = (): string => {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Global background hook that checks once per minute whether a study
 * reminder notification should fire.
 *
 * A notification fires when ALL of the following are true:
 *  1. `user.settings.reminders` is true.
 *  2. The browser supports and has granted notification permission.
 *  3. The current local time >= the user's configured `reminderTime` (HH:MM).
 *  4. The user has NOT yet met today's daily study goal (seconds studied today
 *     is less than `dailyGoal * 60`).
 *  5. No reminder notification has already been sent today.
 *
 * This hook must be mounted inside the authenticated Layout so it persists
 * across navigation without requiring any backend or service worker.
 */
export const useStudyReminders = (user: User | null): void => {
  // Use a ref so the interval closure always sees the latest user without
  // needing to tear down / re-create the interval on every settings change.
  const userRef = useRef<User | null>(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const check = () => {
      const u = userRef.current;
      if (!u) return;

      const { reminders, dailyGoal, reminderTime = '18:00' } = u.settings;

      // Gate 1: feature enabled
      if (!reminders) return;

      // Gate 2: browser support + permission
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      // Gate 3: time has been reached for today
      const now = currentTimeHHMM();
      if (now < reminderTime) return;

      // Gate 4: no reminder already sent today
      const today = todayString();
      const lastSent = localStorage.getItem(REMINDER_SENT_KEY);
      if (lastSent === today) return;

      // Gate 5: daily goal not yet completed
      const records = storageService.getStudyTimeRecords();
      const studiedSecondsToday = records[today] ?? 0;
      const goalSeconds = (dailyGoal ?? 60) * 60;
      if (studiedSecondsToday >= goalSeconds) return;

      // All gates passed — fire the notification and record it.
      localStorage.setItem(REMINDER_SENT_KEY, today);
      try {
        new Notification('SkillVerse Study Reminder 📚', {
          body: `You still have ${Math.ceil((goalSeconds - studiedSecondsToday) / 60)} minutes to go to hit your daily goal. Keep it up!`,
          icon: '/favicon.ico',
          tag: 'skillverse-study-reminder', // prevents stacking duplicate notifications
        });
      } catch {
        // Notification constructor can throw in some environments; fail silently.
      }
    };

    // Run once immediately on mount, then on the interval.
    check();
    const intervalId = setInterval(check, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, []); // empty deps — interval is stable; user data accessed via ref
};

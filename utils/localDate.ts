/**
 * Local calendar date helpers.
 *
 * Every "what day is it" decision in SkillVerse — streak squares, weekly XP
 * buckets, study-time totals, the once-per-day streak celebration — has to
 * agree on the same answer. The tempting one-liner for that is
 * `date.toISOString().split('T')[0]`, but `toISOString()` converts to UTC
 * first, so for roughly half of every day it returns a different calendar
 * date than the one on the learner's wall clock.
 *
 * The whole feature only works if the code that *writes* a date key and the
 * code that *reads* it use the same definition, so these helpers are the one
 * definition: the learner's local calendar date, formatted as YYYY-MM-DD.
 */

/** `YYYY-MM-DD` for the given date in the learner's local timezone. */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts an ISO timestamp (as stored on `Progress.completedDate`, note
 * `createdAt`, and friends) into the local calendar date it fell on.
 *
 * Splitting the raw ISO string on `'T'` looks equivalent and is not: the
 * stored string is UTC, so `2026-08-26T02:30:00.000Z` is the 25th for anyone
 * in the Americas. Returns `null` for a missing or unparseable value so
 * callers can skip the record rather than key something under `"NaN-NaN-NaN"`.
 */
export const isoToLocalDateString = (iso: string | undefined | null): string | null => {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return getLocalDateString(parsed);
};

/**
 * Parses a `YYYY-MM-DD` key back into a Date at local midnight.
 *
 * `new Date('2026-08-26')` is parsed as UTC midnight by the spec, which then
 * renders as the *previous* day in any timezone behind UTC. Appending an
 * explicit time forces local-time parsing.
 */
export const parseLocalDateString = (dateStr: string): Date => new Date(`${dateStr}T00:00:00`);

/** The local calendar date `days` before/after `dateStr`, as a new key. */
export const shiftLocalDateString = (dateStr: string, days: number): string => {
  const date = parseLocalDateString(dateStr);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
};

/**
 * Whole calendar days between two `YYYY-MM-DD` keys (`b - a`).
 *
 * Rounds because a DST transition makes the span 23 or 25 hours, and an
 * unrounded division would report `0.958` for two genuinely consecutive days
 * and quietly break a streak every spring.
 */
export const daysBetweenLocalDateStrings = (a: string, b: string): number => {
  const start = parseLocalDateString(a).getTime();
  const end = parseLocalDateString(b).getTime();
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

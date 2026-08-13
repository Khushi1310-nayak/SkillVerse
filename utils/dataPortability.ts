/**
 * Backup and restore of everything SkillVerse keeps in LocalStorage.
 *
 * All learner progress (courses, career mode, notes, streaks, study time)
 * is client-side only, so clearing site data or moving to another browser
 * loses it permanently. This module produces a single portable JSON file
 * and restores it again, validating the payload before it touches storage.
 */

import { Progress, CareerProgress, SavedAINote, LessonNote } from '../types';
import { StreakData } from '../services/storageService';

export const BACKUP_APP_MARKER = 'skillverse';
export const BACKUP_SCHEMA_VERSION = 1;

/** Schema versions this build knows how to read. */
const SUPPORTED_SCHEMA_VERSIONS = [1];

export interface BackupEnvelope {
  app: typeof BACKUP_APP_MARKER;
  schemaVersion: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export interface BackupSummary {
  courses: number;
  practicedQuestions: number;
  mockInterviews: number;
  aiNotes: number;
  lessonNotes: number;
  trackedDays: number;
  studyDays: number;
}

export interface ValidationResult {
  ok: boolean;
  envelope: BackupEnvelope | null;
  summary: BackupSummary | null;
  errors: string[];
  /** Keys present in the file that this build does not recognise. */
  skippedKeys: string[];
}

export type ImportMode = 'merge' | 'replace';

export interface ImportResult {
  ok: boolean;
  restoredKeys: string[];
  failedKeys: string[];
  errors: string[];
}

// --- Storage keys -----------------------------------------------------------
// Kept in sync with services/storageService.ts.

export const PROGRESS_KEY = 'skillverse_progress';
export const CAREER_KEY = 'skillverse_career';
export const LAST_VISITED_KEY = 'skillverse_last_visited';
export const AI_NOTES_KEY = 'skillverse_ai_notes';
export const LESSON_NOTES_KEY = 'skillverse_lesson_notes';
export const STREAK_KEY = 'skillverse_streak_data';
export const STUDY_TIME_KEY = 'skillverse_study_time';

const isPlainObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Every key we export, with the shape check used on import. Anything not
 * listed here is deliberately left alone — settings live on the Firestore
 * user document, and one-off UI keys are not worth carrying between devices.
 */
const BACKUP_KEYS: { key: string; validate: (value: unknown) => boolean }[] = [
  { key: PROGRESS_KEY, validate: Array.isArray },
  { key: CAREER_KEY, validate: isPlainObject },
  { key: AI_NOTES_KEY, validate: Array.isArray },
  { key: LESSON_NOTES_KEY, validate: Array.isArray },
  { key: STREAK_KEY, validate: isPlainObject },
  { key: STUDY_TIME_KEY, validate: isPlainObject },
  { key: LAST_VISITED_KEY, validate: isPlainObject },
];

const readKey = (key: string): unknown => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch (err) {
    console.warn(`Skipping "${key}" during export — it is not valid JSON:`, err);
    return undefined;
  }
};

const writeKey = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Could not restore "${key}":`, err);
    return false;
  }
};

// --- Export -----------------------------------------------------------------

/** Builds the backup envelope from whatever is currently in LocalStorage. */
export const buildBackup = (): BackupEnvelope => {
  const data: Record<string, unknown> = {};

  BACKUP_KEYS.forEach(({ key, validate }) => {
    const value = readKey(key);
    // Do not export a value we would refuse to import again.
    if (value !== undefined && validate(value)) {
      data[key] = value;
    }
  });

  return {
    app: BACKUP_APP_MARKER,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
};

/** Human-readable counts, used to preview a backup before writing anything. */
export const summarize = (envelope: BackupEnvelope): BackupSummary => {
  const data = envelope.data || {};

  const progress = (data[PROGRESS_KEY] as Progress[]) || [];
  const career = (data[CAREER_KEY] as CareerProgress) || null;
  const aiNotes = (data[AI_NOTES_KEY] as SavedAINote[]) || [];
  const lessonNotes = (data[LESSON_NOTES_KEY] as LessonNote[]) || [];
  const streak = (data[STREAK_KEY] as StreakData) || null;
  const studyTime = (data[STUDY_TIME_KEY] as Record<string, number>) || null;

  return {
    courses: progress.length,
    practicedQuestions: career?.practicedQuestions?.length || 0,
    mockInterviews: career?.mockInterviewScores?.length || 0,
    aiNotes: aiNotes.length,
    lessonNotes: lessonNotes.length,
    trackedDays: streak?.activities ? Object.keys(streak.activities).length : 0,
    studyDays: studyTime ? Object.keys(studyTime).length : 0,
  };
};

export const buildBackupFilename = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `skillverse-backup-${year}-${month}-${day}.json`;
};

/** Serialises the backup and hands it to the browser as a file download. */
export const downloadBackup = (envelope: BackupEnvelope): void => {
  const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = buildBackupFilename();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the blob once the download has been handed off.
  URL.revokeObjectURL(url);
};

// --- Validation -------------------------------------------------------------

/**
 * Checks a parsed file before any of it is written. A backup that fails here
 * is rejected outright rather than partially applied.
 */
export const validateBackup = (parsed: unknown): ValidationResult => {
  const errors: string[] = [];
  const skippedKeys: string[] = [];

  if (!isPlainObject(parsed)) {
    return { ok: false, envelope: null, summary: null, errors: ['The file is not a JSON object.'], skippedKeys };
  }

  if (parsed.app !== BACKUP_APP_MARKER) {
    errors.push('This file was not exported from SkillVerse.');
  }

  if (typeof parsed.schemaVersion !== 'number') {
    errors.push('The backup is missing a schema version.');
  } else if (!SUPPORTED_SCHEMA_VERSIONS.includes(parsed.schemaVersion)) {
    errors.push(
      `Backup schema v${parsed.schemaVersion} is not supported by this version of SkillVerse.`
    );
  }

  if (!isPlainObject(parsed.data)) {
    errors.push('The backup does not contain a data section.');
  }

  if (errors.length > 0) {
    return { ok: false, envelope: null, summary: null, errors, skippedKeys };
  }

  // Drop anything unrecognised or wrongly shaped instead of writing it blindly.
  const cleaned: Record<string, unknown> = {};
  Object.entries(parsed.data as Record<string, unknown>).forEach(([key, value]) => {
    const known = BACKUP_KEYS.find(entry => entry.key === key);
    if (!known) {
      skippedKeys.push(key);
      return;
    }
    if (!known.validate(value)) {
      skippedKeys.push(key);
      return;
    }
    cleaned[key] = value;
  });

  if (Object.keys(cleaned).length === 0) {
    return {
      ok: false,
      envelope: null,
      summary: null,
      errors: ['The backup does not contain any restorable SkillVerse data.'],
      skippedKeys,
    };
  }

  const envelope: BackupEnvelope = {
    app: BACKUP_APP_MARKER,
    schemaVersion: parsed.schemaVersion as number,
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
    data: cleaned,
  };

  return { ok: true, envelope, summary: summarize(envelope), errors, skippedKeys };
};

/** Reads a `File` and validates it in one step. */
export const readBackupFile = async (file: File): Promise<ValidationResult> => {
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, envelope: null, summary: null, errors: ['The file could not be read.'], skippedKeys: [] };
  }

  try {
    return validateBackup(JSON.parse(text));
  } catch {
    return { ok: false, envelope: null, summary: null, errors: ['The file is not valid JSON.'], skippedKeys: [] };
  }
};

// --- Merge strategies -------------------------------------------------------

const mergeProgress = (current: Progress[], incoming: Progress[]): Progress[] => {
  const byCourse = new Map<string, Progress>();
  current.forEach(entry => entry?.courseId && byCourse.set(entry.courseId, entry));

  incoming.forEach(entry => {
    if (!entry?.courseId) return;
    const existing = byCourse.get(entry.courseId);
    if (!existing) {
      byCourse.set(entry.courseId, entry);
      return;
    }
    // Keep the better attempt so importing an older backup never demotes you.
    byCourse.set(entry.courseId, {
      ...existing,
      ...entry,
      score: Math.max(existing.score ?? 0, entry.score ?? 0),
      passed: Boolean(existing.passed || entry.passed),
      completed: Boolean(existing.completed || entry.completed),
    });
  });

  return Array.from(byCourse.values());
};

const mergeCareer = (current: CareerProgress, incoming: CareerProgress): CareerProgress => {
  const srsData = { ...(current.srsData || {}) };
  Object.entries(incoming.srsData || {}).forEach(([questionId, entry]) => {
    const existing = srsData[questionId];
    // A higher Leitner box means the question is better learned — keep it.
    if (!existing || (entry?.srsInterval ?? 0) > (existing.srsInterval ?? 0)) {
      srsData[questionId] = entry;
    }
  });

  const seenScores = new Set<string>();
  const mockInterviewScores = [
    ...(current.mockInterviewScores || []),
    ...(incoming.mockInterviewScores || []),
  ].filter(score => {
    const fingerprint = `${score?.companyId}|${score?.date}|${score?.score}`;
    if (seenScores.has(fingerprint)) return false;
    seenScores.add(fingerprint);
    return true;
  });

  return {
    practicedQuestions: Array.from(
      new Set([...(current.practicedQuestions || []), ...(incoming.practicedQuestions || [])])
    ),
    savedQuestions: Array.from(
      new Set([...(current.savedQuestions || []), ...(incoming.savedQuestions || [])])
    ),
    mockInterviewScores,
    srsData,
  };
};

/** Union of two note lists by id, keeping whichever copy was edited last. */
const mergeNotes = <T extends { id: string; updatedAt?: string; savedAt?: string }>(
  current: T[],
  incoming: T[]
): T[] => {
  const byId = new Map<string, T>();
  const stamp = (note: T) => Date.parse(note.updatedAt || note.savedAt || '') || 0;

  [...current, ...incoming].forEach(note => {
    if (!note?.id) return;
    const existing = byId.get(note.id);
    if (!existing || stamp(note) >= stamp(existing)) {
      byId.set(note.id, note);
    }
  });

  return Array.from(byId.values());
};

const mergeStreak = (current: StreakData, incoming: StreakData): StreakData => {
  const activities = { ...(current.activities || {}) };
  Object.entries(incoming.activities || {}).forEach(([date, activity]) => {
    const existing = activities[date];
    if (!existing || (activity?.xp ?? 0) > (existing.xp ?? 0)) {
      activities[date] = activity;
    }
  });

  return {
    longestStreak: Math.max(current.longestStreak || 0, incoming.longestStreak || 0),
    activities,
  };
};

/**
 * Per-day study seconds. Deliberately `max` rather than a sum — importing the
 * same backup twice must not double the time you appear to have studied.
 */
const mergeStudyTime = (
  current: Record<string, number>,
  incoming: Record<string, number>
): Record<string, number> => {
  const merged = { ...current };
  Object.entries(incoming).forEach(([date, seconds]) => {
    if (typeof seconds !== 'number' || Number.isNaN(seconds)) return;
    merged[date] = Math.max(merged[date] || 0, seconds);
  });
  return merged;
};

const mergeLastVisited = (current: any, incoming: any) => {
  const currentAt = Date.parse(current?.visitedAt || '') || 0;
  const incomingAt = Date.parse(incoming?.visitedAt || '') || 0;
  return incomingAt > currentAt ? incoming : current;
};

/** Combines a stored value with the incoming one according to its key. */
const mergeValue = (key: string, current: unknown, incoming: unknown): unknown => {
  if (current === undefined) return incoming;

  switch (key) {
    case PROGRESS_KEY:
      return mergeProgress(current as Progress[], incoming as Progress[]);
    case CAREER_KEY:
      return mergeCareer(current as CareerProgress, incoming as CareerProgress);
    case AI_NOTES_KEY:
      return mergeNotes(current as SavedAINote[], incoming as SavedAINote[]);
    case LESSON_NOTES_KEY:
      return mergeNotes(current as LessonNote[], incoming as LessonNote[]);
    case STREAK_KEY:
      return mergeStreak(current as StreakData, incoming as StreakData);
    case STUDY_TIME_KEY:
      return mergeStudyTime(current as Record<string, number>, incoming as Record<string, number>);
    case LAST_VISITED_KEY:
      return mergeLastVisited(current, incoming);
    default:
      return incoming;
  }
};

// --- Import -----------------------------------------------------------------

/**
 * Writes a validated backup into LocalStorage.
 *
 * `merge` (the default) combines the backup with what is already there;
 * `replace` overwrites each key present in the backup. Keys absent from the
 * backup are never touched in either mode.
 */
export const restoreBackup = (envelope: BackupEnvelope, mode: ImportMode = 'merge'): ImportResult => {
  const restoredKeys: string[] = [];
  const failedKeys: string[] = [];
  const errors: string[] = [];

  Object.entries(envelope.data).forEach(([key, incoming]) => {
    const value = mode === 'replace' ? incoming : mergeValue(key, readKey(key), incoming);

    if (writeKey(key, value)) {
      restoredKeys.push(key);
    } else {
      failedKeys.push(key);
      errors.push(`Could not write "${key}" — storage may be full or unavailable.`);
    }
  });

  return { ok: failedKeys.length === 0, restoredKeys, failedKeys, errors };
};

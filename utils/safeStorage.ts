/**
 * A defensive wrapper around `window.localStorage`.
 *
 * Reading storage directly has three failure modes that all currently take the
 * whole app down, because most reads happen during render:
 *
 *  1. A corrupt value makes `JSON.parse` throw a `SyntaxError`.
 *  2. Touching `window.localStorage` itself throws a `SecurityError` when the
 *     browser blocks storage (Safari with "Block All Cookies", some embedded
 *     and third-party-iframe contexts).
 *  3. `setItem` throws `QuotaExceededError` once the origin is full — the
 *     streak calendar and study-time tracker grow one entry per day forever.
 *
 * Everything here degrades instead of throwing: reads fall back to a caller
 * supplied default, writes report failure by return value, and if storage is
 * unavailable altogether we keep an in-memory map so the session still works.
 */

/** Probes storage once. A failure here means we run entirely from memory. */
const detectStorage = (): Storage | null => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    // Availability is not enough — Safari's "Block All Cookies" allows the
    // property access but throws on write, so probe with a real round trip.
    const probeKey = '__skillverse_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return window.localStorage;
  } catch (err) {
    console.warn('LocalStorage is unavailable; falling back to in-memory storage for this session.', err);
    return null;
  }
};

const backing = detectStorage();

/** Session-only fallback used when the browser denies persistent storage. */
const memoryStore = new Map<string, string>();

export const isPersistent = backing !== null;

const getRaw = (key: string): string | null => {
  if (!backing) return memoryStore.get(key) ?? null;
  try {
    return backing.getItem(key);
  } catch (err) {
    console.warn(`Could not read "${key}" from storage:`, err);
    return memoryStore.get(key) ?? null;
  }
};

const setRaw = (key: string, value: string): boolean => {
  if (!backing) {
    memoryStore.set(key, value);
    return false;
  }
  try {
    backing.setItem(key, value);
    return true;
  } catch (err) {
    // Quota exceeded, or storage revoked mid-session. Keep the value in memory
    // so the current screen stays consistent, but tell the caller it is not
    // durable rather than throwing into a React render.
    console.error(`Could not write "${key}" to storage:`, err);
    memoryStore.set(key, value);
    return false;
  }
};

export const safeStorage = {
  isPersistent,

  /**
   * Parses a JSON value, returning `fallback` for anything missing, corrupt or
   * failing `validate`. A key that cannot be parsed is dropped so the user
   * recovers on the next load instead of being stuck permanently.
   */
  readJSON: <T>(key: string, fallback: T, validate?: (value: unknown) => boolean): T => {
    const raw = getRaw(key);
    if (raw === null) return fallback;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn(`Discarding corrupt storage entry "${key}":`, err);
      safeStorage.remove(key);
      return fallback;
    }

    // `JSON.parse` returns `any`, so without a shape check a wrongly-shaped but
    // syntactically valid value flows straight into the caller and blows up
    // later on a `.find` / `.filter` that is much harder to trace.
    if (validate && !validate(parsed)) {
      console.warn(`Storage entry "${key}" has an unexpected shape; using the default instead.`);
      return fallback;
    }

    return parsed as T;
  },

  /** Serialises and stores a value. Returns false if it was not persisted. */
  writeJSON: (key: string, value: unknown): boolean => {
    let serialized: string;
    try {
      serialized = JSON.stringify(value);
    } catch (err) {
      console.error(`Could not serialise the value for "${key}":`, err);
      return false;
    }
    return setRaw(key, serialized);
  },

  getString: (key: string): string | null => getRaw(key),

  setString: (key: string, value: string): boolean => setRaw(key, value),

  remove: (key: string): void => {
    memoryStore.delete(key);
    if (!backing) return;
    try {
      backing.removeItem(key);
    } catch (err) {
      console.warn(`Could not remove "${key}" from storage:`, err);
    }
  },

  clear: (): void => {
    memoryStore.clear();
    if (!backing) return;
    try {
      backing.clear();
    } catch (err) {
      console.warn('Could not clear storage:', err);
    }
  },
};

// --- Shape guards -----------------------------------------------------------
// Small, shared predicates so each call site does not re-invent them.

export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

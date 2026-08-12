/**
 * Course bookmarks ("Save for later").
 *
 * Bookmarks are a purely client-side preference, so they live in LocalStorage
 * next to the rest of the per-user progress (`skillverse_progress`,
 * `skillverse_career`, `skillverse_lesson_notes`, ...) rather than in Firestore.
 * That keeps the toggle instant and keeps it working offline for the PWA.
 *
 * Two different screens render bookmark state at the same time (the course grid
 * and the Saved page), so this module doubles as a tiny pub/sub: every mutation
 * notifies subscribers, and we also listen to the native `storage` event so a
 * second tab stays in sync.
 */

const BOOKMARKS_KEY = 'skillverse_bookmarks';
const BOOKMARKS_EVENT = 'skillverse:bookmarks-changed';

/** Reads the raw array, tolerating a missing, corrupt or wrongly-shaped value. */
const read = (): string[] => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      // Someone (or an older build) stored something that is not a list —
      // treat it as empty rather than handing a bad shape to the callers.
      return [];
    }

    // Keep only non-empty strings and drop duplicates.
    return Array.from(
      new Set(parsed.filter((id): id is string => typeof id === 'string' && id.length > 0))
    );
  } catch (err) {
    console.warn('Could not read course bookmarks, starting from an empty list:', err);
    return [];
  }
};

/** Persists the array and notifies every listener in this tab. */
const write = (ids: string[]): string[] => {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
  } catch (err) {
    // Private mode / quota. The in-memory result is still returned so the
    // current screen stays responsive; it simply will not survive a reload.
    console.warn('Could not persist course bookmarks:', err);
  }

  window.dispatchEvent(new CustomEvent(BOOKMARKS_EVENT, { detail: ids }));
  return ids;
};

export const courseBookmarks = {
  /** Every bookmarked course id, most recently saved first. */
  getAll: (): string[] => read(),

  /** How many courses are currently saved. */
  count: (): number => read().length,

  isBookmarked: (courseId: string): boolean => read().includes(courseId),

  add: (courseId: string): string[] => {
    const current = read();
    if (current.includes(courseId)) return current;
    return write([courseId, ...current]);
  },

  remove: (courseId: string): string[] => {
    const current = read();
    if (!current.includes(courseId)) return current;
    return write(current.filter(id => id !== courseId));
  },

  /** Adds the course if it is not saved yet, removes it otherwise. */
  toggle: (courseId: string): string[] => {
    const current = read();
    return current.includes(courseId)
      ? write(current.filter(id => id !== courseId))
      : write([courseId, ...current]);
  },

  clear: (): string[] => write([]),

  /**
   * Subscribes to bookmark changes made anywhere in the app, including from
   * another tab. Returns the unsubscribe function so it can be returned
   * directly from a `useEffect`.
   */
  subscribe: (listener: (ids: string[]) => void): (() => void) => {
    const handleLocal = () => listener(read());

    const handleCrossTab = (event: StorageEvent) => {
      // `key` is null when another tab calls localStorage.clear(), which wipes
      // the bookmarks too — so that case has to refresh as well.
      if (
        event.storageArea === localStorage &&
        (event.key === BOOKMARKS_KEY || event.key === null)
      ) {
        listener(read());
      }
    };

    window.addEventListener(BOOKMARKS_EVENT, handleLocal);
    window.addEventListener('storage', handleCrossTab);

    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, handleLocal);
      window.removeEventListener('storage', handleCrossTab);
    };
  },
};

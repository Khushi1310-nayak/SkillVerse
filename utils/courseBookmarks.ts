import { safeStorage, isArray } from './safeStorage';

const BOOKMARKS_KEY = 'skillverse_bookmarks';
const BOOKMARKS_CHANGED_EVENT = 'skillverse:bookmarks-changed';

const isStringArray = (value: unknown): value is string[] =>
    isArray(value) && value.every(v => typeof v === 'string');

const readBookmarks = (): string[] =>
    safeStorage.readJSON<string[]>(BOOKMARKS_KEY, [], isStringArray);

const writeBookmarks = (ids: string[]): string[] => {
    safeStorage.writeJSON(BOOKMARKS_KEY, ids);
    window.dispatchEvent(new CustomEvent(BOOKMARKS_CHANGED_EVENT, { detail: ids }));
    return ids;
};

export const courseBookmarks = {
    getBookmarks: (): string[] => readBookmarks(),

    isBookmarked: (courseId: string): boolean => readBookmarks().includes(courseId),

    toggleBookmark: (courseId: string): string[] => {
        const current = readBookmarks();
        const next = current.includes(courseId)
            ? current.filter(id => id !== courseId)
            : [...current, courseId];
        return writeBookmarks(next);
    },

    clearBookmarks: (): void => {
        writeBookmarks([]);
    },

    /**
     * Notifies the callback whenever bookmarks change — either from this tab
     * (via the custom event dispatched on write) or another tab (via the
     * native `storage` event, which only fires in *other* tabs, never the one
     * that made the write). Returns an unsubscribe function.
     */
    subscribe: (callback: (ids: string[]) => void): (() => void) => {
        const handleCustomEvent = (e: Event) => {
            callback((e as CustomEvent<string[]>).detail ?? readBookmarks());
        };
        const handleStorageEvent = (e: StorageEvent) => {
            if (e.key === BOOKMARKS_KEY) callback(readBookmarks());
        };

        window.addEventListener(BOOKMARKS_CHANGED_EVENT, handleCustomEvent);
        window.addEventListener('storage', handleStorageEvent);

        return () => {
            window.removeEventListener(BOOKMARKS_CHANGED_EVENT, handleCustomEvent);
            window.removeEventListener('storage', handleStorageEvent);
        };
    },
};
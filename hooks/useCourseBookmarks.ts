import { useCallback, useEffect, useState } from 'react';
import { courseBookmarks } from '../utils/courseBookmarks';

/**
 * Keeps a component in sync with the saved-course list.
 *
 * Both the course grid and the Saved page render bookmark state, and toggling
 * from one has to be reflected in the other (and in a second tab), so the hook
 * subscribes to `courseBookmarks` rather than reading LocalStorage on render.
 */
export const useCourseBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>(() => courseBookmarks.getAll());

  useEffect(() => {
    // Re-read once on mount in case storage changed between the lazy initial
    // state and the effect firing, then stay subscribed.
    setBookmarks(courseBookmarks.getAll());
    return courseBookmarks.subscribe(setBookmarks);
  }, []);

  const toggleBookmark = useCallback((courseId: string) => {
    setBookmarks(courseBookmarks.toggle(courseId));
  }, []);

  const isBookmarked = useCallback(
    (courseId: string) => bookmarks.includes(courseId),
    [bookmarks]
  );

  const clearBookmarks = useCallback(() => {
    setBookmarks(courseBookmarks.clear());
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark, clearBookmarks };
};

import { useEffect, useState } from 'react';
import { courseBookmarks } from '../utils/courseBookmarks';

export const useBookmarks = (): string[] => {
    const [bookmarks, setBookmarks] = useState<string[]>(() => courseBookmarks.getBookmarks());

    useEffect(() => {
        return courseBookmarks.subscribe(setBookmarks);
    }, []);

    return bookmarks;
};
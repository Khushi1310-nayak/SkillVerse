import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Bookmark, BookOpen, Trash2, CheckCircle } from 'lucide-react';
import { COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { useCourseBookmarks } from '../hooks/useCourseBookmarks';
import { Course } from '../types';
import { CourseCard, CourseCardSkeleton } from './CourseCard';

/**
 * The "Saved Courses" page — everything the learner bookmarked from the course
 * grid, in the order they saved it.
 */
export const SavedCourses: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const { bookmarks, isBookmarked, toggleBookmark, clearBookmarks } = useCourseBookmarks();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await firestoreService.getCourses();
        setCourses(data && data.length > 0 ? data : COURSES);
      } catch (error) {
        console.error('Error fetching courses from Firestore:', error);
        setCourses(COURSES);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, []);

  const progress = storageService.getAllProgress();

  const savedCourses = useMemo(() => {
    // Preserve the order the user saved them in, and quietly skip ids whose
    // course no longer exists (deleted from the catalogue by an admin).
    return bookmarks
      .map(id => courses.find(course => course.id === id))
      .filter((course): course is Course => Boolean(course));
  }, [bookmarks, courses]);

  const completedCount = savedCourses.filter(
    course => progress.find(p => p.courseId === course.id)?.passed
  ).length;

  const handleClearAll = () => {
    clearBookmarks();
    setConfirmingClear(false);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-textMain mb-2 flex items-center gap-3">
            <Bookmark className="text-primaryLight" /> {t('savedCourses.title')}
          </h1>
          <p className="text-textMuted">{t('savedCourses.subtitle')}</p>
        </div>

        {savedCourses.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmingClear(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 text-textMuted hover:text-red-500 hover:border-red-500/50 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Trash2 size={16} /> {t('savedCourses.clearAll')}
          </button>
        )}
      </div>

      {/* Summary strip */}
      {!isLoading && savedCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primaryLight">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-textMain">{savedCourses.length}</div>
              <div className="text-sm text-textMuted">{t('savedCourses.stats.saved')}</div>
            </div>
          </div>

          <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-textMain">{completedCount}</div>
              <div className="text-sm text-textMuted">{t('savedCourses.stats.completed')}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading && bookmarks.length > 0 ? (
          Array.from({ length: Math.min(bookmarks.length, 6) }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))
        ) : savedCourses.length > 0 ? (
          savedCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isPassed={progress.find(p => p.courseId === course.id)?.passed}
              isBookmarked={isBookmarked(course.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl py-16 px-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primaryLight mx-auto mb-6">
                <Bookmark size={28} />
              </div>
              <h2 className="text-xl font-bold text-textMain mb-2">{t('savedCourses.empty.title')}</h2>
              <p className="text-textMuted max-w-md mx-auto mb-8">{t('savedCourses.empty.body')}</p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 bg-gradient-main text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <BookOpen size={18} /> {t('savedCourses.empty.cta')}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Clear-all confirmation */}
      {confirmingClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmingClear(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-bookmarks-title"
            className="relative bg-background border border-black/20 dark:border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 id="clear-bookmarks-title" className="text-xl font-bold text-textMain text-center mb-2">
              {t('savedCourses.confirm.title')}
            </h3>
            <p className="text-textMuted text-center mb-6">{t('savedCourses.confirm.body')}</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setConfirmingClear(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-black/20 dark:border-white/10 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

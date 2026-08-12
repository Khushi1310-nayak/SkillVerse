import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Star, Bookmark } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  isPassed?: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (courseId: string) => void;
}

/** Placeholder tile shown while the course list is still being fetched. */
export const CourseCardSkeleton: React.FC = () => (
  <div className="bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-2xl p-6 animate-pulse flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 w-20 rounded-full bg-white/10" />
      <div className="h-5 w-5 rounded-full bg-white/10" />
    </div>

    <div className="h-6 w-3/4 rounded bg-white/10 mb-3" />
    <div className="h-4 w-full rounded bg-white/10 mb-2" />
    <div className="h-4 w-5/6 rounded bg-white/10 mb-6 flex-1" />

    <div className="pt-4 border-t border-black/20 dark:border-white/5 flex items-center justify-between">
      <div className="h-4 w-16 rounded bg-white/10" />
      <div className="h-4 w-24 rounded bg-white/10" />
    </div>
  </div>
);

const LEVEL_BADGE_CLASSES: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-500',
  Intermediate: 'bg-blue-500/10 text-blue-500',
  Advanced: 'bg-purple-500/10 text-purple-500',
};

/**
 * A single course tile. Shared by the course grid and the Saved page so the
 * two stay visually identical and the bookmark behaviour only exists once.
 */
export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isPassed = false,
  isBookmarked,
  onToggleBookmark,
}) => {
  const { t } = useTranslation();

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'Beginner':
        return t('common.difficulty.beginner');
      case 'Intermediate':
        return t('common.difficulty.intermediate');
      case 'Advanced':
        return t('common.difficulty.advanced');
      default:
        return level;
    }
  };

  const handleBookmarkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The button overlays the card, so keep the click from bubbling out to any
    // handler on the wrapper.
    event.stopPropagation();
    onToggleBookmark(course.id);
  };

  const bookmarkLabel = isBookmarked
    ? t('courses.bookmarks.remove', { title: course.title })
    : t('courses.bookmarks.add', { title: course.title });

  return (
    // The bookmark button is a sibling of the link rather than a child: a
    // <button> nested inside an <a> is invalid interactive-content nesting.
    // The wrapper carries the card styling so the layout is unchanged.
    <div className="group relative bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 hover:border-black/20 dark:border-white/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col">
      <button
        type="button"
        onClick={handleBookmarkClick}
        aria-pressed={isBookmarked}
        aria-label={bookmarkLabel}
        title={bookmarkLabel}
        className={`absolute top-6 right-6 z-10 p-1.5 rounded-lg transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isBookmarked
            ? 'text-primaryLight bg-primary/10'
            : 'text-textMuted hover:text-primaryLight hover:bg-primary/10'
        }`}
      >
        <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
      </button>

      <Link
        to={`/course/${course.id}`}
        className="flex flex-col flex-1 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* pr-9 keeps this row clear of the absolutely positioned bookmark. */}
        <div className="flex justify-between items-start mb-4 pr-9">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              LEVEL_BADGE_CLASSES[course.level] || 'bg-primary/10 text-primaryLight'
            }`}
          >
            {getDifficultyLabel(course.level)}
          </span>

          {isPassed && <CheckCircle className="text-success" size={20} />}
        </div>

        <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-textMuted mb-6 flex-1 line-clamp-3">{course.description}</p>

        <div className="pt-4 border-t border-black/20 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-textMuted font-mono">{course.duration}</span>
            {course.reviewCount ? (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star size={12} className="fill-amber-500" />
                {course.rating?.toFixed(1)}
                <span className="text-textMuted font-normal">({course.reviewCount})</span>
              </span>
            ) : (
              <span className="text-xs text-textMuted italic">{t('courses.noReviews')}</span>
            )}
          </div>

          <span className="flex items-center text-sm font-bold text-textMain group-hover:translate-x-1 transition-transform">
            {isPassed ? t('courses.review') : t('courses.startLearning')}
            <PlayCircle size={16} className="ml-2" />
          </span>
        </div>
      </Link>
    </div>
  );
};

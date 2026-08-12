import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, Bookmark, X } from 'lucide-react';
import { CATEGORIES, COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { useCourseBookmarks } from '../hooks/useCourseBookmarks';
import { Course } from '../types';
import { CourseCard, CourseCardSkeleton } from './CourseCard';

type SortOption = 'default' | 'rating' | 'reviews' | 'title';
type LevelFilter = 'all' | Course['level'];

const LEVEL_OPTIONS: LevelFilter[] = ['all', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS: SortOption[] = ['default', 'rating', 'reviews', 'title'];

export const CoursesList: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterLevel, setFilterLevel] = useState<LevelFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [savedOnly, setSavedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { bookmarks, isBookmarked, toggleBookmark } = useCourseBookmarks();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await firestoreService.getCourses();
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(COURSES);
        }
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

  const getCategoryLabel = (categoryId: string) => {
    switch (categoryId) {
      case 'programming':
        return t('courses.categories.programming');
      case 'dsa':
        return t('courses.categories.dsa');
      case 'design':
        return t('courses.categories.design');
      default:
        return t('courses.categories.default');
    }
  };

  const getLevelLabel = (level: LevelFilter) => {
    switch (level) {
      case 'Beginner':
        return t('common.difficulty.beginner');
      case 'Intermediate':
        return t('common.difficulty.intermediate');
      case 'Advanced':
        return t('common.difficulty.advanced');
      default:
        return t('courses.allLevels');
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'rating':
        return t('courses.sort.rating');
      case 'reviews':
        return t('courses.sort.reviews');
      case 'title':
        return t('courses.sort.title');
      default:
        return t('courses.sort.default');
    }
  };

  const hasActiveFilters =
    search.trim() !== '' || filterCat !== 'all' || filterLevel !== 'all' || sortBy !== 'default' || savedOnly;

  const clearFilters = () => {
    setSearch('');
    setFilterCat('all');
    setFilterLevel('all');
    setSortBy('default');
    setSavedOnly(false);
  };

  const visibleCourses = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = courses.filter(course => {
      // Search now covers the description too — previously a word that only
      // appeared in the summary returned no results at all.
      const matchesSearch =
        term === '' ||
        course.title.toLowerCase().includes(term) ||
        (course.description || '').toLowerCase().includes(term);

      const matchesCat = filterCat === 'all' || course.categoryId === filterCat;
      const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
      const matchesSaved = !savedOnly || bookmarks.includes(course.id);

      return matchesSearch && matchesCat && matchesLevel && matchesSaved;
    });

    // `sort` mutates in place, so sort the copy produced by `filter`.
    switch (sortBy) {
      case 'rating':
        return filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'reviews':
        return filtered.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [courses, search, filterCat, filterLevel, sortBy, savedOnly, bookmarks]);

  const selectClass =
    'w-full bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-4 pr-10 text-textMain focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight appearance-none cursor-pointer transition-all';
  const optionClass = 'bg-white dark:bg-[#0B1220] text-textMain';

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-textMain mb-2">{t('courses.title')}</h1>
          <p className="text-textMuted">{t('courses.subtitle')}</p>
        </div>

        <div className="relative w-full md:w-64 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primaryLight transition-colors"
            size={18}
          />
          <input
            type="text"
            aria-label={t('courses.searchPlaceholder')}
            placeholder={t('courses.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gradient-input border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-11 pr-4 text-black placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          <div className="relative group">
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              title={t('courses.filterTitle')}
              aria-label={t('courses.filterTitle')}
              className={selectClass}
            >
              <option value="all" className={optionClass}>
                {t('courses.allCategories')}
              </option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id} className={optionClass}>
                  {getCategoryLabel(c.id)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none group-hover:text-primaryLight transition-colors"
              size={16}
            />
          </div>

          <div className="relative group">
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value as LevelFilter)}
              title={t('courses.levelFilterTitle')}
              aria-label={t('courses.levelFilterTitle')}
              className={selectClass}
            >
              {LEVEL_OPTIONS.map(level => (
                <option key={level} value={level} className={optionClass}>
                  {getLevelLabel(level)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none group-hover:text-primaryLight transition-colors"
              size={16}
            />
          </div>

          <div className="relative group">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              title={t('courses.sortTitle')}
              aria-label={t('courses.sortTitle')}
              className={selectClass}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option} value={option} className={optionClass}>
                  {getSortLabel(option)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none group-hover:text-primaryLight transition-colors"
              size={16}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSavedOnly(prev => !prev)}
          aria-pressed={savedOnly}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            savedOnly
              ? 'bg-primary/15 border-primaryLight text-primaryLight'
              : 'bg-primary/5 dark:bg-primary/10 border-primary/20 text-textMuted hover:text-textMain'
          }`}
        >
          <Bookmark size={16} className={savedOnly ? 'fill-current' : ''} />
          {t('courses.bookmarks.savedOnly')}
          <span className="text-xs font-mono opacity-70">({bookmarks.length})</span>
        </button>
      </div>

      {/* Result summary */}
      {!isLoading && (
        <div className="flex items-center justify-between gap-4 -mt-2">
          <p className="text-sm text-textMuted">
            {t('courses.resultCount', { count: visibleCourses.length })}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-textMuted hover:text-primaryLight transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <X size={14} /> {t('courses.clearFilters')}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <CourseCardSkeleton key={index} />)
        ) : (
          <>
            {visibleCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isPassed={progress.find(p => p.courseId === course.id)?.passed}
                isBookmarked={isBookmarked(course.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}

            {visibleCourses.length === 0 && (
              <div className="col-span-full text-center py-20 text-textMuted">
                {savedOnly && bookmarks.length === 0
                  ? t('courses.bookmarks.emptyHint')
                  : t('courses.empty')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

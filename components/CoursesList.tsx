import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, PlayCircle, CheckCircle, ChevronDown, Star, Bookmark, ArrowUpDown, X, Lock, Link2, Check } from 'lucide-react';
import { isCourseUnlocked, getIncompletePrerequisites } from '../utils/prerequisites';
import { CATEGORIES, COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { courseBookmarks } from '../utils/courseBookmarks';
import { useBookmarks } from '../hooks/useBookmarks';
import {
  useCatalogFilters,
  LevelFilter,
  SortOption,
  TimeFilter,
} from '../hooks/useCatalogFilters';
import { Course } from '../types';

export const CoursesList: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [isLoading, setIsLoading] = useState(true);
  const bookmarkedIds = useBookmarks();

  // Filter state lives in the query string, so a filtered catalog survives
  // Back-navigation and a refresh, and can be shared as a link.
  const categoryIds = useMemo(() => CATEGORIES.map(c => c.id), []);
  const {
    filters,
    searchDraft,
    setSearchDraft,
    setFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useCatalogFilters(categoryIds);
  const { category: filterCat, level: filterLevel, time: filterTime, sort: sortBy, savedOnly } = filters;
  const search = filters.search;

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

  /**
   * Parse a human-readable duration string such as "8 Hours", "45 Minutes",
   * or "1.5 Hours" into a total number of minutes for bucketing purposes.
   * Falls back to 0 if the string cannot be parsed.
   */
  const parseDurationMinutes = (duration: string): number => {
    const lower = duration.toLowerCase().trim();
    const numMatch = lower.match(/([\d.]+)/);
    if (!numMatch) return 0;
    const value = parseFloat(numMatch[1]);
    if (lower.includes('hour')) return Math.round(value * 60);
    if (lower.includes('min')) return Math.round(value);
    // Fallback: treat bare numbers as hours (matches existing "8 Hours" format)
    return Math.round(value * 60);
  };

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

  const [linkCopied, setLinkCopied] = useState(false);

  /**
   * The filter set is fully described by the current URL, so sharing a
   * filtered catalog is just copying the address bar.
   */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Could not copy the catalog link:', err);
    }
  };

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

  const filtered = useMemo(() => courses
    .filter(course => {
      const q = search.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q);
      const matchesCat = filterCat === 'all' || course.categoryId === filterCat;
      const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
      const matchesSaved = !savedOnly || bookmarkedIds.includes(course.id);

      let matchesTime = true;
      if (filterTime !== 'all') {
        const mins = parseDurationMinutes(course.duration);
        if (filterTime === 'under30') matchesTime = mins < 30;
        else if (filterTime === '30to60') matchesTime = mins >= 30 && mins <= 60;
        else if (filterTime === '1to2h') matchesTime = mins > 60 && mins <= 120;
        else if (filterTime === '2hplus') matchesTime = mins > 120;
      }

      return matchesSearch && matchesCat && matchesLevel && matchesSaved && matchesTime;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'reviews':
          return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
        case 'az':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    }),
    [courses, search, filterCat, filterLevel, filterTime, sortBy, savedOnly, bookmarkedIds]
  );

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-textMain mb-2">{t('courses.title')}</h1>
          <p className="text-textMuted">{t('courses.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primaryLight transition-colors" size={18} />
          <input
            type="text"
            placeholder={t('courses.searchPlaceholder')}
            value={searchDraft}
            onChange={e => setSearchDraft(e.target.value)}
            className="w-full bg-gradient-input border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-11 pr-4 text-black placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative group min-w-[160px]">
            <select
              value={filterCat}
              onChange={e => setFilter('category', e.target.value)}
              title={t('courses.filterTitle')}
              aria-label={t('courses.filterTitle')}
              className="w-full bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-4 pr-10 text-textMain focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight appearance-none cursor-pointer transition-all"
            >
              <option value="all" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.allCategories')}</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-[#0B1220] text-textMain">{getCategoryLabel(c.id)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none group-hover:text-primaryLight transition-colors" size={16} />
          </div>

          <div className="relative group min-w-[160px]">
            <select
              value={filterLevel}
              onChange={e => setFilter('level', e.target.value as LevelFilter)}
              title={t('courses.difficultyFilterTitle')}
              aria-label={t('courses.difficultyFilterTitle')}
              className="w-full bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-4 pr-10 text-textMain focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight appearance-none cursor-pointer transition-all"
            >
              <option value="all" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.allLevels')}</option>
              <option value="Beginner" className="bg-white dark:bg-[#0B1220] text-textMain">{t('common.difficulty.beginner')}</option>
              <option value="Intermediate" className="bg-white dark:bg-[#0B1220] text-textMain">{t('common.difficulty.intermediate')}</option>
              <option value="Advanced" className="bg-white dark:bg-[#0B1220] text-textMain">{t('common.difficulty.advanced')}</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none group-hover:text-primaryLight transition-colors" size={16} />
          </div>

          <div className="relative group min-w-[160px]">
            <select
              value={filterTime}
              onChange={e => setFilter('time', e.target.value as TimeFilter)}
              title={t('courses.timeFilterTitle')}
              aria-label={t('courses.timeFilterTitle')}
              className="w-full bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-4 pr-10 text-textMain focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight appearance-none cursor-pointer transition-all"
            >
              <option value="all" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.allDurations')}</option>
              <option value="under30" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.timeUnder30')}</option>
              <option value="30to60" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.time30to60')}</option>
              <option value="1to2h" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.time1to2h')}</option>
              <option value="2hplus" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.time2hPlus')}</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none group-hover:text-primaryLight transition-colors" size={16} />
          </div>

          <div className="relative group min-w-[180px]">
            <select
              value={sortBy}
              onChange={e => setFilter('sort', e.target.value as SortOption)}
              title={t('courses.sortTitle')}
              aria-label={t('courses.sortTitle')}
              className="w-full bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-4 pr-10 text-textMain focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight appearance-none cursor-pointer transition-all"
            >
              <option value="default" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.sortDefault')}</option>
              <option value="rating" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.sortRating')}</option>
              <option value="reviews" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.sortReviews')}</option>
              <option value="az" className="bg-white dark:bg-[#0B1220] text-textMain">{t('courses.sortAZ')}</option>
            </select>
            <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none group-hover:text-primaryLight transition-colors" size={14} />
          </div>

          <button
            onClick={() => setFilter('savedOnly', !savedOnly)}
            aria-pressed={savedOnly}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${savedOnly
                ? 'bg-primary/20 border-primary/40 text-primaryLight'
                : 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/20 text-textMuted hover:text-textMain'
              }`}
          >
            <Bookmark size={16} className={savedOnly ? 'fill-primaryLight' : ''} />
            {t('courses.savedOnly')}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-textMuted">
        <span aria-live="polite">
          {t('courses.resultsCount', { count: filtered.length })}
          {activeFilterCount > 0 && (
            <span className="ml-2 text-xs font-semibold text-primaryLight">
              {t('courses.activeFilters', { count: activeFilterCount })}
            </span>
          )}
        </span>

        {hasActiveFilters && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-primaryLight hover:underline font-semibold"
            >
              {linkCopied ? <Check size={14} /> : <Link2 size={14} />}
              {linkCopied ? t('courses.linkCopied') : t('courses.copyLink')}
            </button>

            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-primaryLight hover:underline font-semibold"
            >
              <X size={14} />
              {t('courses.clearFilters')}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-2xl p-6 animate-pulse flex flex-col"
            >
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
          ))
        ) : (
          <>
            {filtered.map(course => {
              const isPassed = progress.find(p => p.courseId === course.id)?.passed;
              const isBookmarked = bookmarkedIds.includes(course.id);
              const isLocked = !isCourseUnlocked(course, progress);
              const incompletePrereqs = isLocked
                ? getIncompletePrerequisites(course, courses, progress)
                : [];

              return (
                <div
                  key={course.id}
                  className={`group relative bg-glass border rounded-2xl p-6 transition-all duration-300 flex flex-col ${
                    isLocked
                      ? 'border-black/10 dark:border-white/10 opacity-80'
                      : 'border-black/20 dark:border-white/20 dark:border-white/10 hover:border-black/20 dark:border-white/40 hover:shadow-xl hover:shadow-primary/5'
                  }`}
                >
                  {/* Bookmark — always accessible regardless of locked state */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      courseBookmarks.toggleBookmark(course.id);
                    }}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-textMuted hover:text-primaryLight hover:bg-primary/10 transition-colors"
                    aria-label={isBookmarked ? t('courses.bookmarkRemove') : t('courses.bookmarkAdd')}
                    title={isBookmarked ? t('courses.bookmarkRemove') : t('courses.bookmarkAdd')}
                  >
                    <Bookmark size={18} className={isBookmarked ? 'fill-primaryLight text-primaryLight' : ''} />
                  </button>

                  {isLocked ? (
                    /* ── LOCKED CARD ─────────────────────────────────────────── */
                    <div
                      className="flex flex-col flex-1"
                      role="region"
                      aria-label={`${course.title} — locked. Complete prerequisites first.`}
                    >
                      <div className="flex justify-between items-start mb-4 pr-8">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            course.level === 'Beginner'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : course.level === 'Intermediate'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-purple-500/10 text-purple-500'
                          }`}
                        >
                          {getDifficultyLabel(course.level)}
                        </span>
                        <Lock size={20} className="text-amber-500" aria-hidden="true" />
                      </div>

                      <h3 className="text-xl font-bold text-textMain mb-2">
                        {course.title}
                      </h3>

                      <p className="text-sm text-textMuted mb-4 flex-1 line-clamp-3">
                        {course.description}
                      </p>

                      {/* Prerequisite chips */}
                      <div className="mb-4">
                        <p className="text-xs text-amber-500 font-semibold mb-2 flex items-center gap-1">
                          <Lock size={12} aria-hidden="true" />
                          Complete first:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {incompletePrereqs.map(prereq => (
                            <Link
                              key={prereq.id}
                              to={`/course/${prereq.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primaryLight text-xs font-semibold hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              aria-label={`Go to prerequisite course: ${prereq.title}`}
                            >
                              {prereq.title}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-black/20 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-textMuted font-mono">
                            {course.duration}
                          </span>
                          {course.reviewCount ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                              <Star size={12} className="fill-amber-500" />
                              {course.rating?.toFixed(1)}
                              <span className="text-textMuted font-normal">({course.reviewCount})</span>
                            </span>
                          ) : (
                            <span className="text-xs text-textMuted italic">No reviews yet</span>
                          )}
                        </div>
                        <span className="flex items-center text-sm font-semibold text-textMuted" aria-hidden="true">
                          Locked
                          <Lock size={16} className="ml-2 text-amber-500" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* ── UNLOCKED CARD — identical to existing behaviour ─────── */
                    <Link to={`/course/${course.id}`} className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4 pr-8">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${course.level === "Beginner"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : course.level === "Intermediate"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-purple-500/10 text-purple-500"
                            }`}
                        >
                          {getDifficultyLabel(course.level)}
                        </span>

                        {isPassed && <CheckCircle className="text-success" size={20} />}
                      </div>

                      <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-sm text-textMuted mb-6 flex-1 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="pt-4 border-t border-black/20 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-textMuted font-mono">
                            {course.duration}
                          </span>
                          {course.reviewCount ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                              <Star size={12} className="fill-amber-500" />
                              {course.rating?.toFixed(1)}
                              <span className="text-textMuted font-normal">({course.reviewCount})</span>
                            </span>
                          ) : (
                            <span className="text-xs text-textMuted italic">No reviews yet</span>
                          )}
                        </div>

                        <span className="flex items-center text-sm font-bold text-textMain group-hover:translate-x-1 transition-transform">
                          {isPassed ? t('courses.review') : t('courses.startLearning')}
                          <PlayCircle size={16} className="ml-2" />
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-textMuted">
                {/* A shared link can now land on a filtered-but-empty catalog,
                    where the bare "no courses" copy reads like the catalog is
                    broken. Name the cause and offer the way out. */}
                {hasActiveFilters ? (
                  <>
                    <p className="mb-4">{t('courses.emptyFiltered')}</p>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primaryLight font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <X size={16} />
                      {t('courses.clearFilters')}
                    </button>
                  </>
                ) : (
                  t('courses.empty')
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
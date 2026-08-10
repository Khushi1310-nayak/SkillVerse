import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, Filter, PlayCircle, CheckCircle, ChevronDown, Star } from 'lucide-react';
import { CATEGORIES, COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { Course } from '../types';

export const CoursesList: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

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

  const filtered = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'all' || course.categoryId === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-textMain mb-2">{t('courses.title')}</h1>
          <p className="text-textMuted">{t('courses.subtitle')}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primaryLight transition-colors" size={18} />
            <input
              type="text"
              placeholder={t('courses.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gradient-input border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-11 pr-4 text-black placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
            />
          </div>
          <div className="relative group min-w-[180px]">
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
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
        </div>
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

              return (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="group bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 hover:border-black/20 dark:border-white/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
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
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-textMuted">
                {t('courses.empty')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

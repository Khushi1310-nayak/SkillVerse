import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, PlayCircle, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { storageService } from '../services/storageService';
import NotFound from './NotFound';
import { firestoreService } from '../services/firestoreService';
import { Course } from '../types';

export const CategoryView: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const category = CATEGORIES.find(c => c.id === id);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryCourses = async () => {
      try {
        const all = await firestoreService.getCourses();
        const filtered = all.filter(c => c.categoryId === id);
        setCourses(filtered);
      } catch (error) {
        console.error('Error fetching courses for category:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryCourses();
  }, [id]);

  const progress = useMemo(() => storageService.getAllProgress(), []);

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

  const categoryTitle = category
    ? t(`categoryView.categories.${category.id}.title`, { defaultValue: category.title })
    : '';
  const categoryDescription = category
    ? t(`categoryView.categories.${category.id}.description`, { defaultValue: category.description })
    : '';

  if (!category) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primaryLight w-12 h-12" />
        <div className="mt-4 text-textMuted text-sm font-medium animate-pulse">{t('categoryView.loading')}</div>
      </div>
    );
  }


  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center text-textMuted hover:text-textMain mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> {t('categoryView.backToDashboard')}
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-textMain mb-4">{categoryTitle}</h1>
        <p className="text-xl text-textMuted max-w-2xl">{categoryDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const courseProgress = progress.find(p => p.courseId === course.id);
          const isPassed = courseProgress?.passed;

          return (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className={`relative bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-black/20 dark:border-white/40 hover:shadow-xl group overflow-hidden`}
            >
              {isPassed && (
                <div className="absolute top-4 right-4 text-success">
                  <CheckCircle size={24} />
                </div>
              )}

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${course.level === 'Beginner' ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-300' :
                    course.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-500 dark:text-blue-300' :
                      'bg-purple-500/20 text-purple-500 dark:text-purple-300'
                  }`}>
                  {getDifficultyLabel(course.level)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-textMuted mb-6 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between text-sm text-textMuted">
                <span>{course.duration}</span>
                <span className="flex items-center text-textMain font-medium group-hover:translate-x-1 transition-transform">
                  {isPassed ? t('categoryView.review') : t('categoryView.start')} <PlayCircle size={16} className="ml-2" />
                </span>
              </div>

              {/* Progress Bar at bottom */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-black/5 dark:bg-white/5">
                {isPassed && <div className="h-full bg-success w-full" />}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

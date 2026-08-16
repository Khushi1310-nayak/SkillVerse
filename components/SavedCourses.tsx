import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Bookmark, PlayCircle, CheckCircle, Star, BookOpen } from 'lucide-react';
import { COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { courseBookmarks } from '../utils/courseBookmarks';
import { useBookmarks } from '../hooks/useBookmarks';
import { Course } from '../types';

export const SavedCourses: React.FC = () => {
    const { t } = useTranslation();
    const [courses, setCourses] = useState<Course[]>(COURSES);
    const [isLoading, setIsLoading] = useState(true);
    const bookmarkedIds = useBookmarks();

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
    const bookmarkedCourses = courses.filter(course => bookmarkedIds.includes(course.id));

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

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-textMain mb-2">{t('savedCourses.title')}</h1>
                <p className="text-textMuted">{t('savedCourses.subtitle')}</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-2xl p-6 animate-pulse h-52" />
                    ))}
                </div>
            ) : bookmarkedCourses.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Bookmark className="text-primaryLight" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-textMain mb-2">{t('savedCourses.emptyTitle')}</h3>
                    <p className="text-textMuted mb-6 max-w-md mx-auto">{t('savedCourses.emptyBody')}</p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-main text-white font-bold shadow hover:scale-105 transition-all"
                    >
                        <BookOpen size={16} />
                        {t('savedCourses.emptyCta')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookmarkedCourses.map(course => {
                        const isPassed = progress.find(p => p.courseId === course.id)?.passed;

                        return (
                            <div
                                key={course.id}
                                className="group relative bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 hover:border-black/20 dark:border-white/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
                            >
                                <button
                                    onClick={() => courseBookmarks.toggleBookmark(course.id)}
                                    className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-primaryLight hover:bg-primary/10 transition-colors"
                                    aria-label={t('savedCourses.removeBookmark')}
                                    title={t('savedCourses.removeBookmark')}
                                >
                                    <Bookmark size={18} className="fill-primaryLight" />
                                </button>

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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
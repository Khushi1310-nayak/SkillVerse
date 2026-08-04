import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../services/storageService';
import { useAuth } from '../hooks/useAuth';
import { BadgeCard } from './ui/BadgeCard';
import { firestoreService } from '../services/firestoreService';
import { Course } from '../types';

export const CertificationsList: React.FC = () => {
  const { t } = useTranslation();
  const { appUser: user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await firestoreService.getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses for certifications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const progress = storageService.getAllProgress();
  const passedCourses = progress.filter(p => p.passed);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primaryLight w-12 h-12" />
        <div className="mt-4 text-textMuted text-sm font-medium animate-pulse">{t('certifications.loading')}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
       <div>
         <h1 className="text-3xl font-display font-bold text-textMain mb-2">{t('certifications.title')}</h1>
         <p className="text-textMuted">{t('certifications.subtitle')}</p>
       </div>

       {passedCourses.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {passedCourses.map(p => {
               const course = courses.find(c => c.id === p.courseId);
               if (!course) return null;
               
               return <BadgeCard key={p.courseId} course={course} progress={p} user={user} />;
            })}
         </div>
       ) : (
         <div className="flex flex-col items-center justify-center py-20 bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-3xl text-center">
            <div className="w-20 h-20 bg-white/50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
               <Award size={40} className="text-textMuted opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-textMain mb-2">{t('certifications.emptyTitle')}</h3>
            <p className="text-textMuted max-w-md mb-8">
               {t('certifications.emptyDescription')}
            </p>
            <Link to="/courses" className="px-8 py-3 bg-gradient-main text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
               {t('certifications.browseCourses')}
            </Link>
         </div>
       )}
    </div>
  );
};

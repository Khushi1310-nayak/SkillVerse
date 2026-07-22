import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { useAuth } from '../hooks/useAuth';
import { BadgeCard } from './ui/BadgeCard';

export const CertificationsList: React.FC = () => {
  const { appUser: user } = useAuth();
  const progress = storageService.getAllProgress();
  const passedCourses = progress.filter(p => p.passed);

  if (!user) return null;

  return (
    <div className="animate-fade-in space-y-8">
       <div>
         <h1 className="text-3xl font-display font-bold text-textMain mb-2">My Certifications</h1>
         <p className="text-textMuted">Official proof of your skills and achievements.</p>
       </div>

       {passedCourses.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {passedCourses.map(p => {
               const course = COURSES.find(c => c.id === p.courseId);
               if (!course) return null;
               
               return <BadgeCard key={p.courseId} course={course} progress={p} user={user} />;
            })}
         </div>
       ) : (
         <div className="flex flex-col items-center justify-center py-20 bg-glass border border-white/20 dark:border-white/10 rounded-3xl text-center">
            <div className="w-20 h-20 bg-white/50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
               <Award size={40} className="text-textMuted opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-textMain mb-2">No Certificates Yet</h3>
            <p className="text-textMuted max-w-md mb-8">
               Complete courses and pass the final quizzes to earn professional certifications.
            </p>
            <Link to="/courses" className="px-8 py-3 bg-gradient-main text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
               Browse Courses
            </Link>
         </div>
       )}
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, ExternalLink } from 'lucide-react';
import { COURSES } from '../constants';
import { storageService } from '../services/storageService';

export const CertificationsList: React.FC = () => {
  const progress = storageService.getAllProgress();
  const passedCourses = progress.filter(p => p.passed);
  const user = storageService.getUser();

  return (
    <div className="animate-fade-in space-y-8">
       <div>
         <h1 className="text-3xl font-display font-bold text-textMain mb-2">My Certifications</h1>
         <p className="text-textMuted">Official proof of your skills and achievements.</p>
       </div>

       {passedCourses.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {passedCourses.map(p => {
               const course = COURSES.find(c => c.id === p.courseId);
               if (!course) return null;
               
               return (
                 <div key={p.courseId} className="bg-glass border border-white/20 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/30 transition-all">
                    {/* Abstract bg pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                    
                    <div className="relative z-10">
                       <div className="w-16 h-16 rounded-full bg-gradient-main p-0.5 mb-6 shadow-lg shadow-primary/20">
                          <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                             <Award className="text-primaryLight" size={32} />
                          </div>
                       </div>
                       
                       <h3 className="text-2xl font-bold text-textMain mb-1">{course.title}</h3>
                       <p className="text-sm text-textMuted mb-6">Completed on {p.completedDate}</p>
                       
                       <div className="flex gap-4">
                          <Link 
                            to={`/certificate/${course.id}`}
                            className="flex-1 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 text-textMain py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                          >
                             <Download size={18} /> Download
                          </Link>
                       </div>
                    </div>
                 </div>
               );
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

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, PlayCircle, Lock, ArrowLeft } from 'lucide-react';
import { CATEGORIES, COURSES } from '../constants';
import { storageService } from '../services/storageService';

export const CategoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const category = CATEGORIES.find(c => c.id === id);
  const courses = COURSES.filter(c => c.categoryId === id);
  const progress = storageService.getAllProgress();

  if (!category) return <div>Category not found</div>;

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center text-textMuted hover:text-textMain mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-textMain mb-4">{category.title}</h1>
        <p className="text-xl text-textMuted max-w-2xl">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const courseProgress = progress.find(p => p.courseId === course.id);
          const isPassed = courseProgress?.passed;
          
          return (
            <Link 
              key={course.id} 
              to={`/course/${course.id}`}
              className={`relative bg-glass border border-white/20 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/40 hover:shadow-xl group overflow-hidden`}
            >
              {isPassed && (
                <div className="absolute top-4 right-4 text-success">
                  <CheckCircle size={24} />
                </div>
              )}
              
              <div className="mb-4">
                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    course.level === 'Beginner' ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-300' :
                    course.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-500 dark:text-blue-300' :
                    'bg-purple-500/20 text-purple-500 dark:text-purple-300'
                 }`}>
                   {course.level}
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
                  {isPassed ? 'Review' : 'Start'} <PlayCircle size={16} className="ml-2" />
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

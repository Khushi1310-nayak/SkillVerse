import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, PlayCircle, CheckCircle } from 'lucide-react';
import { COURSES, CATEGORIES } from '../constants';
import { storageService } from '../services/storageService';

export const CoursesList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const progress = storageService.getAllProgress();

  const filtered = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'all' || course.categoryId === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="animate-fade-in space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-textMain mb-2">Explore Courses</h1>
            <p className="text-textMuted">Expand your knowledge with our premium curriculum.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-glass border border-white/20 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-textMain focus:border-primaryLight focus:outline-none transition-colors"
                />
             </div>
             <select 
               value={filterCat}
               onChange={e => setFilterCat(e.target.value)}
               className="bg-glass border border-white/20 dark:border-white/10 rounded-xl px-4 py-2 text-textMain focus:border-primaryLight focus:outline-none appearance-none cursor-pointer"
             >
               <option value="all" className="bg-white dark:bg-[#0B1220]">All Categories</option>
               {CATEGORIES.map(c => (
                 <option key={c.id} value={c.id} className="bg-white dark:bg-[#0B1220]">{c.title}</option>
               ))}
             </select>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(course => {
             const isPassed = progress.find(p => p.courseId === course.id)?.passed;
             return (
               <Link 
                 key={course.id} 
                 to={`/course/${course.id}`}
                 className="group bg-glass border border-white/20 dark:border-white/10 hover:border-white/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
               >
                 <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        course.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500' :
                        course.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-purple-500/10 text-purple-500'
                    }`}>
                      {course.level}
                    </span>
                    {isPassed && <CheckCircle className="text-success" size={20} />}
                 </div>
                 
                 <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">{course.title}</h3>
                 <p className="text-sm text-textMuted mb-6 flex-1 line-clamp-3">{course.description}</p>
                 
                 <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs text-textMuted font-mono">{course.duration}</span>
                    <span className="flex items-center text-sm font-bold text-textMain group-hover:translate-x-1 transition-transform">
                       {isPassed ? 'Review' : 'Start Learning'} <PlayCircle size={16} className="ml-2" />
                    </span>
                 </div>
               </Link>
             )
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-textMuted">
               No courses found matching your criteria.
            </div>
          )}
       </div>
    </div>
  );
};

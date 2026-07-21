
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Network, Palette, CheckCircle, Clock, ChevronRight, Search, PlayCircle, Map } from 'lucide-react';
import { CATEGORIES, COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { User, Progress } from '../types';
import { TourOverlay } from './TourOverlay';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTour, setShowTour] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user.settings?.reminders) {
      const hasStudiedToday = sessionStorage.getItem('studied_today');
      if (!hasStudiedToday) {
        setToastMessage(`Reminder: Hit your daily goal of ${user.settings.dailyGoal} minutes to keep your streak!`);
        sessionStorage.setItem('studied_today', 'true');
        setTimeout(() => setToastMessage(null), 5000);
      }
    }
  }, [user.settings?.reminders, user.settings?.dailyGoal]);

  const allProgress = storageService.getAllProgress();
  const completedCount = allProgress.filter(p => p.passed).length;
  const totalCourses = COURSES.length;
  const completionPercentage = Math.round((completedCount / totalCourses) * 100);

  const getCategoryProgress = (catId: string) => {
    const catCourses = COURSES.filter(c => c.categoryId === catId);
    const catPassed = catCourses.filter(c => allProgress.find(p => p.courseId === c.id)?.passed).length;
    return { 
      total: catCourses.length, 
      passed: catPassed,
      percent: catCourses.length ? Math.round((catPassed / catCourses.length) * 100) : 0
    };
  };

  const chartData = useMemo(() => {
    return CATEGORIES.map(cat => ({
      label: cat.title,
      ...getCategoryProgress(cat.id)
    }));
  }, [allProgress]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return [];
    return COURSES.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchQuery]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Terminal': return <Terminal className="text-primaryLight" size={24} />;
      case 'Network': return <Network className="text-blue-400" size={24} />;
      case 'Palette': return <Palette className="text-pink-400" size={24} />;
      default: return <Terminal size={24} />;
    }
  };

  const handleTourComplete = async () => {
      setShowTour(false);
      // Persist that user has seen tour
      const updatedUser = { ...user, settings: { ...user.settings, hasSeenTour: true } };
      try {
        await storageService.updateUser(updatedUser);
      } catch (error) {
        console.error('Error persisting tour completion:', error);
      }
  };

  const getPercentClass = (p: number, type: 'h' | 'w') => {
    const rounded = Math.max(0, Math.min(100, Math.round(p / 5) * 5));
    const hMap: Record<number, string> = {
      0: 'h-0', 5: 'h-[5%]', 10: 'h-[10%]', 15: 'h-[15%]', 20: 'h-[20%]', 25: 'h-[25%]', 30: 'h-[30%]', 35: 'h-[35%]', 40: 'h-[40%]', 45: 'h-[45%]', 50: 'h-[50%]', 55: 'h-[55%]', 60: 'h-[60%]', 65: 'h-[65%]', 70: 'h-[70%]', 75: 'h-[75%]', 80: 'h-[80%]', 85: 'h-[85%]', 90: 'h-[90%]', 95: 'h-[95%]', 100: 'h-full'
    };
    const wMap: Record<number, string> = {
      0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]', 25: 'w-[25%]', 30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]', 50: 'w-[50%]', 55: 'w-[55%]', 60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]', 75: 'w-[75%]', 80: 'w-[80%]', 85: 'w-[85%]', 90: 'w-[90%]', 95: 'w-[95%]', 100: 'w-full'
    };
    return type === 'h' ? hMap[rounded] : wMap[rounded];
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 relative">
      {/* Tour Overlay */}
      {showTour && <TourOverlay onClose={handleTourComplete} />}

      {/* Reminder Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-primary/20 backdrop-blur-md border border-primary/50 text-white px-6 py-4 rounded-xl shadow-lg animate-fade-in flex items-center gap-3">
          <Clock className="text-primaryLight" />
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
           <div className="flex flex-wrap items-center gap-3 mb-1">
               <h2 className="text-3xl font-display font-bold text-textMain">Dashboard</h2>
               <button 
                 onClick={() => setShowTour(true)}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primaryLight text-xs font-bold uppercase tracking-wider hover:bg-primary/20 transition-colors border border-primary/20"
               >
                  <Map size={14} /> Take a Tour
               </button>
           </div>
           <p className="text-textMuted">Overview of your learning journey</p>
        </div>
        <div className="relative w-full md:w-80 group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primaryLight transition-colors" size={20} />
           <input 
             type="text" 
             placeholder="Search courses..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-gradient-input border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-12 pr-4 text-black placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
           />
           {searchQuery.trim() !== "" && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
    {filteredCourses.length > 0 ? (
      <>
        {filteredCourses.map(course => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
          >
            <span className="text-textMain text-sm font-medium">{course.title}</span>
            <ChevronRight size={16} className="text-textMuted" />
          </Link>
        ))}
        <Link
          to="/courses"
          className="block p-3 text-center text-xs font-bold text-primaryLight uppercase tracking-wider bg-white/5 hover:bg-white/10"
        >
          View All Results
        </Link>
      </>
    ) : (
      <div className="p-4 text-center text-textMuted">
        No courses found matching your criteria.
      </div>
    )}
  </div>
)}
        </div>
      </div>

      {/* Stats & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div id="dash-stats" className="lg:col-span-2 bg-glass border border-white/20 dark:border-white/10 rounded-3xl p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-textMain mb-2">Keep it up, {user.username}!</h2>
            <p className="text-textMuted mb-6 max-w-lg">
              You've completed <span className="text-textMain font-bold">{completedCount}</span> out of <span className="text-textMain font-bold">{totalCourses}</span> available courses.
            </p>
            
            <div className="flex flex-wrap gap-4">
               <Link to="/courses" className="flex-1 min-w-[150px] text-center px-6 py-2.5 bg-white/10 dark:bg-white/10 border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/20 text-textMain rounded-lg font-medium transition-colors">
                  Continue Learning
               </Link>
               <Link to="/certifications" className="flex-1 min-w-[150px] text-center px-6 py-2.5 bg-gradient-main text-white rounded-lg font-medium shadow-lg hover:shadow-primary/25 transition-all">
                  View Certificates
               </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        </div>

        {/* Progress Chart */}
        <div id="dash-progress-chart" className="bg-glass border border-white/20 dark:border-white/10 rounded-3xl p-5 sm:p-8 flex flex-col">
          <h3 className="text-lg font-semibold text-textMain mb-6">Progress by Category</h3>
          <div className="flex-1 flex items-end gap-2 sm:gap-4 min-h-[130px] sm:min-h-[150px]">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                 <div className="relative w-full bg-black/5 dark:bg-white/5 rounded-t-lg h-32 flex items-end overflow-hidden">
                    <div 
                      className={`w-full transition-all duration-1000 ease-out group-hover:opacity-80
                        ${idx === 0 ? 'bg-primaryLight' : idx === 1 ? 'bg-blue-400' : 'bg-pink-400'}
                        ${getPercentClass(Math.max(data.percent, 5), 'h')}
                      `}
                    />
                 </div>
                 <div className="text-[10px] sm:text-xs text-textMuted text-center font-medium truncate w-full" title={data.label}>
                   {data.label.split(' ')[0]}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Cards */}
      <div id="dash-categories">
        <h3 className="text-xl font-display font-bold text-textMain mb-6 flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-primaryLight" />
          Quick Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map(category => {
            const stats = getCategoryProgress(category.id);
            return (
              <Link 
                key={category.id} 
                to={`/category/${category.id}`}
                className="group bg-glass hover:bg-glass-hover border border-white/20 dark:border-white/10 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                     {getIcon(category.icon)}
                   </div>
                   <div className="text-xs font-bold bg-white/50 dark:bg-white/5 px-3 py-1 rounded-full text-textMuted">
                      {stats.passed}/{stats.total}
                   </div>
                </div>
                <h4 className="text-lg font-bold text-textMain mb-1">{category.title}</h4>
                <div className="w-full bg-black/5 dark:bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                   <div className={`h-full bg-gradient-to-r from-primary to-primaryLight transition-all duration-500 ${getPercentClass(stats.percent, 'w')}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

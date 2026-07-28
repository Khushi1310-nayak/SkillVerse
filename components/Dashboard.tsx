
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Network, Palette, CheckCircle, Clock, ChevronRight, Search, PlayCircle, Map, Flame, Loader2, Bookmark, History, Briefcase } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { firestoreService } from '../services/firestoreService';
import { Course } from '../types';
import { storageService } from '../services/storageService';
import { User, Progress } from '../types';
import { TourOverlay } from './TourOverlay';
import { Leaderboard } from './Leaderboard';
import { getRecommendedCourses } from '../utils/recommendations';
import { useToast } from '../contexts/ToastContext';
import { StreakCelebration } from './StreakCelebration';
import SkillRadarChart from "../components/SkillRadarChart";

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTour, setShowTour] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [careerProgress, setCareerProgress] = useState<any>(storageService.getCareerProgress());

    useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companyList = await firestoreService.getCompanies();
        setCompanies(companyList);

        // Calculate SRS Due Questions
        const careerProgress = storageService.getCareerProgress();
        const srsMap = careerProgress.srsData || {};

        let count = 0;
        const now = new Date();

        companyList.forEach(company => {
          company.questions.forEach(q => {
            const srs = srsMap[q.id];
            if (srs) {
              const nextReview = new Date(srs.nextReviewDate);
              if (nextReview <= now) {
                count++;
              }
            }
          });
        });
        setDueQuestionsCount(count);
      } catch (error) {
        console.error('Error fetching companies in Dashboard:', error);
      }
    };
    loadCompanies();
  }, []);

  useEffect(() => {
    if (user.streak > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const hasCelebratedToday = localStorage.getItem(`streak_celebrated_${user.username}_${todayStr}`);
      if (!hasCelebratedToday) {
        setShowStreakModal(true);
        localStorage.setItem(`streak_celebrated_${user.username}_${todayStr}`, 'true');
      }
    }
  }, [user.streak, user.username]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await firestoreService.getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses in Dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    if (user.settings?.reminders) {
      const hasStudiedToday = sessionStorage.getItem('studied_today');
      if (!hasStudiedToday) {
        showToast({ message: `Reminder: Hit your daily goal of ${user.settings.dailyGoal} minutes to keep your streak!`, type: 'info', duration: 5000 });
        sessionStorage.setItem('studied_today', 'true');
      }
    }
  }, [user.settings?.reminders, user.settings?.dailyGoal]);

  const allProgress = storageService.getAllProgress();

  const lastVisited = storageService.getLastVisited();
  const lastVisitedCourse = lastVisited
    ? courses.find(c => c.id === lastVisited.courseId)
    : undefined;
  const lastVisitedProgress = lastVisitedCourse
    ? allProgress.find(p => p.courseId === lastVisitedCourse.id)
    : undefined;
  const showContinueWidget = !!lastVisitedCourse && !lastVisitedProgress?.passed;

  const recommendedCourses = useMemo(
    () => getRecommendedCourses(user.settings, allProgress, courses),
    [user.settings, allProgress, courses]
  );

  const savedQuestionsList = useMemo(() => {
    const list: { question: any; companyName: string }[] = [];
    const savedIds = careerProgress.savedQuestions || [];
    
    if (savedIds.length === 0 || companies.length === 0) return [];
    
    companies.forEach(company => {
      company.questions.forEach((q: any) => {
        if (savedIds.includes(q.id)) {
          list.push({ question: q, companyName: company.name });
        }
      });
    });
    return list;
  }, [careerProgress.savedQuestions, companies]);

  const mockHistoryList = useMemo(() => {
    const scores = careerProgress.mockInterviewScores || [];
    if (scores.length === 0) return [];
    
    const sorted = [...scores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return sorted.map((attempt: any) => {
      const company = companies.find(c => c.id === attempt.companyId);
      return {
        ...attempt,
        companyName: company ? company.name : attempt.companyId,
        companyLogo: company ? company.logo : ''
      };
    });
  }, [careerProgress.mockInterviewScores, companies]);
  const completedCount = allProgress.filter(p => p.passed).length;
  const totalCourses = courses.length;
  const completionPercentage = totalCourses ? Math.round((completedCount / totalCourses) * 100) : 0;

  const getCategoryProgress = (catId: string) => {
    const catCourses = courses.filter(c => c.categoryId === catId);
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
  }, [allProgress, courses]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return [];
    return courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchQuery, courses]);

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

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primaryLight w-12 h-12" />
        <div className="mt-4 text-textMuted text-sm font-medium animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20 relative">
      {showTour && <TourOverlay onClose={handleTourComplete} />}

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
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-black/20 dark:border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
              {filteredCourses.length > 0 ? (
                <>
                  {filteredCourses.map(course => (
                    <Link
                      key={course.id}
                      to={`/course/${course.id}`}
                      className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-black/20 dark:border-white/5 last:border-0"
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

      {/* Continue Where You Left Off */}
      {showContinueWidget && lastVisitedCourse && (
        <div className="bg-glass border border-primary/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PlayCircle className="text-primaryLight" size={22} />
            </div>
            <div>
              <div className="text-xs font-bold text-primaryLight uppercase tracking-wider mb-0.5">
                Continue where you left off
              </div>
              <div className="text-base font-bold text-textMain">
                {lastVisitedCourse.title}
              </div>
            </div>
          </div>
          <Link
            to={`/course/${lastVisitedCourse.id}`}
            className="shrink-0 px-5 py-2.5 bg-gradient-main text-white rounded-lg font-medium shadow-lg hover:shadow-primary/25 transition-all"
          >
            Resume
          </Link>
        </div>
      )}

      {/* Spaced Repetition Review Queue Widget */}
      {dueQuestionsCount > 0 && (
        <div className="bg-glass border border-orange-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Clock className="text-orange-500 animate-pulse-slow" size={22} />
            </div>
            <div>
              <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-0.5 animate-pulse">
                Spaced Repetition Review
              </div>
              <div className="text-base font-bold text-textMain">
                You have {dueQuestionsCount} question{dueQuestionsCount !== 1 ? 's' : ''} due for review today!
              </div>
            </div>
          </div>
          <Link
            to="/career?review=true"
            className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium shadow-lg hover:shadow-orange-500/25 transition-all text-center w-full sm:w-auto"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Stats & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div id="dash-stats" className="lg:col-span-2 bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-3xl p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-textMain">Keep it up, {user.username}!</h2>
              {user.streak > 0 && (
                <button
                  onClick={() => setShowStreakModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold cursor-pointer hover:scale-105 transition-all hover:bg-orange-500/20 active:scale-95"
                  title="Click to view streak celebration"
                >
                  <Flame size={14} className="fill-orange-500" />
                  {user.streak} day{user.streak !== 1 ? 's' : ''} streak
                </button>
              )}
            </div>
            <p className="text-textMuted mb-6 max-w-lg">
              You've completed <span className="text-textMain font-bold">{completedCount}</span> out of <span className="text-textMain font-bold">{totalCourses}</span> available courses.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="flex-1 min-w-[150px] text-center px-6 py-2.5 bg-white/10 dark:bg-white/10 border border-black/20 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/20 text-textMain rounded-lg font-medium transition-colors">
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
        <div id="dash-progress-chart" className="bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-3xl p-5 sm:p-8 flex flex-col">
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

      {/* Recommended For You */}
      {recommendedCourses.length > 0 && (
        <div id="dash-recommended">
          <h3 className="text-xl font-display font-bold text-textMain mb-6 flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-primaryLight" />
            Recommended for You
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recommendedCourses.map(course => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="group flex-shrink-0 w-64 bg-glass hover:bg-glass-hover border border-white/20 dark:border-white/10 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-xs font-bold text-primaryLight uppercase tracking-wider mb-2">
                  {course.level}
                </div>
                <h4 className="text-base font-bold text-textMain leading-snug">
                  {course.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}

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
                className="group bg-glass hover:bg-glass-hover border border-black/20 dark:border-white/20 dark:border-white/10 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/20 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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

      {/*Radar Chart*/}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">
            Skill Profile
          </h2>

          <p className="mt-1 text-sm text-purple-200/70">
            Your learning progress across key technical skills
          </p>
        </div>

        <SkillRadarChart
          programming={getCategoryProgress('programming').passed > 0 ? getCategoryProgress('programming').percent : 0}
          dsa={getCategoryProgress('dsa').passed > 0 ? getCategoryProgress('dsa').percent : 0}
          systemDesign={getCategoryProgress('system-design').passed > 0 ? getCategoryProgress('system-design').percent : 0}
          frontend={getCategoryProgress('frontend').passed > 0 ? getCategoryProgress('frontend').percent : 0}
        />
      </div>


      {/* Career Mode Widgets (Saved Questions & Mock Interview History) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Saved Questions Widget */}
        <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-xl font-display font-bold text-textMain mb-4 flex items-center gap-2">
              <Bookmark className="text-primaryLight" size={22} />
              Saved Questions
            </h3>
            {savedQuestionsList.length > 0 ? (
              <div className="space-y-3">
                {savedQuestionsList.slice(0, 3).map(({ question, companyName }) => (
                  <div 
                    key={question.id}
                    className="p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-xl flex items-center justify-between hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <h4 className="text-sm font-bold text-textMain truncate">{question.title}</h4>
                      <span className="text-[10px] text-textMuted uppercase font-semibold">{companyName}</span>
                    </div>
                    <Link 
                      to={`/career`}
                      className="text-xs font-bold text-primaryLight shrink-0 hover:underline"
                    >
                      Practice &rarr;
                    </Link>
                  </div>
                ))}
                {savedQuestionsList.length > 3 && (
                  <div className="text-right">
                    <Link to="/career" className="text-xs font-bold text-primaryLight hover:underline">
                      View all {savedQuestionsList.length} saved questions &rarr;
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <Bookmark className="text-textMuted/30 mb-3" size={48} />
                <p className="text-sm text-textMuted max-w-sm mb-4">
                  You haven't saved any questions yet! Head to Career Mode to start practicing.
                </p>
                <Link
                  to="/career"
                  className="px-4 py-2 bg-gradient-main text-white text-xs font-bold rounded-lg shadow hover:shadow-primary/20 transition-all"
                >
                  Explore Questions
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mock Interview History Widget */}
        <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-xl font-display font-bold text-textMain mb-4 flex items-center gap-2">
              <History className="text-primaryLight" size={22} />
              Mock Interview History
            </h3>
            {mockHistoryList.length > 0 ? (
              <div className="space-y-3">
                {mockHistoryList.slice(0, 3).map((attempt, index) => {
                  const dateStr = new Date(attempt.date).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric' 
                  });
                  return (
                    <div 
                      key={index}
                      className="p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-xl flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-textMain">{attempt.companyName} Mock</h4>
                        </div>
                        <span className="text-[10px] text-textMuted">{dateStr}</span>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold 
                        ${attempt.score >= 70 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          attempt.score >= 50 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                          'bg-red-500/10 text-red-500 border border-red-500/20'}
                      `}>
                        {attempt.score}%
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <History className="text-textMuted/30 mb-3" size={48} />
                <p className="text-sm text-textMuted max-w-sm mb-4">
                  Start a Mock Interview in Career Mode to test your skills under real-world conditions.
                </p>
                <Link
                  to="/career"
                  className="px-4 py-2 bg-gradient-main text-white text-xs font-bold rounded-lg shadow hover:shadow-primary/20 transition-all"
                >
                  Start Mock Interview
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Leaderboard */}
      <div id="dash-leaderboard" className="mt-8">
        <Leaderboard />
      </div>

      {showStreakModal && (
        <StreakCelebration user={user} onClose={() => setShowStreakModal(false)} />
      )}
    </div>
  );
};

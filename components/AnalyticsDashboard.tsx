/**
 * Analytics Dashboard
 *
 * A comprehensive analytics page featuring:
 *  - Key metric summary cards
 *  - Weekly study heatmap (GitHub-style)
 *  - Subject breakdown bars
 *  - XP trend line chart (Recharts)
 *  - Mock interview trend chart
 *  - AI-style learning insights
 *  - Activity calendar heatmap
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie,
} from 'recharts';
import {
  TrendingUp, Clock, BookOpen, Flame, Trophy, Target,
  Brain, Download, ChevronRight, Award, Zap, AlertCircle,
} from 'lucide-react';
import { User } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { useToast } from '../contexts/ToastContext';
import { storageService } from '../services/storageService';
import { generateProgressReport } from '../utils/pdfGenerator';
import { BADGE_DEFINITIONS } from '../constants';

interface AnalyticsDashboardProps {
  user: User;
}

// ─── Heatmap Cell ─────────────────────────────────────────────────────────────

const HEATMAP_COLORS = [
  'bg-black/5 dark:bg-white/5',          // level 0
  'bg-primary/20 dark:bg-primary/20',     // level 1
  'bg-primary/40 dark:bg-primary/40',     // level 2
  'bg-primary/60 dark:bg-primary/60',     // level 3
  'bg-primary dark:bg-primary',           // level 4
];

const HeatmapCell: React.FC<{
  day: string;
  date: string;
  minutes: number;
  level: number;
}> = ({ day, date, minutes, level }) => {
  const tooltip = `${day} ${date}: ${minutes} min`;
  return (
    <div className="flex flex-col items-center gap-1.5 group" title={tooltip}>
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all duration-200 hover:scale-110 ${HEATMAP_COLORS[level]} border border-black/5 dark:border-white/5`}
      />
      <span className="text-[10px] font-medium text-textMuted">{day}</span>
      <span className="text-[9px] text-textMuted/60 hidden sm:block">
        {minutes > 0 ? `${minutes}m` : ''}
      </span>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
}> = ({ icon, label, value, sublabel, color = 'text-primaryLight' }) => (
  <div className="bg-glass border border-black/10 dark:border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-200">
    <div className={`w-11 h-11 rounded-xl bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/5 flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-2xl font-bold text-textMain leading-tight">{value}</div>
      <div className="text-xs font-medium text-textMuted mt-0.5">{label}</div>
      {sublabel && (
        <div className="text-[10px] text-textMuted/60 mt-0.5">{sublabel}</div>
      )}
    </div>
  </div>
);

// ─── Insight Card ─────────────────────────────────────────────────────────────

const InsightCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral';
}> = ({ icon, title, description, type }) => {
  const bgMap = {
    positive: 'border-emerald-500/20 bg-emerald-500/5',
    warning: 'border-yellow-500/20 bg-yellow-500/5',
    neutral: 'border-primary/20 bg-primary/5',
  };
  return (
    <div className={`rounded-xl border p-4 ${bgMap[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">{icon}</span>
        <div>
          <h4 className="text-sm font-bold text-textMain">{title}</h4>
          <p className="text-xs text-textMuted mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-black/20 dark:border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-bold text-textMain mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs text-textMuted">
            {entry.name}: <span className="font-bold" style={{ color: entry.color }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ user }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const analytics = useAnalytics(user);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'career'>('overview');

  const {
    summary,
    weeklyHeatmap,
    subjectBreakdown,
    xpTrend,
    mockInterviewTrends,
    insights,
  } = analytics;

  // ─── Pie chart data ─────────────────────────────────────────────────────────

  const pieData = useMemo(() =>
    subjectBreakdown.map((s) => ({
      name: s.categoryTitle.split(' ')[0],
      value: s.completedCourses,
      total: s.totalCourses,
      color: s.color,
    })),
    [subjectBreakdown]
  );

  // ─── Export handler ─────────────────────────────────────────────────────────

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const allProgress = storageService.getAllProgress();
      const earnedBadges = BADGE_DEFINITIONS
        .filter((b) => (user.badges || []).includes(b.id))
        .map((b) => ({ name: b.name, description: b.description }));

      const courses = allProgress.map((p: any) => ({
        title: p.courseId,
        level: 'Unknown',
        passed: p.passed,
        score: p.score,
        completedDate: p.completedDate,
        totalChapters: 0,
        completedChapters: p.passed ? 1 : 0,
      }));

      await generateProgressReport({
        username: user.username,
        date: new Date().toLocaleDateString(),
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        overallCompletionPercent: summary.totalCoursesAttempted > 0
          ? Math.round((summary.totalCoursesCompleted / summary.totalCoursesAttempted) * 100)
          : 0,
        courses,
        earnedBadges,
      });
      showToast({ message: 'Analytics report exported successfully!', type: 'success' });
    } catch (err) {
      console.error('Export failed:', err);
      showToast({ message: 'Failed to export analytics report.', type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-textMain flex items-center gap-3">
            <Brain className="text-primaryLight" size={28} />
            Learning Analytics
          </h2>
          <p className="text-textMuted mt-1">
            Deep insights into your learning journey, study patterns, and progress.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-main text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          {isExporting ? 'Exporting...' : 'Export Analytics PDF'}
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 bg-glass border border-black/10 dark:border-white/10 rounded-xl p-1.5 w-fit">
        {(['overview', 'subjects', 'career'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'bg-gradient-main text-white shadow-lg'
                : 'text-textMuted hover:text-textMain hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* OVERVIEW TAB                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Clock size={20} />}
              label="Total Study Time"
              value={`${summary.totalStudyHours}h`}
              sublabel={`${summary.averageDailyMinutes} min/day avg`}
            />
            <StatCard
              icon={<Flame size={20} />}
              label="Current Streak"
              value={`${summary.currentStreak} days`}
              sublabel="Keep it going!"
              color="text-orange-400"
            />
            <StatCard
              icon={<BookOpen size={20} />}
              label="Courses Completed"
              value={`${summary.totalCoursesCompleted}/${summary.totalCoursesAttempted}`}
              sublabel="Passed courses"
              color="text-blue-400"
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="Average Quiz Score"
              value={`${summary.averageQuizScore}%`}
              sublabel={`${summary.totalQuizzesPassed} quizzes passed`}
              color="text-emerald-400"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Zap size={20} />}
              label="Total XP Earned"
              value={summary.totalXpEarned.toLocaleString()}
              sublabel={`Level ${summary.currentLevel}`}
              color="text-yellow-400"
            />
            <StatCard
              icon={<Award size={20} />}
              label="Badges Earned"
              value={`${summary.totalBadgesEarned}/${BADGE_DEFINITIONS.length}`}
              sublabel="Achievements unlocked"
              color="text-purple-400"
            />
            <StatCard
              icon={<Target size={20} />}
              label="Questions Practiced"
              value={summary.totalQuestionsPracticed}
              sublabel="Career mode questions"
              color="text-cyan-400"
            />
            <StatCard
              icon={<Trophy size={20} />}
              label="Account Age"
              value={`${summary.accountAgeDays} days`}
              sublabel="Since enrollment"
              color="text-pink-400"
            />
          </div>

          {/* Weekly Study Heatmap */}
          <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-primaryLight" />
              Weekly Study Heatmap
            </h3>
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              {weeklyHeatmap.map((row) => (
                <HeatmapCell
                  key={row.date}
                  day={row.day}
                  date={row.date}
                  minutes={row.minutes}
                  level={row.level}
                />
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-textMuted">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-4 h-4 rounded ${HEATMAP_COLORS[level]} border border-black/5 dark:border-white/5`}
                />
              ))}
              <span>More</span>
            </div>
          </div>

          {/* XP Trend Chart */}
          <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-primaryLight" />
              XP Earned (Last 14 Days)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpTrend}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--color-primary-light))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(var(--color-primary-light))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: 'rgb(148 163 184)' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10, fill: 'rgb(148 163 184)' }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    name="XP"
                    stroke="rgb(var(--color-primary-light))"
                    fill="url(#xpGradient)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'rgb(var(--color-primary-light))' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Learning Insights */}
          <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-primaryLight" />
              Learning Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  icon={insight.icon}
                  title={insight.title}
                  description={insight.description}
                  type={insight.type}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SUBJECTS TAB                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'subjects' && (
        <>
          {/* Subject Breakdown Bars */}
          <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-primaryLight" />
              Subject Completion Breakdown
            </h3>
            <div className="space-y-6">
              {subjectBreakdown.map((subject) => (
                <div key={subject.categoryId}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-textMain">{subject.categoryTitle}</h4>
                      <span className="text-[10px] text-textMuted">
                        {subject.completedCourses}/{subject.totalCourses} courses
                        {' · '}Avg score: {subject.averageScore}%
                      </span>
                    </div>
                    <span
                      className="text-sm font-bold px-3 py-1 rounded-full"
                      style={{
                        color: subject.color,
                        backgroundColor: `${subject.color}15`,
                      }}
                    >
                      {subject.completionPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${subject.completionPercent}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Completion Pie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center">
              <h3 className="text-lg font-bold text-textMain mb-6 self-start flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-primaryLight" />
                Completions by Subject
              </h3>
              <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs text-textMuted">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name} ({entry.value}/{entry.total})
                  </div>
                ))}
              </div>
            </div>

            {/* Category Detail Cards */}
            <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-primaryLight" />
                Subject Details
              </h3>
              <div className="space-y-4">
                {subjectBreakdown.map((subject) => (
                  <Link
                    key={subject.categoryId}
                    to={`/category/${subject.categoryId}`}
                    className="block p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-textMain group-hover:text-primaryLight transition-colors">
                          {subject.categoryTitle}
                        </h4>
                        <p className="text-[10px] text-textMuted mt-0.5">
                          Avg Score: {subject.averageScore}% · {subject.completedCourses} completed
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-textMuted group-hover:text-primaryLight transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CAREER TAB                                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'career' && (
        <>
          {/* Career Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={<Trophy size={20} />}
              label="Mock Interviews"
              value={summary.totalMockInterviews}
              sublabel="Completed sessions"
              color="text-yellow-400"
            />
            <StatCard
              icon={<Target size={20} />}
              label="Average Mock Score"
              value={`${summary.averageMockScore}%`}
              sublabel="Across all companies"
              color="text-emerald-400"
            />
            <StatCard
              icon={<Brain size={20} />}
              label="Questions Practiced"
              value={summary.totalQuestionsPracticed}
              sublabel="Total unique questions"
              color="text-purple-400"
            />
          </div>

          {/* Mock Interview Trend */}
          {mockInterviewTrends.length > 0 ? (
            <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-primaryLight" />
                Mock Interview Score Trend
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockInterviewTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="companyName"
                      tick={{ fontSize: 10, fill: 'rgb(148 163 184)' }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: 'rgb(148 163 184)' }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
                      {mockInterviewTrends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-8 text-center">
              <AlertCircle className="mx-auto text-textMuted/30 mb-4" size={48} />
              <h3 className="text-lg font-bold text-textMain mb-2">No Mock Interviews Yet</h3>
              <p className="text-sm text-textMuted mb-4">
                Complete mock interviews to see your score trends over time.
              </p>
              <Link
                to="/career"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-main text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
              >
                Start Practicing <ChevronRight size={16} />
              </Link>
            </div>
          )}

          {/* Career Tips */}
          <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-primaryLight" />
              Career Preparation Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: '📝',
                  title: 'Practice Daily',
                  desc: 'Complete at least 2-3 interview questions daily to build consistency.',
                },
                {
                  icon: '🔄',
                  title: 'Use Spaced Repetition',
                  desc: 'Review questions at increasing intervals to strengthen long-term recall.',
                },
                {
                  icon: '🎯',
                  title: 'Focus on Weak Areas',
                  desc: 'Identify topics where your scores are lowest and prioritize them.',
                },
                {
                  icon: '🗣️',
                  title: 'Try Voice Interviews',
                  desc: 'Practice explaining your thought process out loud — it builds communication skills.',
                },
              ].map((tip, idx) => (
                <div key={idx} className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{tip.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-textMain">{tip.title}</h4>
                      <p className="text-xs text-textMuted mt-1">{tip.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

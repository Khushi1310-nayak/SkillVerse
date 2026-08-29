/**
 * Achievement Gallery
 *
 * A dedicated page showcasing all badges — earned and locked —
 * with progress tracking, filtering, and detailed milestone stats.
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Trophy, Award, Flame, Briefcase, CheckCircle, Lock,
  ChevronRight, Target, BookOpen, Star, Filter, Sparkles,
  TrendingUp, Calendar, Zap,
} from 'lucide-react';
import { User, BadgeDefinition } from '../types';
import { BADGE_DEFINITIONS, COMPANIES } from '../constants';
import { storageService } from '../services/storageService';

interface AchievementGalleryProps {
  user: User;
}

// ─── Badge Icon Map ───────────────────────────────────────────────────────────

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Footprints: <BookOpen size={32} />,
  Award: <Award size={32} />,
  Flame: <Flame size={32} />,
  Briefcase: <Briefcase size={32} />,
};

const BADGE_COLORS: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  'first-steps': {
    bg: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    text: 'text-blue-400',
  },
  certified: {
    bg: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20',
    text: 'text-yellow-400',
  },
  'on-fire': {
    bg: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
    text: 'text-orange-400',
  },
  'interview-ready': {
    bg: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    text: 'text-emerald-400',
  },
};

const DEFAULT_BADGE_COLOR = {
  bg: 'from-primary/20 to-primaryLight/20',
  border: 'border-primary/30',
  glow: 'shadow-primary/20',
  text: 'text-primaryLight',
};

// ─── Progress Metrics Calculator ──────────────────────────────────────────────

function computeMetrics(user: User) {
  const allProgress = storageService.getAllProgress();
  const career = storageService.getCareerProgress();

  const completedCourses = allProgress.filter((p) => p.passed).length;
  const currentStreak = user.streak;
  const mockInterviews = (career.mockInterviewScores || []).length;

  return {
    courses: completedCourses,
    streak: currentStreak,
    mockInterviews,
  };
}

function getBadgeProgress(
  badge: BadgeDefinition,
  metrics: { courses: number; streak: number; mockInterviews: number }
) {
  const { metric, target } = badge.requirement;
  const current = Math.min(metrics[metric as keyof typeof metrics] ?? 0, target);
  const percent = target > 0 ? Math.round((current / target) * 100) : 0;
  return { current, target, percent };
}

const METRIC_LABELS: Record<string, string> = {
  courses: 'courses completed',
  streak: 'day streak',
  mockInterviews: 'mock interviews',
};

// ─── Badge Card Component ─────────────────────────────────────────────────────

const BadgeCard: React.FC<{
  badge: BadgeDefinition;
  earned: boolean;
  progress: { current: number; target: number; percent: number };
  expanded: boolean;
  onToggle: () => void;
}> = ({ badge, earned, progress, expanded, onToggle }) => {
  const colors = BADGE_COLORS[badge.id] || DEFAULT_BADGE_COLOR;
  const icon = BADGE_ICONS[badge.icon] || <Award size={32} />;

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group ${
        earned
          ? `${colors.border} bg-gradient-to-br ${colors.bg} shadow-lg ${colors.glow} hover:shadow-xl`
          : 'border-black/10 dark:border-white/10 bg-glass hover:border-primary/20'
      }`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      aria-expanded={expanded}
      aria-label={`${badge.name} badge${earned ? ' (earned)' : ''}`}
    >
      {/* Earned sparkle indicator */}
      {earned && (
        <div className="absolute top-3 right-3">
          <Sparkles size={16} className={`${colors.text} animate-pulse`} />
        </div>
      )}

      {/* Lock overlay for locked badges */}
      {!earned && (
        <div className="absolute top-3 right-3">
          <Lock size={14} className="text-textMuted/40" />
        </div>
      )}

      <div className="p-6">
        {/* Badge Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 ${
            earned
              ? `${colors.text} bg-white/10 group-hover:scale-110 group-hover:rotate-3`
              : 'text-textMuted/30 bg-black/5 dark:bg-white/5 grayscale'
          }`}
        >
          {icon}
        </div>

        {/* Badge Info */}
        <h3
          className={`text-lg font-bold mb-1 transition-colors ${
            earned ? 'text-textMain' : 'text-textMuted'
          }`}
        >
          {badge.name}
        </h3>
        <p className={`text-sm mb-4 leading-relaxed ${earned ? 'text-textMuted' : 'text-textMuted/60'}`}>
          {badge.description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
              {METRIC_LABELS[badge.requirement.metric] || badge.requirement.metric}
            </span>
            <span className={`text-xs font-bold ${earned ? colors.text : 'text-textMuted/60'}`}>
              {progress.current}/{progress.target}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                earned ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-primary/40'
              }`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-textMuted/50">
              {progress.percent}% complete
            </span>
            {earned && (
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle size={10} /> Earned
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-black/5 dark:border-white/5 animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-textMuted">
              <Target size={12} className="text-primaryLight" />
              <span>
                Requirement: <strong className="text-textMain">{progress.target}</strong>{' '}
                {METRIC_LABELS[badge.requirement.metric]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-textMuted">
              <TrendingUp size={12} className="text-primaryLight" />
              <span>
                Current: <strong className="text-textMain">{progress.current}</strong>{' '}
                {METRIC_LABELS[badge.requirement.metric]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-textMuted">
              <Calendar size={12} className="text-primaryLight" />
              <span>
                {progress.target - progress.current > 0
                  ? `${progress.target - progress.current} more to go`
                  : 'Badge unlocked!'}
              </span>
            </div>
            {!earned && (
              <Link
                to={badge.requirement.metric === 'courses' ? '/courses' : '/career'}
                className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-gradient-main text-white text-xs font-bold rounded-lg hover:shadow-md transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                Start Earning <ChevronRight size={12} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({ user }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const metrics = useMemo(() => computeMetrics(user), [user]);

  const badgeStatuses = useMemo(() => {
    return BADGE_DEFINITIONS.map((badge) => {
      const earned = (user.badges || []).includes(badge.id);
      const progress = getBadgeProgress(badge, metrics);
      return { badge, earned, progress };
    });
  }, [user.badges, metrics]);

  const filteredBadges = useMemo(() => {
    switch (filter) {
      case 'earned':
        return badgeStatuses.filter((s) => s.earned);
      case 'locked':
        return badgeStatuses.filter((s) => !s.earned);
      default:
        return badgeStatuses;
    }
  }, [badgeStatuses, filter]);

  const earnedCount = badgeStatuses.filter((s) => s.earned).length;
  const totalCount = badgeStatuses.length;
  const completionPercent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  // Upcoming badges (closest to being earned, sorted by percent desc)
  const upcomingBadges = useMemo(() => {
    return badgeStatuses
      .filter((s) => !s.earned)
      .sort((a, b) => b.progress.percent - a.progress.percent)
      .slice(0, 3);
  }, [badgeStatuses]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-bold text-textMain flex items-center gap-3">
          <Trophy className="text-yellow-400" size={28} />
          Achievement Gallery
        </h2>
        <p className="text-textMuted mt-1">
          Track your milestones, earn badges, and showcase your learning achievements.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Completion Ring */}
        <div className="bg-glass border border-black/10 dark:border-white/10 rounded-2xl p-6 flex items-center gap-5 col-span-1 sm:col-span-2">
          <div className="relative shrink-0">
            <svg width={100} height={100} className="transform -rotate-90">
              <circle
                className="text-black/5 dark:text-white/5"
                stroke="currentColor"
                fill="transparent"
                strokeWidth={8}
                r={42}
                cx={50}
                cy={50}
              />
              <circle
                className="text-yellow-400 transition-all duration-1000 ease-out"
                stroke="currentColor"
                fill="transparent"
                strokeWidth={8}
                strokeDasharray={263.9}
                strokeDashoffset={263.9 - (completionPercent / 100) * 263.9}
                strokeLinecap="round"
                r={42}
                cx={50}
                cy={50}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-textMain">{completionPercent}%</span>
              <span className="text-[9px] text-textMuted font-semibold">COMPLETE</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-textMain">
              {earnedCount} of {totalCount} Badges Earned
            </h3>
            <p className="text-sm text-textMuted mt-1">
              {earnedCount === totalCount
                ? '🎉 Congratulations! You have earned every badge!'
                : `${totalCount - earnedCount} badge${totalCount - earnedCount !== 1 ? 's' : ''} remaining. Keep learning!`}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-glass border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Total XP</span>
              <span className="text-sm font-bold text-yellow-400">{user.xp.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Level</span>
              <span className="text-sm font-bold text-primaryLight">{user.level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Streak</span>
              <span className="text-sm font-bold text-orange-400">{user.streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Badges */}
      {upcomingBadges.length > 0 && (
        <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-textMain mb-5 flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-primaryLight" />
            Almost There
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upcomingBadges.map(({ badge, progress }) => {
              const colors = BADGE_COLORS[badge.id] || DEFAULT_BADGE_COLOR;
              return (
                <div
                  key={badge.id}
                  className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-textMuted/40 bg-white/5`}>
                      {BADGE_ICONS[badge.icon] ? React.cloneElement(BADGE_ICONS[badge.icon] as React.ReactElement, { size: 20 }) : <Award size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-textMain">{badge.name}</h4>
                      <span className="text-[10px] text-textMuted">{progress.percent}% complete</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/50 transition-all duration-500"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-textMuted mt-2">
                    {progress.target - progress.current} more {METRIC_LABELS[badge.requirement.metric]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-glass border border-black/10 dark:border-white/10 rounded-xl p-1.5 w-fit">
        {([
          { id: 'all' as const, label: 'All Badges', count: totalCount },
          { id: 'earned' as const, label: 'Earned', count: earnedCount },
          { id: 'locked' as const, label: 'Locked', count: totalCount - earnedCount },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              filter === tab.id
                ? 'bg-gradient-main text-white shadow-lg'
                : 'text-textMuted hover:text-textMain hover:bg-white/5'
            }`}
          >
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                filter === tab.id ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      {filteredBadges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBadges.map(({ badge, earned, progress }) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={earned}
              progress={progress}
              expanded={expandedId === badge.id}
              onToggle={() => toggleExpand(badge.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-12 text-center">
          <Filter size={40} className="text-textMuted/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-textMain mb-2">
            No {filter === 'earned' ? 'earned' : 'locked'} badges
          </h3>
          <p className="text-sm text-textMuted max-w-sm mx-auto">
            {filter === 'earned'
              ? 'Complete courses and challenges to earn your first badge!'
              : 'All badges have been earned. Amazing work!'}
          </p>
        </div>
      )}

      {/* Milestones Timeline */}
      <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-primaryLight" />
          Badge Milestones
        </h3>
        <div className="space-y-4">
          {BADGE_DEFINITIONS.map((badge, idx) => {
            const earned = (user.badges || []).includes(badge.id);
            const colors = BADGE_COLORS[badge.id] || DEFAULT_BADGE_COLOR;
            return (
              <div key={badge.id} className="flex items-start gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      earned
                        ? `${colors.text} bg-white/10 border ${colors.border}`
                        : 'text-textMuted/30 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10'
                    }`}
                  >
                    {earned ? <CheckCircle size={14} /> : <Lock size={14} />}
                  </div>
                  {idx < BADGE_DEFINITIONS.length - 1 && (
                    <div className={`w-px h-8 mt-1 ${earned ? 'bg-emerald-500/30' : 'bg-black/10 dark:bg-white/5'}`} />
                  )}
                </div>
                {/* Timeline content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold ${earned ? 'text-textMain' : 'text-textMuted'}`}>
                      {badge.name}
                    </h4>
                    {earned && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-textMuted mt-0.5">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

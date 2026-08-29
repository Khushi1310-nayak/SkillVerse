/**
 * Activity History & Timeline
 *
 * A comprehensive learning history page featuring:
 *  - Chronological timeline of all learning events
 *  - Course completions, quiz results, mock interviews, streak days
 *  - Filtering by event type
 *  - Summary stats bar
 *  - Search through history
 *  - Visual timeline with icons and color coding
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  History, BookOpen, Trophy, Flame, Briefcase, Target,
  Clock, Search, Filter, ChevronRight, Star, Zap, Award,
  Calendar, TrendingUp, CheckCircle, XCircle, BarChart3,
  ArrowUpRight, Sparkles,
} from 'lucide-react';
import { User, Progress } from '../types';
import { storageService } from '../services/storageService';
import { COURSES, COMPANIES } from '../constants';

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = 'course_completed' | 'course_started' | 'quiz_passed' | 'quiz_failed' | 'mock_interview' | 'streak_day' | 'badge_earned' | 'xp_milestone' | 'daily_challenge';

interface ActivityEvent {
  id: string;
  type: EventType;
  timestamp: string;
  title: string;
  description: string;
  metadata?: {
    score?: number;
    xp?: number;
    courseId?: string;
    companyId?: string;
    streak?: number;
    badgeName?: string;
    level?: number;
  };
}

interface ActivityHistoryProps {
  user: User;
}

// ─── Event Config ─────────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<EventType, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}> = {
  course_completed: {
    icon: <CheckCircle size={18} />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    label: 'Course Completed',
  },
  course_started: {
    icon: <BookOpen size={18} />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: 'Course Started',
  },
  quiz_passed: {
    icon: <Star size={18} />,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    label: 'Quiz Passed',
  },
  quiz_failed: {
    icon: <XCircle size={18} />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Quiz Failed',
  },
  mock_interview: {
    icon: <Briefcase size={18} />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    label: 'Mock Interview',
  },
  streak_day: {
    icon: <Flame size={18} />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    label: 'Streak Day',
  },
  badge_earned: {
    icon: <Award size={18} />,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    label: 'Badge Earned',
  },
  xp_milestone: {
    icon: <Zap size={18} />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    label: 'XP Milestone',
  },
  daily_challenge: {
    icon: <Trophy size={18} />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    label: 'Daily Challenge',
  },
};

const FILTER_OPTIONS: { id: 'all' | EventType; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Events', icon: <History size={14} /> },
  { id: 'course_completed', label: 'Completions', icon: <CheckCircle size={14} /> },
  { id: 'quiz_passed', label: 'Quizzes', icon: <Star size={14} /> },
  { id: 'mock_interview', label: 'Interviews', icon: <Briefcase size={14} /> },
  { id: 'streak_day', label: 'Streaks', icon: <Flame size={14} /> },
  { id: 'badge_earned', label: 'Badges', icon: <Award size={14} /> },
];

// ─── Event Builder ────────────────────────────────────────────────────────────

function buildActivityEvents(user: User): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  const allProgress = storageService.getAllProgress();
  const career = storageService.getCareerProgress();
  const studyData = storageService.getStudyTimeRecords();
  const streakData = storageService.getStreakData();

  // Course completions and starts
  allProgress.forEach((p: Progress) => {
    const course = COURSES.find((c) => c.id === p.courseId);
    const courseTitle = course?.title || p.courseId;

    if (p.passed && p.completedDate) {
      events.push({
        id: `completed-${p.courseId}`,
        type: 'course_completed',
        timestamp: p.completedDate,
        title: `Completed "${courseTitle}"`,
        description: `Scored ${p.score}% on the final quiz. Course marked as passed.`,
        metadata: { score: p.score, xp: 25, courseId: p.courseId },
      });
    } else if (!p.passed) {
      // Estimate a start date from completion or use enrolled date
      const startedDate = p.completedDate || user.enrolledDate;
      events.push({
        id: `started-${p.courseId}`,
        type: 'course_started',
        timestamp: startedDate,
        title: `Started "${courseTitle}"`,
        description: `Began learning ${courseTitle}. Keep going!`,
        metadata: { courseId: p.courseId },
      });
    }
  });

  // Mock interviews
  (career.mockInterviewScores || []).forEach((attempt, idx) => {
    const company = COMPANIES.find((c) => c.id === attempt.companyId);
    const companyName = company?.name || attempt.companyId;
    const passed = attempt.score >= 70;

    events.push({
      id: `mock-${attempt.companyId}-${idx}`,
      type: 'mock_interview',
      timestamp: attempt.date,
      title: `${companyName} Mock Interview`,
      description: passed
        ? `Scored ${attempt.score}% — great performance!`
        : `Scored ${attempt.score}%. Review feedback and try again.`,
      metadata: {
        score: attempt.score,
        xp: 10,
        companyId: attempt.companyId,
      },
    });
  });

  // Streak days from activity data
  const activities = streakData.activities || {};
  Object.keys(activities)
    .filter((date) => activities[date].level > 0)
    .sort()
    .forEach((date) => {
      const activity = activities[date];
      events.push({
        id: `streak-${date}`,
        type: 'streak_day',
        timestamp: `${date}T12:00:00.000Z`,
        title: `Study Streak Day`,
        description: `Earned ${activity.xp} XP across ${activity.courses.length} course${activity.courses.length !== 1 ? 's' : ''}.`,
        metadata: { xp: activity.xp, streak: 1 },
      });
    });

  // XP milestones — every 500 XP
  const xpMilestones = [500, 1000, 1500, 2000, 3000, 5000, 7500, 10000];
  xpMilestones.forEach((milestone) => {
    if (user.xp >= milestone) {
      events.push({
        id: `xp-${milestone}`,
        type: 'xp_milestone',
        timestamp: user.enrolledDate,
        title: `Reached ${milestone.toLocaleString()} XP`,
        description: `Accumulated ${milestone.toLocaleString()} experience points. Level ${user.level} achieved!`,
        metadata: { xp: milestone, level: user.level },
      });
    }
  });

  // Badges earned
  (user.badges || []).forEach((badgeId) => {
    const badgeName = badgeId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    events.push({
      id: `badge-${badgeId}`,
      type: 'badge_earned',
      timestamp: user.enrolledDate,
      title: `Earned "${badgeName}" Badge`,
      description: `Unlocked the ${badgeName} achievement badge.`,
      metadata: { badgeName },
    });
  });

  // Study time milestones — for each day with 30+ minutes
  Object.keys(studyData).forEach((date) => {
    const minutes = Math.round(studyData[date] / 60);
    if (minutes >= 30) {
      events.push({
        id: `study-${date}`,
        type: 'streak_day',
        timestamp: `${date}T18:00:00.000Z`,
        title: `Studied ${minutes} minutes`,
        description: `Focused learning session on ${date}.`,
        metadata: { xp: 0 },
      });
    }
  });

  return events;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDateGroup(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - eventDate.getTime()) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return 'This Week';
  if (diffDays < 30) return 'This Month';
  return 'Older';
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreBadgeClass(score: number): string {
  if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (score >= 60) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  return 'bg-red-500/10 text-red-400 border-red-500/20';
}

// ─── Event Card ───────────────────────────────────────────────────────────────

const EventCard: React.FC<{
  event: ActivityEvent;
  isFirst: boolean;
  isLast: boolean;
}> = ({ event, isFirst, isLast }) => {
  const config = EVENT_CONFIG[event.type];

  return (
    <div className="flex gap-4 group">
      {/* Timeline Line */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bgColor} ${config.color} border ${config.borderColor} transition-transform duration-200 group-hover:scale-110`}
        >
          {config.icon}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-black/10 dark:bg-white/5 mt-2" />
        )}
      </div>

      {/* Event Content */}
      <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
        <div className="bg-glass border border-black/10 dark:border-white/10 rounded-xl p-4 hover:border-primary/20 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                  {config.label}
                </span>
              </div>
              <h4 className="text-sm font-bold text-textMain leading-snug">{event.title}</h4>
              <p className="text-xs text-textMuted mt-1 leading-relaxed">{event.description}</p>
            </div>

            {/* Score Badge */}
            {event.metadata?.score !== undefined && (
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border shrink-0 ${getScoreBadgeClass(event.metadata.score)}`}>
                {event.metadata.score}%
              </div>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-black/5 dark:border-white/5">
            <span className="text-[10px] text-textMuted flex items-center gap-1">
              <Calendar size={10} />
              {formatDate(event.timestamp)}
            </span>
            {event.metadata?.xp !== undefined && event.metadata.xp > 0 && (
              <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-1">
                <Zap size={10} />
                +{event.metadata.xp} XP
              </span>
            )}
            {event.type === 'mock_interview' && event.metadata?.companyId && (
              <Link
                to="/career"
                className="text-[10px] text-primaryLight font-bold flex items-center gap-1 hover:underline"
              >
                Practice Again <ArrowUpRight size={10} />
              </Link>
            )}
            {event.type === 'course_completed' && event.metadata?.courseId && (
              <Link
                to={`/certificate/${event.metadata.courseId}`}
                className="text-[10px] text-primaryLight font-bold flex items-center gap-1 hover:underline"
              >
                View Certificate <ArrowUpRight size={10} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Stats Card ───────────────────────────────────────────────────────────────

const StatsCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}> = ({ icon, label, value, color = 'text-primaryLight' }) => (
  <div className="bg-glass border border-black/10 dark:border-white/10 rounded-2xl p-4 flex items-center gap-3">
    <div className={`w-9 h-9 rounded-lg bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/5 flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-lg font-bold text-textMain leading-tight">{value}</div>
      <div className="text-[10px] font-medium text-textMuted uppercase tracking-wider">{label}</div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ user }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | EventType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allEvents = useMemo(() => buildActivityEvents(user), [user]);

  // Deduplicate events (some might be generated from multiple sources)
  const uniqueEvents = useMemo(() => {
    const seen = new Set<string>();
    return allEvents.filter((e) => {
      const key = `${e.type}-${e.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = uniqueEvents;

    if (filter !== 'all') {
      events = events.filter((e) => e.type === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    // Sort by timestamp descending
    return [...events].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [uniqueEvents, filter, searchQuery]);

  // Group events by date category
  const groupedEvents = useMemo(() => {
    const groups: { label: string; events: ActivityEvent[] }[] = [];
    let currentGroup = '';

    filteredEvents.forEach((event) => {
      const group = getDateGroup(event.timestamp);
      if (group !== currentGroup) {
        currentGroup = group;
        groups.push({ label: group, events: [] });
      }
      groups[groups.length - 1].events.push(event);
    });

    return groups;
  }, [filteredEvents]);

  // Summary stats
  const stats = useMemo(() => {
    const completions = uniqueEvents.filter((e) => e.type === 'course_completed').length;
    const quizzes = uniqueEvents.filter((e) => e.type === 'quiz_passed').length;
    const interviews = uniqueEvents.filter((e) => e.type === 'mock_interview').length;
    const streaks = uniqueEvents.filter((e) => e.type === 'streak_day').length;

    return { completions, quizzes, interviews, streaks, total: uniqueEvents.length };
  }, [uniqueEvents]);

  // Event type counts for filter badges
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: uniqueEvents.length };
    uniqueEvents.forEach((e) => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });
    return counts;
  }, [uniqueEvents]);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-bold text-textMain flex items-center gap-3">
          <History className="text-primaryLight" size={28} />
          Activity History
        </h2>
        <p className="text-textMuted mt-1">
          A chronological record of your learning journey, achievements, and milestones.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          icon={<CheckCircle size={18} />}
          label="Completions"
          value={stats.completions}
          color="text-emerald-400"
        />
        <StatsCard
          icon={<Star size={18} />}
          label="Quizzes Passed"
          value={stats.quizzes}
          color="text-yellow-400"
        />
        <StatsCard
          icon={<Briefcase size={18} />}
          label="Mock Interviews"
          value={stats.interviews}
          color="text-purple-400"
        />
        <StatsCard
          icon={<Flame size={18} />}
          label="Active Days"
          value={stats.streaks}
          color="text-orange-400"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
        <input
          type="text"
          placeholder="Search activity history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-glass border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTER_OPTIONS.map((option) => {
          const count = typeCounts[option.id] || 0;
          if (option.id !== 'all' && count === 0) return null;
          return (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                filter === option.id
                  ? 'bg-gradient-main text-white shadow-lg'
                  : 'bg-glass border border-black/10 dark:border-white/10 text-textMuted hover:text-textMain hover:border-primary/20'
              }`}
            >
              {option.icon}
              {option.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  filter === option.id ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {groupedEvents.length > 0 ? (
        <div className="space-y-8">
          {groupedEvents.map((group) => (
            <div key={group.label}>
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-black/10 dark:bg-white/5" />
                <span className="text-xs font-bold text-textMuted uppercase tracking-wider px-3 py-1 bg-glass border border-black/10 dark:border-white/10 rounded-full">
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-black/10 dark:bg-white/5" />
              </div>

              {/* Events */}
              <div>
                {group.events.map((event, idx) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isFirst={idx === 0}
                    isLast={idx === group.events.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-glass border border-black/10 dark:border-white/10 rounded-3xl p-12 text-center">
          <History size={40} className="text-textMuted/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-textMain mb-2">No Activity Found</h3>
          <p className="text-sm text-textMuted max-w-sm mx-auto mb-6">
            {searchQuery
              ? `No events match "${searchQuery}". Try a different search term.`
              : filter !== 'all'
              ? 'No events of this type yet. Start learning to build your history!'
              : 'Start completing courses and quizzes to build your activity history.'}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-main text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
          >
            Browse Courses <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Bottom Summary */}
      {filteredEvents.length > 0 && (
        <div className="bg-glass border border-black/10 dark:border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <span className="text-xs text-textMuted">
            Showing {filteredEvents.length} of {uniqueEvents.length} events
          </span>
          <span className="text-xs text-textMuted flex items-center gap-1.5">
            <Sparkles size={12} className="text-primaryLight" />
            Total XP: <strong className="text-yellow-400">{user.xp.toLocaleString()}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

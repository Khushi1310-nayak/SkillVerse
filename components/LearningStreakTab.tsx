import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Flame, Trophy, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { storageService, DailyActivity, StreakData, getLocalDateString } from '../services/storageService';
import { User, Progress } from '../types';

interface LearningStreakTabProps {
  user: User;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Seed the activity log from existing progress records stored in localStorage.
 * This runs once on mount so historical completions appear on the calendar.
 */
function seedActivitiesFromProgress(existingData: StreakData, allProgress: Progress[]): StreakData {
  const updated: StreakData = {
    ...existingData,
    activities: { ...existingData.activities },
  };

  for (const prog of allProgress) {
    if (!prog.completedDate || !prog.passed) continue;
    const dateObj = new Date(prog.completedDate);
    const dateStr = !isNaN(dateObj.getTime()) ? getLocalDateString(dateObj) : prog.completedDate.split('T')[0];
    const courseId = prog.courseId;
    const existing = updated.activities[dateStr];

    if (existing) {
      if (!existing.courses.includes(courseId)) {
        existing.courses = [...existing.courses, courseId];
        existing.xp = existing.xp + 50;
        existing.level = existing.xp === 0 ? 0 : existing.xp < 50 ? 1 : existing.xp < 100 ? 2 : 3;
      }
    } else {
      updated.activities[dateStr] = {
        date: dateStr,
        xp: 50,
        courses: [courseId],
        level: 1,
      };
    }
  }

  return updated;
}

/**
 * Calculate longest streak from activity map.
 * A streak is consecutive calendar days with level > 0.
 */
function calcLongestStreak(activities: Record<string, DailyActivity>): number {
  const activeDays = Object.keys(activities)
    .filter(d => activities[d].level > 0)
    .sort();

  if (activeDays.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < activeDays.length; i++) {
    const prev = new Date(activeDays[i - 1]);
    const curr = new Date(activeDays[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Build the calendar grid for a given month.
 * Returns an array of date-strings (YYYY-MM-DD) padded with null for empty cells.
 */
function buildMonthGrid(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();

  const grid: (string | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    grid.push(dateStr);
  }
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LEVEL_CLASSES: Record<number, string> = {
  0: 'bg-white/5 dark:bg-white/5 border border-white/10',
  1: 'bg-emerald-900/70 border border-emerald-700/30',
  2: 'bg-emerald-600/70 border border-emerald-500/30',
  3: 'bg-emerald-400 border border-emerald-300/30',
};

const LEVEL_LABELS: { level: 0 | 1 | 2 | 3; label: string }[] = [
  { level: 0, label: 'No activity' },
  { level: 1, label: 'Low (< 50 XP)' },
  { level: 2, label: 'Medium (50-99 XP)' },
  { level: 3, label: 'High (100+ XP)' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ---------------------------------------------------------------------------
// Tooltip component
// ---------------------------------------------------------------------------
interface TooltipData {
  activity: DailyActivity | null;
  dateStr: string;
  x: number;
  y: number;
}

const ActivityTooltip: React.FC<{ data: TooltipData }> = ({ data }) => {
  const { activity, dateStr, x, y } = data;
  const date = new Date(dateStr + 'T00:00:00');
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const statusText =
    !activity || activity.level === 0
      ? 'No learning activity'
      : activity.level === 1
        ? 'Light learning day'
        : activity.level === 2
          ? 'Productive learning day'
          : 'Highly productive day';

  return (
    <div
      role="tooltip"
      className="fixed z-50 pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div className="bg-background border border-white/20 rounded-xl px-3 py-2.5 shadow-2xl shadow-black/50 text-xs min-w-[170px] -translate-x-1/2 -translate-y-full -mt-2">
        <p className="font-bold text-textMain mb-1">{formattedDate}</p>
        <p className="text-textMuted mb-1">{statusText}</p>
        {activity && activity.level > 0 && (
          <>
            <p className="text-amber-400 font-semibold">+{activity.xp} XP</p>
            <p className="text-textMuted">
              {activity.courses.length} course{activity.courses.length !== 1 ? 's' : ''} completed
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export const LearningStreakTab: React.FC<LearningStreakTabProps> = ({ user }) => {
  const nowDate = new Date();
  const todayStr = getLocalDateString(nowDate);
  const allProgress = useMemo(() => storageService.getAllProgress(), []);

  // Month navigation state — initialise to current month
  const [viewYear, setViewYear] = useState(nowDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(nowDate.getMonth());

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Streak data — seeded from existing progress on first render
  const [streakData, setStreakData] = useState<StreakData>(() => {
    const stored = storageService.getStreakData();
    return seedActivitiesFromProgress(stored, storageService.getAllProgress());
  });

  // On mount: persist seeded data + update longest streak
  useEffect(() => {
    const refreshed = seedActivitiesFromProgress(storageService.getStreakData(), allProgress);
    const longest = Math.max(calcLongestStreak(refreshed.activities), refreshed.longestStreak);
    refreshed.longestStreak = longest;
    storageService.saveStreakData(refreshed);
    setStreakData(refreshed);
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProgress]);

  // Derived values
  function calcCurrentStreak(activities: Record<string, DailyActivity>, todayStr: string): number {
    let count = 0;
    let cursor = new Date(todayStr + 'T00:00:00');
    while (true) {
      const dateStr = getLocalDateString(cursor);
      const activity = activities[dateStr];
      if (activity && activity.level > 0) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }

  const currentStreak = useMemo(
    () => calcCurrentStreak(streakData.activities, todayStr),
    [streakData.activities, todayStr],
  );

  const longestStreak = useMemo(
    () => Math.max(calcLongestStreak(streakData.activities), streakData.longestStreak),
    [streakData],
  );

  // Calendar grid
  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const isNextDisabled =
    viewYear > nowDate.getFullYear() ||
    (viewYear === nowDate.getFullYear() && viewMonth >= nowDate.getMonth());

  const goToPrevMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    if (isNextDisabled) return;
    setViewMonth(m => {
      if (m === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, [isNextDisabled]);

  // Tooltip event handlers
  const handleCellMouseEnter = useCallback(
    (e: React.MouseEvent, dateStr: string) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltip({
        activity: streakData.activities[dateStr] ?? null,
        dateStr,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    [streakData.activities],
  );

  const handleCellMouseLeave = useCallback(() => setTooltip(null), []);

  const handleCellFocus = useCallback(
    (e: React.FocusEvent, dateStr: string) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltip({
        activity: streakData.activities[dateStr] ?? null,
        dateStr,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    [streakData.activities],
  );

  const handleCellBlur = useCallback(() => setTooltip(null), []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section header */}
      <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
        <CalendarDays className="text-primaryLight" />
        Learning Streak
      </h2>

      {/* Analytics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Current Streak */}
        <div className="flex items-center gap-4 p-5 bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Flame size={24} className="text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-textMuted uppercase tracking-wider">Current Streak</p>
            <p className="text-3xl font-extrabold text-textMain leading-none mt-1">
              {currentStreak}
              <span className="text-base font-semibold text-textMuted ml-1">
                {currentStreak === 1 ? 'day' : 'days'}
              </span>
            </p>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center gap-4 p-5 bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Trophy size={24} className="text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-textMuted uppercase tracking-wider">Longest Streak</p>
            <p className="text-3xl font-extrabold text-textMain leading-none mt-1">
              {longestStreak}
              <span className="text-base font-semibold text-textMuted ml-1">
                {longestStreak === 1 ? 'day' : 'days'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Calendar heatmap */}
      <div className="bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-2xl p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={goToPrevMonth}
            aria-label="Go to previous month"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-textMuted hover:text-textMain transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            <ChevronLeft size={16} />
          </button>

          <h3 className="font-bold text-textMain text-base" aria-live="polite">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>

          <button
            onClick={goToNextMonth}
            disabled={isNextDisabled}
            aria-label="Go to next month"
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight
              ${isNextDisabled
                ? 'bg-white/5 border-white/5 text-textMuted/30 cursor-not-allowed'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-textMuted hover:text-textMain'
              }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Scrollable on small screens */}
        <div className="overflow-x-auto">
          <div className="min-w-[380px]">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1" role="row">
              {WEEKDAYS.map(day => (
                <div
                  key={day}
                  className="text-center text-[10px] font-semibold text-textMuted uppercase tracking-wider py-1"
                  aria-label={day}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div
              className="grid grid-cols-7 gap-1"
              role="grid"
              aria-label={`Activity calendar for ${MONTH_NAMES[viewMonth]} ${viewYear}`}
            >
              {grid.map((dateStr, idx) => {
                if (!dateStr) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      role="presentation"
                      aria-hidden="true"
                      className="aspect-square rounded-md"
                    />
                  );
                }

                const activity = streakData.activities[dateStr];
                const level = activity?.level ?? 0;
                const isFuture = dateStr > todayStr;
                const isToday = dateStr === todayStr;
                const dayNum = parseInt(dateStr.split('-')[2], 10);

                return (
                  <div
                    key={dateStr}
                    role="gridcell"
                    tabIndex={isFuture ? -1 : 0}
                    aria-label={
                      isFuture
                        ? `${dateStr}: future date`
                        : `${dateStr}${activity && activity.level > 0 ? `: ${activity.xp} XP, ${activity.courses.length} courses completed` : ': no activity'}`
                    }
                    onMouseEnter={e => !isFuture && handleCellMouseEnter(e, dateStr)}
                    onMouseLeave={handleCellMouseLeave}
                    onFocus={e => !isFuture && handleCellFocus(e, dateStr)}
                    onBlur={handleCellBlur}
                    className={[
                      'aspect-square rounded-md flex items-center justify-center',
                      'text-[10px] font-semibold transition-all duration-150 cursor-default select-none',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-1',
                      isFuture
                        ? 'opacity-20 bg-white/5 border border-white/10'
                        : LEVEL_CLASSES[level],
                      isToday ? 'ring-2 ring-primaryLight ring-offset-1 ring-offset-transparent' : '',
                    ].join(' ')}
                  >
                    <span
                      className={
                        isFuture
                          ? 'text-textMuted/30'
                          : level > 0
                            ? 'text-white/90'
                            : 'text-textMuted/50'
                      }
                    >
                      {dayNum}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 pt-4 border-t border-black/10 dark:border-white/10">
          <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
            Activity:
          </span>
          {LEVEL_LABELS.map(({ level, label }) => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className={`w-4 h-4 rounded-sm ${LEVEL_CLASSES[level]}`}
                aria-hidden="true"
              />
              <span className="text-xs text-textMuted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip rendered outside calendar to avoid overflow clipping */}
      {tooltip && <ActivityTooltip data={tooltip} />}
    </div>
  );
};

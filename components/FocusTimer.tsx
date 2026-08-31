import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, RotateCcw, SkipForward, Coffee, Sparkles, ChevronUp, ChevronDown, Timer } from 'lucide-react';
import { useFocusTimer, formatPomodoroTime } from '../hooks/useFocusTimer';

export const FocusTimer: React.FC = () => {
  const { t } = useTranslation();
  const {
    phase,
    timeLeft,
    totalDuration,
    isRunning,
    start,
    pause,
    resume,
    reset,
    skipPhase,
  } = useFocusTimer();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const formattedTime = formatPomodoroTime(timeLeft);
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  const isFocus = phase === 'focus';
  const isStarted = timeLeft < totalDuration || isRunning;

  const handlePlayPause = () => {
    if (isRunning) {
      pause();
    } else if (isStarted) {
      resume();
    } else {
      start();
    }
  };

  return (
    <div
      role="region"
      aria-label="Pomodoro Focus Timer"
      className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-300 mb-6"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl text-white transition-colors ${
              isFocus
                ? 'bg-gradient-to-br from-primary to-secondary'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
            }`}
          >
            {isFocus ? <Timer size={18} aria-hidden="true" /> : <Coffee size={18} aria-hidden="true" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-textMuted">
                {t('courseView.pomodoro.title', 'Pomodoro Focus Timer')}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isFocus
                    ? 'bg-primary/10 border-primary/30 text-primaryLight'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {isFocus
                  ? t('courseView.pomodoro.focusPhase', 'Focus Session')
                  : t('courseView.pomodoro.breakPhase', 'Short Break')}
              </span>
            </div>
            <p className="text-xs text-textMuted hidden sm:block">
              {isFocus
                ? t('courseView.pomodoro.focusDesc', '25 min focused study interval')
                : t('courseView.pomodoro.breakDesc', '5 min rest to recharge')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Time Display when Collapsed */}
          {isCollapsed && (
            <div
              role="timer"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`${phase} timer: ${formattedTime}`}
              className="text-lg font-mono font-bold text-textMain px-3 py-1 rounded-lg bg-black/5 dark:bg-white/10"
            >
              {formattedTime}
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-textMuted hover:text-textMain hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
            aria-label={
              isCollapsed
                ? t('courseView.pomodoro.expand', 'Expand timer')
                : t('courseView.pomodoro.collapse', 'Collapse timer')
            }
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Timer Controls & Progress */}
      {!isCollapsed && (
        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Countdown Display & Progress Bar */}
            <div className="flex-1">
              <div className="flex items-baseline justify-between mb-2">
                <div
                  role="timer"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={`${isFocus ? 'Focus' : 'Break'} time remaining: ${formattedTime}`}
                  className="text-3xl sm:text-4xl font-mono font-bold text-textMain tracking-tight"
                >
                  {formattedTime}
                </div>
                <span className="text-xs text-textMuted font-medium">
                  {isRunning
                    ? isFocus
                      ? t('courseView.pomodoro.statusFocusing', 'Focusing...')
                      : t('courseView.pomodoro.statusResting', 'On Break...')
                    : isStarted
                    ? t('courseView.pomodoro.statusPaused', 'Paused')
                    : t('courseView.pomodoro.statusReady', 'Ready')}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isFocus
                      ? 'bg-gradient-to-r from-primary to-secondary'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={handlePlayPause}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 ${
                  isFocus
                    ? 'bg-gradient-main hover:shadow-primary/25'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25'
                }`}
                aria-label={
                  isRunning
                    ? t('courseView.pomodoro.pause', 'Pause Timer')
                    : isStarted
                    ? t('courseView.pomodoro.resume', 'Resume Timer')
                    : t('courseView.pomodoro.start', 'Start Timer')
                }
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>
                  {isRunning
                    ? t('courseView.pomodoro.pause', 'Pause')
                    : isStarted
                    ? t('courseView.pomodoro.resume', 'Resume')
                    : t('courseView.pomodoro.start', 'Start Focus')}
                </span>
              </button>

              <button
                onClick={reset}
                className="p-2.5 rounded-xl text-textMuted hover:text-textMain bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
                aria-label={t('courseView.pomodoro.reset', 'Reset Timer')}
                title={t('courseView.pomodoro.reset', 'Reset Timer')}
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={skipPhase}
                className="p-2.5 rounded-xl text-textMuted hover:text-textMain bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
                aria-label={
                  isFocus
                    ? t('courseView.pomodoro.skipToBreak', 'Skip to Break')
                    : t('courseView.pomodoro.skipToFocus', 'Skip to Focus')
                }
                title={
                  isFocus
                    ? t('courseView.pomodoro.skipToBreak', 'Skip to Break')
                    : t('courseView.pomodoro.skipToFocus', 'Skip to Focus')
                }
              >
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

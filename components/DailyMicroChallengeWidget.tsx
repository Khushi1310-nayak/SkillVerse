import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Zap, CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { User } from '../types';
import { storageService, getLocalDateString } from '../services/storageService';
import { getDailyMicroChallenge } from '../utils/microChallengeRepository';
import { soundManager } from '../utils/soundManager';
import { useToast } from '../contexts/ToastContext';

interface DailyMicroChallengeWidgetProps {
  user: User;
  onActivityComplete?: () => void;
}

export const DailyMicroChallengeWidget: React.FC<DailyMicroChallengeWidgetProps> = ({
  user,
  onActivityComplete,
}) => {
  const { showToast } = useToast();
  const todayStr = useMemo(() => getLocalDateString(), []);
  const challenge = useMemo(() => getDailyMicroChallenge(), []);

  // State initialized from local storage
  const [storedState, setStoredState] = useState(() =>
    storageService.getMicroChallengeState(todayStr)
  );

  const [selectedOption, setSelectedOption] = useState<number | null>(
    storedState?.selectedAnswer ?? null
  );
  const [submitting, setSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(!!storedState);
  const [isCorrect, setIsCorrect] = useState<boolean>(storedState?.isCorrect ?? false);

  // Keep state synced if storage changes
  useEffect(() => {
    const current = storageService.getMicroChallengeState(todayStr);
    setStoredState(current);
    if (current) {
      setSelectedOption(current.selectedAnswer);
      setIsCorrect(current.isCorrect);
      setShowFeedback(true);
    }
  }, [todayStr]);

  const isCompleted = storedState?.completed && storedState?.rewardClaimed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null || submitting || isCompleted) return;

    setSubmitting(true);
    try {
      const result = await storageService.completeMicroChallenge(challenge, selectedOption);
      setIsCorrect(result.isCorrect);
      setShowFeedback(true);

      const updated = storageService.getMicroChallengeState(todayStr);
      setStoredState(updated);

      if (result.isCorrect) {
        if (user.settings?.soundEffects !== false) {
          soundManager.playFanfare();
        }
        showToast({
          message: `Streak Saved! +${challenge.xpReward} XP earned for completing today's challenge!`,
          type: 'success',
        });
        if (onActivityComplete) {
          onActivityComplete();
        }
      }
    } catch (err) {
      console.error('Error submitting micro-challenge:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  return (
    <div
      id="daily-micro-challenge-widget"
      className="relative overflow-hidden bg-glass border border-orange-500/30 rounded-3xl p-5 sm:p-7 shadow-xl shadow-orange-500/5 transition-all duration-300"
    >
      {/* Background Decorative Glows */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20 text-white shrink-0">
              <Flame size={22} className="animate-pulse-slow fill-white/80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-display font-bold text-textMain">
                  Daily Micro-Challenge
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/15 text-orange-500 border border-orange-500/30">
                  <Zap size={12} className="fill-orange-500" />
                  Streak Saver
                </span>
              </div>
              <p className="text-xs text-textMuted">
                Complete today&apos;s quick 1-minute question to maintain your daily streak
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primaryLight border border-primary/20">
              {challenge.topic}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
              <Sparkles size={13} />
              +{challenge.xpReward} XP
            </span>
          </div>
        </div>

        {/* Question Header & Body */}
        <div className="space-y-3 pt-1">
          <p className="text-sm sm:text-base font-semibold text-textMain leading-relaxed">
            {challenge.question}
          </p>

          {/* Optional Code Snippet Block */}
          {challenge.codeSnippet && (
            <div className="rounded-xl overflow-hidden border border-black/15 dark:border-white/15 bg-[#0d1117] text-gray-100 font-mono text-xs sm:text-sm p-4 shadow-inner">
              <pre className="overflow-x-auto whitespace-pre leading-relaxed">
                <code>{challenge.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Options Grid */}
          <form onSubmit={handleSubmit} className="space-y-2.5 mt-3">
            <div className="grid grid-cols-1 gap-2.5">
              {challenge.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = challenge.correctAnswer === idx;

                let optionStyle =
                  'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-textMain hover:bg-black/10 dark:hover:bg-white/10';

                if (showFeedback) {
                  if (isCorrectOption) {
                    optionStyle =
                      'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-medium shadow-sm shadow-emerald-500/10';
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      'bg-rose-500/20 border-rose-500 text-rose-400 font-medium';
                  } else {
                    optionStyle = 'opacity-50 border-transparent text-textMuted';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-primary/20 border-primaryLight text-primaryLight font-medium shadow-sm shadow-primary/10';
                }

                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm ${optionStyle} ${
                      isCompleted ? 'cursor-default pointer-events-none' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="micro-challenge-option"
                      value={idx}
                      checked={isSelected}
                      disabled={isCompleted || showFeedback}
                      onChange={() => setSelectedOption(idx)}
                      className="sr-only"
                    />
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        showFeedback && isCorrectOption
                          ? 'bg-emerald-500 text-white'
                          : showFeedback && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-primaryLight text-white'
                          : 'bg-black/10 dark:bg-white/10 text-textMuted'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 leading-snug">{option}</span>
                    {showFeedback && isCorrectOption && (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle size={18} className="text-rose-400 shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Explanation & Action Footer */}
            {showFeedback && (
              <div
                className={`mt-4 p-4 rounded-2xl border transition-all animate-fade-in ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {isCorrect ? (
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <HelpCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-bold text-textMain">
                      {isCorrect ? '🎉 Correct Answer! Streak Saved!' : 'Not quite right'}
                    </p>
                    <p className="text-textMuted leading-relaxed">
                      {challenge.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit / Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-textMuted flex items-center gap-1.5">
                {isCompleted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Streak protected for {todayStr}
                  </span>
                ) : (
                  <span>Select the best answer and submit</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {showFeedback && !isCorrect && !isCompleted && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-textMain bg-white/10 hover:bg-white/20 transition-all border border-black/10 dark:border-white/10 active:scale-95"
                  >
                    <RotateCcw size={14} />
                    Try Again
                  </button>
                )}

                {!isCompleted && !showFeedback && (
                  <button
                    type="submit"
                    disabled={selectedOption === null || submitting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
                  >
                    <span>{submitting ? 'Checking...' : 'Check Answer'}</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                {isCompleted && (
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    Completed Today
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

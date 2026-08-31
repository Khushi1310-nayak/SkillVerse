import React from 'react';
import { Gauge, Pause, Play, SkipBack, SkipForward } from 'lucide-react';

interface VisualizerToolbarProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (value: number) => void;
  disabled?: boolean;
}

export const VisualizerToolbar: React.FC<VisualizerToolbarProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  disabled = false,
}) => {
  const safeTotal = Math.max(totalSteps, 1);
  const stepLabel = totalSteps === 0 ? '0 / 0' : `${currentStep + 1} / ${safeTotal}`;

  return (
    <div className="flex flex-col gap-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onStepBackward}
            disabled={disabled || currentStep <= 0}
            className="flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-2.5 py-2 text-textMuted transition hover:text-textMain disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5"
            aria-label="Step backward"
            title="Step backward"
          >
            <SkipBack size={16} />
          </button>

          {isPlaying ? (
            <button
              type="button"
              onClick={onPause}
              disabled={disabled}
              className="flex items-center justify-center rounded-xl bg-gradient-main px-3 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Pause playback"
              title="Pause"
            >
              <Pause size={16} className="mr-2" />
              Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={onPlay}
              disabled={disabled || totalSteps === 0}
              className="flex items-center justify-center rounded-xl bg-gradient-main px-3 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Play playback"
              title="Play"
            >
              <Play size={16} className="mr-2 fill-current" />
              Play
            </button>
          )}

          <button
            type="button"
            onClick={onStepForward}
            disabled={disabled || currentStep >= totalSteps - 1 || totalSteps === 0}
            className="flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-2.5 py-2 text-textMuted transition hover:text-textMain disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5"
            aria-label="Step forward"
            title="Step forward"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-textMuted">
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-1 text-primaryLight">
            <Gauge size={12} />
            {speed.toFixed(1)}x
          </span>
          <span className="rounded-full border border-black/10 bg-white/60 px-2 py-1 dark:border-white/10 dark:bg-white/5">
            {stepLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="visualizer-speed" className="text-[10px] font-bold uppercase tracking-[0.18em] text-textMuted">
          Speed
        </label>
        <input
          id="visualizer-speed"
          type="range"
          min={0.5}
          max={2.5}
          step={0.5}
          value={speed}
          disabled={disabled || totalSteps === 0}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="h-2 w-full max-w-xs accent-primaryLight disabled:opacity-40"
          aria-label="Visualizer playback speed"
        />
      </div>
    </div>
  );
};

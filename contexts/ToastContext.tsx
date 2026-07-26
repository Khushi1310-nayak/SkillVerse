import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ShowToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (options: ShowToastOptions | string) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const DEFAULT_DURATION = 4000;

// How the toast is styled per-type. Kept in one place so every toast in the
// app (success/error/info, no matter which component fired it) looks and
// behaves identically — this is what SignupForm's Framer Motion styling and
// Settings' absolutely-positioned banner used to do independently, and
// differently, from each other.
const TOAST_CONFIG: Record<ToastType, { icon: typeof CheckCircle; accent: string; ring: string; bar: string }> = {
  success: { icon: CheckCircle, accent: 'text-success', ring: 'border-success/30', bar: 'bg-success' },
  error: { icon: AlertTriangle, accent: 'text-red-400', ring: 'border-red-500/30', bar: 'bg-red-500' },
  info: { icon: Info, accent: 'text-primaryLight', ring: 'border-primary/30', bar: 'bg-primaryLight' },
};

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Every pending auto-dismiss timeout, keyed by toast id, plus enough
  // bookkeeping (start time + remaining ms) to support pause-on-hover
  // without ever losing track of a handle. Refs (not state) because timers
  // are an imperative concern that shouldn't trigger re-renders on their own.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const timerMeta = useRef<Map<string, { start: number; remaining: number }>>(new Map());

  const clearTimer = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    clearTimer(id);
    timerMeta.current.delete(id);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, [clearTimer]);

  const scheduleDismiss = useCallback((id: string, ms: number) => {
    clearTimer(id);
    timerMeta.current.set(id, { start: Date.now(), remaining: ms });
    const timer = setTimeout(() => dismissToast(id), ms);
    timers.current.set(id, timer);
  }, [clearTimer, dismissToast]);

  const pauseToast = useCallback((id: string) => {
    const meta = timerMeta.current.get(id);
    if (!meta || !timers.current.has(id)) return;
    const elapsed = Date.now() - meta.start;
    const remaining = Math.max(meta.remaining - elapsed, 0);
    clearTimer(id);
    timerMeta.current.set(id, { start: Date.now(), remaining });
  }, [clearTimer]);

  const resumeToast = useCallback((id: string) => {
    const meta = timerMeta.current.get(id);
    if (!meta) return;
    scheduleDismiss(id, meta.remaining);
  }, [scheduleDismiss]);

  const showToast = useCallback((options: ShowToastOptions | string) => {
    const opts: ShowToastOptions = typeof options === 'string' ? { message: options } : options;
    const id = generateId();
    const duration = opts.duration ?? DEFAULT_DURATION;

    setToasts(prev => [...prev, { id, message: opts.message, type: opts.type ?? 'info', duration }]);
    scheduleDismiss(id, duration);

    return id;
  }, [scheduleDismiss]);

  // Guard against orphaned timers if the provider itself ever unmounts
  // (e.g. hot-reload during development) — this is the class of leak the
  // old per-component `setTimeout` calls were prone to.
  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach(clearTimeout);
      timersMap.clear();
      timerMeta.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} onPause={pauseToast} onResume={resumeToast} />
    </ToastContext.Provider>
  );
};

const ToastViewport: React.FC<{
  toasts: Toast[];
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}> = ({ toasts, onDismiss, onPause, onResume }) => {
  if (typeof document === 'undefined') return null;

  return (
    <div
      className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-4 z-[100] flex flex-col items-stretch sm:items-end gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} onPause={onPause} onResume={onResume} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{
  toast: Toast;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}> = ({ toast, onDismiss, onPause, onResume }) => {
  const [paused, setPaused] = useState(false);
  const config = TOAST_CONFIG[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      role="status"
      aria-atomic="true"
      onMouseEnter={() => { setPaused(true); onPause(toast.id); }}
      onMouseLeave={() => { setPaused(false); onResume(toast.id); }}
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: toast.type === 'error' ? [0, -6, 6, -6, 6, 0] : 0 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{
        default: { type: 'spring', stiffness: 400, damping: 30 },
        x: { duration: 0.4, ease: 'easeInOut' },
      }}
      className={`pointer-events-auto relative w-full sm:w-96 overflow-hidden flex items-start gap-3 p-4 pr-9 rounded-2xl bg-glass backdrop-blur-xl border ${config.ring} shadow-lg shadow-black/10`}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${config.accent}`} />
      <p className="text-sm font-medium text-textMain leading-snug break-words">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="absolute top-3 right-3 text-textMuted hover:text-textMain transition-colors focus:outline-none"
      >
        <X size={14} />
      </button>
      <div
        className={`absolute bottom-0 left-0 h-0.5 w-full ${config.bar} toast-progress`}
        style={{
          animationDuration: `${toast.duration}ms`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      />
    </motion.div>
  );
};

// Keyframes for the auto-dismiss progress bar. `animation-play-state` lets
// hover pause/resume it in place with zero extra JS bookkeeping.
if (typeof document !== 'undefined' && !document.getElementById('toast-progress-keyframes')) {
  const style = document.createElement('style');
  style.id = 'toast-progress-keyframes';
  style.textContent = `
    @keyframes toastProgressShrink {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
    .toast-progress {
      transform-origin: left;
      animation-name: toastProgressShrink;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
    }
  `;
  document.head.appendChild(style);
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
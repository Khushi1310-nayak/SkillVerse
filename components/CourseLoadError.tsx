import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WifiOff, RefreshCcw, ArrowLeft } from 'lucide-react';

interface CourseLoadErrorProps {
  onRetry: () => void;
}

/**
 * Shown when the course fetch failed outright (offline, permissions) and there
 * is no bundled fallback to fall back on.
 *
 * This is deliberately distinct from the not-found state: previously a network
 * failure and a missing course rendered identically, which told the user their
 * course did not exist when in fact the request never completed.
 */
export const CourseLoadError: React.FC<CourseLoadErrorProps> = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
        <WifiOff size={28} />
      </div>

      <h1 className="text-2xl font-display font-bold text-textMain mb-2">
        {t('courseView.loadError.title')}
      </h1>
      <p className="text-textMuted max-w-md mb-8">{t('courseView.loadError.body')}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center justify-center gap-2 bg-gradient-main text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <RefreshCcw size={18} /> {t('courseView.loadError.retry')}
        </button>

        <Link
          to="/courses"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 text-textMain font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft size={18} /> {t('courseView.loadError.backToCourses')}
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t, i18n } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      title={t('settings.appearance.language')}
      aria-label={t('settings.appearance.language')}
      className={`bg-white/10 dark:bg-black/30 border border-black/20 dark:border-white/15 rounded-2xl px-4 py-2 text-xs md:text-sm font-semibold text-textMain focus:outline-none focus:border-primaryLight focus:ring-2 focus:ring-primaryLight/30 backdrop-blur-md shadow-md cursor-pointer transition-all duration-300 hover:border-primaryLight/50 ${className}`}
    >
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code} className="bg-white dark:bg-[#0B1220] text-gray-900 dark:text-white py-1">
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
};
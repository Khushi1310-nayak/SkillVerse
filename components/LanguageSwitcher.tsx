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
      className={`bg-white/5 border border-black/20 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-textMain focus:outline-none focus:border-primaryLight transition-colors ${className}`}
    >
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code} className="bg-white text-gray-900">
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
};
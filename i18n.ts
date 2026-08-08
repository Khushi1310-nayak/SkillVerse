import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

export const RTL_LANGUAGES = ['ar'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
    debug: false,
    backend: undefined, // not using i18next-http-backend; we load resources directly below
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'skillverse_language',
    },
    resources: {}, // populated below via loadLanguageResources
  });

// Dynamically fetch and register each language's translation file from /public/locales.
// Since these are static JSON files served from /public, we fetch them at runtime
// rather than bundling all 12 into the JS bundle.
export const loadLanguageResources = async () => {
  const loadPromises = SUPPORTED_LANGUAGES.map(async ({ code }) => {
    try {
      const res = await fetch(`/locales/${code}/translation.json`);
      const data = await res.json();
      i18n.addResourceBundle(code, 'translation', data, true, true);
    } catch (err) {
      console.error(`Failed to load translations for ${code}:`, err);
    }
  });
  await Promise.all(loadPromises);
};

// Apply document direction (LTR/RTL) whenever the language changes.
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = RTL_LANGUAGES.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// On initial load/refresh, i18next's LanguageDetector sets the language
// synchronously during .init(), firing 'languageChanged' before the .on()
// listener above is registered. We therefore apply dir/lang imperatively
// here so that Arabic (and any future RTL language) is correctly reflected
// on the very first render — not just after a runtime language switch.
const initialLang = i18n.language || 'en';
document.documentElement.dir = RTL_LANGUAGES.includes(initialLang) ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

export default i18n;
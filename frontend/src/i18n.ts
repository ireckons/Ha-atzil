import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import heTranslation from './locales/he/translation.json';
import enTranslation from './locales/en/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            he: { translation: heTranslation },
            en: { translation: enTranslation }
        },
        fallbackLng: 'he', // default to hebrew
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        detection: {
            order: ['localStorage'],
            caches: ['localStorage']
        }
    });

// Explicitly set the HTML dir and lang tags based on the starting language
const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
document.documentElement.dir = dir;
document.documentElement.lang = i18n.language;

i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationDE from './locales/de.json';
import translationZH from './locales/zh.json';
import translationHI from './locales/hi.json';
import translationAR from './locales/ar.json';
import translationFA from './locales/fa.json';

const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  },
  zh: {
    translation: translationZH
  },
  hi: {
    translation: translationHI
  },
  ar: {
    translation: translationAR
  },
  fa: {
    translation: translationFA
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    supportedLngs: ['en', 'fr', 'de', 'zh', 'hi', 'ar', 'fa'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
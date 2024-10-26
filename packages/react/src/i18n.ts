import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import zhCN from '@/locales/zh_CN.json';
export const fallbackLanguage = 'en';

export const defaultNS = 'translation';
export const resources = {
  en: {
    translation: en,
  },
  zhCN: {
    translation: zhCN,
  },
} as const;

export type ILanguage = keyof typeof resources;

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: fallbackLanguage,
  defaultNS,
  ns: [defaultNS],
  resources,
});

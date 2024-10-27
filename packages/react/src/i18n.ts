import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/lang/en.json';
import zhCN from '@/locales/lang/zh_CN.json';
import links_en from '@/locales/links/en.json';
import links_zhCN from '@/locales/links/zhCN.json';
export const fallbackLanguage = 'en';

export const defaultNS = 'translation';
export const resources = {
  en: {
    translation: en,
    links: links_en,
  },
  zhCN: {
    translation: zhCN,
    links: links_zhCN,
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

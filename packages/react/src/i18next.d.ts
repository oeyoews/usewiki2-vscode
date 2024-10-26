import 'i18next';
import { resources, defaultNS } from './i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['en'];
    defaultNS: typeof defaultNS;
  }
}

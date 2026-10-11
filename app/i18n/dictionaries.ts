import 'server-only';

import { fallbackLocale, isLocale } from '@/app/i18n/settings';

const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  hu: () => import('./locales/hu.json').then((module) => module.default),
  // es: () => import('./locales/es.json').then((module) => module.default),
  // de: () => import('./locales/de.json').then((module) => module.default),
  // fr: () => import('./locales/fr.json').then((module) => module.default),
};

/**
 * The dictionary for a locale. An unsupported one (e.g. a prototype key such
 * as `constructor`, never looked up on the map) gets the fallback locale's.
 */
export const getDictionary = async (locale: string) =>
  dictionaries[isLocale(locale) ? locale : fallbackLocale]();

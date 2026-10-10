import { TLocale } from '@/app/i18n/settings';

/** Dictionary key (under `profile.appearance`) naming each locale. */
export const LANGUAGE_TEXT_KEYS: Record<TLocale, 'english' | 'hungarian'> = {
  en: 'english',
  hu: 'hungarian',
};

/** The same page under another locale: `/en/dashboard/profile` → `/hu/dashboard/profile`. */
export const switchLocalePath = (pathname: string, locale: TLocale) => {
  const [, , ...rest] = pathname.split('/');

  return ['', locale, ...rest].join('/');
};

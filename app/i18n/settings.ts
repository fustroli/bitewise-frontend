export const locales: TLocale[] = ['en', 'hu']; // 'es', 'de', 'fr'];
export const defaultLocale: TLocale = 'en';
export const fallbackLocale: TLocale = 'en';

export type TLocale = 'en' | 'hu'; // | 'es' | 'de' | 'fr';

/** Whether a value (e.g. the `[lang]` segment) is a supported locale. */
export const isLocale = (value: string): value is TLocale =>
  (locales as string[]).includes(value);

import { TLocale, defaultLocale, locales } from '@/app/i18n/settings';

import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

/** The best supported locale for a request's (or a page's) headers. */
export function getLocale(request: {
  headers: { get(name: string): string | null };
}): TLocale {
  const headers = {
    'accept-language': request.headers.get('accept-language') || '',
  };

  const languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale) as TLocale;
}

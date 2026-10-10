import { TLocale, locales } from '@/app/i18n/settings';

export type TRouteDecision =
  { type: 'continue' } | { type: 'redirect'; url: string };

interface IRouteInput {
  pathname: string;
  hasToken: boolean;
  preferredLocale: TLocale;
}

const CONTINUE: TRouteDecision = { type: 'continue' };
const redirectTo = (url: string): TRouteDecision => ({ type: 'redirect', url });

const isUnder = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

const isDashboardPath = (pathname: string) =>
  isUnder(pathname, '/dashboard') ||
  locales.some((locale) => isUnder(pathname, `/${locale}/dashboard`));

/**
 * What the proxy does with a request. Rules apply in order:
 * 1. a dashboard path (with or without locale) and no token → sign-in page;
 * 2. `/` with a token → the dashboard;
 * 3. `/dashboard…` without a locale → the same path under the locale;
 * 4. anything else → continue.
 */
export const decideRoute = ({
  pathname,
  hasToken,
  preferredLocale,
}: IRouteInput): TRouteDecision => {
  if (isDashboardPath(pathname) && !hasToken) return redirectTo('/');

  if (pathname === '/' && hasToken) {
    return redirectTo(`/${preferredLocale}/dashboard`);
  }

  if (isUnder(pathname, '/dashboard')) {
    return redirectTo(`/${preferredLocale}${pathname}`);
  }

  return CONTINUE;
};

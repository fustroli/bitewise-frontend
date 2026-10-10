import { describe, expect, it } from 'vitest';

import { decideRoute } from '@/app/session/routing';

describe('routing decision', () => {
  it.each([
    // [pathname, hasToken, preferredLocale, expected redirect or null]
    ['/en/dashboard', false, 'en', '/'],
    ['/hu/dashboard/meals', false, 'en', '/'],
    ['/dashboard', false, 'hu', '/'],
    ['/dashboard/meals', false, 'en', '/'],
    ['/', true, 'hu', '/hu/dashboard'],
    ['/', false, 'en', null],
    ['/dashboard', true, 'en', '/en/dashboard'],
    ['/dashboard/meals', true, 'hu', '/hu/dashboard/meals'],
    ['/en/dashboard', true, 'hu', null],
    ['/hu/dashboard/profile', true, 'en', null],
    ['/hu', false, 'en', null],
    ['/hu', true, 'en', null],
    ['/signout', false, 'en', null],
    ['/signout', true, 'en', null],
    ['/dashboards', false, 'en', null],
  ] as const)(
    '%s, token: %s, locale: %s → %s',
    (pathname, hasToken, preferredLocale, expected) => {
      expect(decideRoute({ pathname, hasToken, preferredLocale })).toEqual(
        expected === null
          ? { type: 'continue' }
          : { type: 'redirect', url: expected },
      );
    },
  );
});

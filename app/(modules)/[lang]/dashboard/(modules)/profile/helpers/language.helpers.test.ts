import { describe, expect, it } from 'vitest';

import { switchLocalePath } from './language.helpers';

describe('switchLocalePath', () => {
  it.each([
    ['/en/dashboard/profile', 'hu', '/hu/dashboard/profile'],
    ['/hu/dashboard/profile', 'en', '/en/dashboard/profile'],
    ['/en/dashboard/profile', 'en', '/en/dashboard/profile'],
    ['/en', 'hu', '/hu'],
  ] as const)('%s → %s gives %s', (pathname, locale, expected) => {
    expect(switchLocalePath(pathname, locale)).toBe(expected);
  });
});

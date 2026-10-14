import { describe, expect, it } from 'vitest';

import { isNavItemActive } from '@/app/(modules)/[lang]/dashboard/components/AppNav/nav.helpers';

describe('isNavItemActive', () => {
  it('marks the dashboard only on the dashboard', () => {
    expect(isNavItemActive('/en/dashboard', '/en/dashboard', '')).toBe(true);
    expect(isNavItemActive('/en/dashboard/meals', '/en/dashboard', '')).toBe(
      false,
    );
  });

  it('marks a section on its sub-pages', () => {
    const href = '/en/dashboard/meals';

    expect(isNavItemActive(href, href, '/meals')).toBe(true);
    expect(isNavItemActive(`${href}/3`, href, '/meals')).toBe(true);
    expect(isNavItemActive('/en/dashboard/meal-plans', href, '/meals')).toBe(
      false,
    );
  });
});

import { describe, expect, it, vi } from 'vitest';

import { getDictionary } from '@/app/i18n/dictionaries';
import { isLocale } from '@/app/i18n/settings';

const PROTOTYPE_KEYS = [
  'constructor',
  '__proto__',
  'toString',
  'hasOwnProperty',
];

describe('isLocale', () => {
  it.each(['en', 'hu'])('accepts %s', (lang) => {
    expect(isLocale(lang)).toBe(true);
  });

  it.each([...PROTOTYPE_KEYS, 'xx', '', 'EN'])('rejects %j', (lang) => {
    expect(isLocale(lang)).toBe(false);
  });
});

describe('getDictionary', () => {
  it.each([
    ['en', 'Logout'],
    ['hu', 'Kijelentkezés'],
  ])('loads the %s dictionary', async (lang, logout) => {
    const dictionary = await getDictionary(lang);

    expect(dictionary.dashboard.appbar.logout).toBe(logout);
  });

  it.each([...PROTOTYPE_KEYS, 'xx'])(
    'falls back to en for %s without logging it',
    async (lang) => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const dictionary = await getDictionary(lang);

      expect(dictionary.dashboard.appbar.logout).toBe('Logout');
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    },
  );
});

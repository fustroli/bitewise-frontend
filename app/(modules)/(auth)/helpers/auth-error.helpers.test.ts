import { describe, expect, it } from 'vitest';

import { EAuthError } from '@/app/(modules)/(auth)/enum';
import { parseAuthError } from '@/app/(modules)/(auth)/helpers';

describe('parsing the social sign-in error', () => {
  it.each(Object.values(EAuthError))('keeps the known code %s', (code) => {
    expect(parseAuthError(code)).toBe(code);
  });

  it.each([undefined, null, '', 'OAUTH-FAILED', '<script>', ['oauth-failed']])(
    'drops %j',
    (value) => {
      expect(parseAuthError(value)).toBeUndefined();
    },
  );
});

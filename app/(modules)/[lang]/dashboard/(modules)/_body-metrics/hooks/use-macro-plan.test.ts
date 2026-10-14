import { describe, expect, it } from 'vitest';

import { EMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';
import { parseMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/hooks';

describe('parseMacroPlan', () => {
  it('reads a stored plan', () => {
    expect(parseMacroPlan(EMacroPlan.LOW_CARB)).toBe(EMacroPlan.LOW_CARB);
  });

  it.each([null, undefined, '', 'keto'])(
    'falls back to Balanced for %j',
    (raw) => {
      expect(parseMacroPlan(raw)).toBe(EMacroPlan.BALANCED);
    },
  );
});

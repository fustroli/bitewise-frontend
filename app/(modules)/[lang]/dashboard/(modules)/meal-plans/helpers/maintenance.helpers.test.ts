import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import {
  calorieGap,
  maintenanceTargets,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/helpers';
import { describe, expect, it } from 'vitest';

import { EMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';
import { bodyMetrics } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';

/** calculator.net's macro example: 2,615 kcal, Balanced plan. */
const metrics = bodyMetrics({
  bodyStats: {
    sex: ESex.MALE,
    heightCm: 177.8,
    weightKg: 79.3787,
    activityLevel: EActivityLevel.MODERATE,
  },
  dateOfBirth: '2000-01-15T12:00:00.000Z',
  today: new Date(2025, 5, 1),
});

describe('maintenanceTargets', () => {
  it('takes calories from Maintenance and macros from the Balanced plan', () => {
    const targets = maintenanceTargets(metrics)!;

    expect(targets.plan).toBe(EMacroPlan.BALANCED);
    expect(Math.round(targets.calories)).toBe(2615);
    expect(Math.round(targets.protein)).toBe(159);
    expect(Math.round(targets.totalFat)).toBe(74);
    expect(Math.round(targets.totalCarbohydrates)).toBe(349);
    expect(Math.round(targets.sugar)).toBe(70);
    expect(Math.round(targets.saturatedFat)).toBe(30);
  });

  it('follows the picked plan', () => {
    const targets = maintenanceTargets(metrics, EMacroPlan.HIGH_PROTEIN)!;

    expect(targets.plan).toBe(EMacroPlan.HIGH_PROTEIN);
    expect(Math.round(targets.protein)).toBe(223);
    expect(Math.round(targets.calories)).toBe(2615);
  });

  it('is unset while Maintenance can not be computed', () => {
    expect(maintenanceTargets(bodyMetrics({ today: new Date() }))).toBe(
      undefined,
    );
  });
});

describe('calorieGap', () => {
  it.each([
    [2100, 2000, 100, true],
    [2150, 2000, 150, true],
    [1849, 2000, -151, false],
  ])('%d against %d is %d off', (kcal, maintenance, diff, onTarget) => {
    expect(calorieGap(kcal, maintenance)).toEqual({ diff, onTarget });
  });
});

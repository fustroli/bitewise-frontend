import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import { describe, expect, it } from 'vitest';
import {
  formatMaintenanceTarget,
  maintenanceTargets,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/helpers';

import { NUTRITION_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
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

const targets = maintenanceTargets(metrics)!;

describe('maintenanceTargets', () => {
  it('takes calories from Maintenance and macros from the Balanced plan', () => {
    expect(Math.round(targets.calories)).toBe(2615);
    expect(Math.round(targets.protein)).toBe(159);
    expect(Math.round(targets.totalFat)).toBe(74);
    expect(Math.round(targets.totalCarbohydrates)).toBe(349);
    expect(Math.round(targets.sugar)).toBe(70);
    expect(Math.round(targets.saturatedFat)).toBe(30);
  });

  it('is unset while Maintenance can not be computed', () => {
    expect(maintenanceTargets(bodyMetrics({ today: new Date() }))).toBe(
      undefined,
    );
  });
});

describe('formatMaintenanceTarget', () => {
  it('formats each column like the nutrition cells, with caps in brackets', () => {
    expect(
      NUTRITION_COLUMNS.map((column) =>
        formatMaintenanceTarget(targets, column, 'en'),
      ),
    ).toEqual(['2,615 kcal', '159 g', '74 (<30) g', '349 (<70) g', '–']);
  });
});

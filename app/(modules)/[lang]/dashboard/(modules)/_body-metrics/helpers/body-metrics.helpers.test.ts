import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import {
  ageOn,
  bodyMetrics,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';
import { describe, expect, it } from 'vitest';

import { EBmiCategory } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';
import { IBodyStats } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';

const TODAY = new Date(2025, 5, 1);
/** 25 years old on TODAY. */
const DOB_25 = '2000-01-15T12:00:00.000Z';

/** calculator.net's example: BMR 1,720 kcal. */
const MAN: IBodyStats = {
  sex: ESex.MALE,
  heightCm: 180,
  weightKg: 71.5,
  activityLevel: EActivityLevel.MODERATE,
};

const metrics = (bodyStats: Partial<IBodyStats>, dateOfBirth = DOB_25) =>
  bodyMetrics({ bodyStats, dateOfBirth, today: TODAY });

const calories = (bodyStats: Partial<IBodyStats>, dateOfBirth = DOB_25) =>
  metrics(bodyStats, dateOfBirth).calories!;

describe('Maintenance calories and Calorie targets', () => {
  it('reproduces calculator.net within 1 kcal', () => {
    const result = calories(MAN);

    expect(Math.abs(result.maintenance - 2520)).toBeLessThanOrEqual(1);
    result.lose.forEach((target, i) =>
      expect(
        Math.abs(target.kcalPerDay - [2270, 2020, 1520][i]),
      ).toBeLessThanOrEqual(1),
    );
    expect(result.lose.map((t) => Math.round(t.percentOfMaintenance))).toEqual([
      90, 80, 60,
    ]);
    expect(result.lose.map((t) => t.kgPerWeek)).toEqual([-0.25, -0.5, -1]);
  });

  it('uses the female formula', () => {
    // 10·60 + 6.25·165 − 5·25 − 161 = 1,345.25
    expect(
      calories({
        sex: ESex.FEMALE,
        heightCm: 165,
        weightKg: 60,
        activityLevel: EActivityLevel.SEDENTARY,
      }).maintenance,
    ).toBeCloseTo(1345.25 * 1.2);
  });

  it.each([
    [EActivityLevel.SEDENTARY, 1.2],
    [EActivityLevel.LIGHT, 1.375],
    [EActivityLevel.MODERATE, 1.465],
    [EActivityLevel.ACTIVE, 1.55],
    [EActivityLevel.VERY_ACTIVE, 1.725],
    [EActivityLevel.EXTRA_ACTIVE, 1.9],
  ])('multiplies BMR by the %s multiplier', (activityLevel, multiplier) => {
    expect(calories({ ...MAN, activityLevel }).maintenance).toBeCloseTo(
      1720 * multiplier,
    );
  });

  it('adds 250, 500 and 1,000 kcal to gain', () => {
    const result = calories(MAN);

    expect(result.gain.map((t) => t.kcalPerDay - result.maintenance)).toEqual([
      expect.closeTo(250),
      expect.closeTo(500),
      expect.closeTo(1000),
    ]);
    expect(result.gain.map((t) => t.kgPerWeek)).toEqual([0.25, 0.5, 1]);
    expect(result.gain.map((t) => Math.round(t.percentOfMaintenance))).toEqual([
      110, 120, 140,
    ]);
  });

  it('flags targets below 1,500 kcal for a man', () => {
    // Maintenance 2,064 kcal.
    const result = calories({
      ...MAN,
      activityLevel: EActivityLevel.SEDENTARY,
    });

    expect(result.safeMinimum).toBe(1500);
    expect(result.lose.map((t) => t.belowSafeMinimum)).toEqual([
      false,
      false,
      true,
    ]);
  });

  it('flags targets below 1,200 kcal for a woman', () => {
    // Maintenance 1,614.3 kcal.
    const result = calories({
      sex: ESex.FEMALE,
      heightCm: 165,
      weightKg: 60,
      activityLevel: EActivityLevel.SEDENTARY,
    });

    expect(result.safeMinimum).toBe(1200);
    expect(result.lose.map((t) => t.belowSafeMinimum)).toEqual([
      false,
      true,
      true,
    ]);
    expect(result.gain.some((t) => t.belowSafeMinimum)).toBe(false);
  });

  it('ages a year on the birthday', () => {
    const dateOfBirth = '1990-05-15T12:00:00.000Z';
    const on = (today: Date) =>
      bodyMetrics({ bodyStats: MAN, dateOfBirth, today }).calories!.maintenance;

    // 5 kcal less BMR per year of age.
    expect(on(new Date(2025, 4, 14)) - on(new Date(2025, 4, 15))).toBeCloseTo(
      5 * 1.465,
    );
  });
});

describe('ageOn', () => {
  it.each([
    [new Date(2025, 4, 14), 34],
    [new Date(2025, 4, 15), 35],
    [new Date(2025, 4, 16), 35],
  ])('is whole years as of %s', (today, age) => {
    expect(ageOn(new Date(1990, 4, 15), today)).toBe(age);
  });
});

describe('BMI', () => {
  it('is kg / m²', () => {
    expect(metrics(MAN).bmi!.value).toBeCloseTo(71.5 / 1.8 ** 2);
  });

  // At 100 cm, BMI equals the weight.
  it.each([
    [15.9, EBmiCategory.SEVERE_THINNESS],
    [16, EBmiCategory.MODERATE_THINNESS],
    [17, EBmiCategory.MILD_THINNESS],
    [18.4, EBmiCategory.MILD_THINNESS],
    [18.5, EBmiCategory.NORMAL],
    [24.9, EBmiCategory.NORMAL],
    [25, EBmiCategory.OVERWEIGHT],
    [30, EBmiCategory.OBESE_CLASS_I],
    [35, EBmiCategory.OBESE_CLASS_II],
    [39.9, EBmiCategory.OBESE_CLASS_II],
    [40, EBmiCategory.OBESE_CLASS_III],
  ])('puts a BMI of %s in %s', (weightKg, category) => {
    expect(metrics({ heightCm: 100, weightKg }).bmi!.category).toBe(category);
  });

  it('gives the healthy weight range for the height', () => {
    const { healthyWeight } = metrics(MAN).bmi!;

    expect(healthyWeight.minKg).toBeCloseTo(18.5 * 3.24);
    expect(healthyWeight.maxKg).toBeCloseTo(25 * 3.24);
  });
});

describe('missing inputs', () => {
  it('computes nothing without Body stats', () => {
    const result = bodyMetrics({ today: TODAY });

    expect(result.bmi).toBeUndefined();
    expect(result.calories).toBeUndefined();
    expect(result.missing).toEqual([
      'heightCm',
      'weightKg',
      'sex',
      'activityLevel',
      'dateOfBirth',
    ]);
  });

  it.each(['heightCm', 'weightKg'] as const)('needs %s for BMI', (field) => {
    const result = metrics({ ...MAN, [field]: null });

    expect(result.bmi).toBeUndefined();
    expect(result.calories).toBeUndefined();
    expect(result.missing).toEqual([field]);
  });

  it.each(['sex', 'activityLevel'] as const)(
    'shows BMI but no calories without %s',
    (field) => {
      const result = metrics({ ...MAN, [field]: null });

      expect(result.bmi).toBeDefined();
      expect(result.calories).toBeUndefined();
      expect(result.missing).toEqual([field]);
    },
  );

  it('shows BMI but no calories with complete Body stats and no date of birth', () => {
    const result = bodyMetrics({ bodyStats: MAN, today: TODAY });

    expect(result.bmi).toBeDefined();
    expect(result.calories).toBeUndefined();
    expect(result.missing).toEqual(['dateOfBirth']);
  });

  it('misses nothing when complete', () => {
    expect(metrics(MAN).missing).toEqual([]);
  });
});

import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import {
  EBmiCategory,
  ECaloriePace,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';

import { IBmiBand } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';

/** The adult WHO table, lowest band first. */
export const BMI_BANDS: IBmiBand[] = [
  { category: EBmiCategory.SEVERE_THINNESS, max: 16 },
  { category: EBmiCategory.MODERATE_THINNESS, min: 16, max: 17 },
  { category: EBmiCategory.MILD_THINNESS, min: 17, max: 18.5 },
  { category: EBmiCategory.NORMAL, min: 18.5, max: 25 },
  { category: EBmiCategory.OVERWEIGHT, min: 25, max: 30 },
  { category: EBmiCategory.OBESE_CLASS_I, min: 30, max: 35 },
  { category: EBmiCategory.OBESE_CLASS_II, min: 35, max: 40 },
  { category: EBmiCategory.OBESE_CLASS_III, min: 40 },
];

export const HEALTHY_BMI = { min: 18.5, max: 25 };

export const CM_PER_M = 100;

/** Mifflin-St Jeor: 10·kg + 6.25·cm − 5·age + the sex's constant. */
export const BMR = {
  perKg: 10,
  perCm: 6.25,
  perYear: -5,
  bySex: { [ESex.MALE]: 5, [ESex.FEMALE]: -161 },
} as const;

export const ACTIVITY_MULTIPLIERS: Record<EActivityLevel, number> = {
  [EActivityLevel.SEDENTARY]: 1.2,
  [EActivityLevel.LIGHT]: 1.375,
  [EActivityLevel.MODERATE]: 1.465,
  [EActivityLevel.ACTIVE]: 1.55,
  [EActivityLevel.VERY_ACTIVE]: 1.725,
  [EActivityLevel.EXTRA_ACTIVE]: 1.9,
};

/** Daily offsets from Maintenance calories, as calculator.net uses them. */
export const CALORIE_PACES = [
  { pace: ECaloriePace.MILD, kgPerWeek: 0.25, kcalPerDay: 250 },
  { pace: ECaloriePace.NORMAL, kgPerWeek: 0.5, kcalPerDay: 500 },
  { pace: ECaloriePace.FAST, kgPerWeek: 1, kcalPerDay: 1000 },
];

/** Calorie targets below these are flagged, kcal/day. */
export const SAFE_MINIMUM_CALORIES: Record<ESex, number> = {
  [ESex.MALE]: 1500,
  [ESex.FEMALE]: 1200,
};

export const BMI_DISPLAY_DECIMALS = 1;

export const CALORIE_DISPLAY_DECIMALS = 0;

export const WEIGHT_DISPLAY_DECIMALS = 1;

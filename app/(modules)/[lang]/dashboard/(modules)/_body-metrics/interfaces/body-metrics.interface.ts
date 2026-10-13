import {
  EBmiCategory,
  EBodyFatCategory,
  ECaloriePace,
  EMacroPlan,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';

import { IBodyStats } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';

/** What Body metrics are computed from. */
export interface IBodyMetricsInput {
  bodyStats?: Partial<IBodyStats>;
  /** ISO date-time; only its UTC calendar date is meaningful. */
  dateOfBirth?: string;
  today: Date;
}

export type TBodyMetricsField = keyof IBodyStats | 'dateOfBirth';

/** A BMI band; `min` is inclusive, `max` exclusive, either may be open. */
export interface IBmiBand {
  category: EBmiCategory;
  min?: number;
  max?: number;
}

/** A body fat band in %; `min` is inclusive, `max` exclusive, either may be open. */
export interface IBodyFatBand {
  category: EBodyFatCategory;
  min?: number;
  max?: number;
}

export interface IBodyFat {
  /** US Navy method, full precision; round only for display. */
  percent: number;
  category: EBodyFatCategory;
  fatMassKg: number;
  leanMassKg: number;
}

export interface IWeightRange {
  minKg: number;
  maxKg: number;
}

export interface IBmi {
  /** Full precision; round only for display. */
  value: number;
  category: EBmiCategory;
  /** The weights with a Normal BMI at the User's height. */
  healthyWeight: IWeightRange;
}

export interface ICalorieTarget {
  pace: ECaloriePace;
  /** Signed: negative to lose weight, positive to gain it. */
  kgPerWeek: number;
  kcalPerDay: number;
  percentOfMaintenance: number;
  belowSafeMinimum: boolean;
}

export interface ICalories {
  maintenance: number;
  /** The safe minimum for the User's sex, in kcal/day. */
  safeMinimum: number;
  lose: ICalorieTarget[];
  gain: ICalorieTarget[];
}

/** A macro's share of calories, as a fraction of 1. */
export interface IMacroShares {
  protein: number;
  carbs: number;
  fat: number;
}

export interface IMacroAmount {
  grams: number;
  kcal: number;
  percent: number;
  /** The low end of the macro's range, in grams. */
  minGrams: number;
  /** The high end of the macro's range, in grams. */
  maxGrams: number;
}

export interface IMacroPlan {
  plan: EMacroPlan;
  protein: IMacroAmount;
  carbs: IMacroAmount;
  fat: IMacroAmount;
}

/** The Macro plans for one day of Maintenance calories. */
export interface IMacros {
  kcalPerDay: number;
  plans: IMacroPlan[];
  /** Grams per day to stay under. */
  sugarMaxGrams: number;
  saturatedFatMaxGrams: number;
}

export interface IBodyMetrics {
  /** Unset while height or weight is missing. */
  bmi?: IBmi;
  /**
   * Unset while sex, height, weight, neck, waist or (for a woman) hip is
   * missing, or when they give an implausible result.
   */
  bodyFat?: IBodyFat;
  /** Unset while any input is missing. */
  calories?: ICalories;
  /** Unset together with `calories`. */
  macros?: IMacros;
  /** The inputs still needed, for BMI, body fat and calories alike. */
  missing: TBodyMetricsField[];
}

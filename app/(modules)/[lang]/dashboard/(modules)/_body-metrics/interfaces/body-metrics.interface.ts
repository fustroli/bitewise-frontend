import {
  EBmiCategory,
  EBodyFatCategory,
  ECaloriePace,
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
  /** The inputs still needed, for BMI, body fat and calories alike. */
  missing: TBodyMetricsField[];
}

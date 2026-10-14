import { EMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';

/** One day of Maintenance calories and a Macro plan's macros, full precision. */
export interface IMaintenanceTargets {
  plan: EMacroPlan;
  calories: number;
  protein: number;
  totalFat: number;
  totalCarbohydrates: number;
  /** Caps: stay under these. */
  saturatedFat: number;
  sugar: number;
}

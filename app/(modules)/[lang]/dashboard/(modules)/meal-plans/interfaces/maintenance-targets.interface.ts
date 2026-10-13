/** One day of Maintenance calories and the Balanced plan's macros, full precision. */
export interface IMaintenanceTargets {
  calories: number;
  protein: number;
  totalFat: number;
  totalCarbohydrates: number;
  /** Caps: stay under these. */
  saturatedFat: number;
  sugar: number;
}

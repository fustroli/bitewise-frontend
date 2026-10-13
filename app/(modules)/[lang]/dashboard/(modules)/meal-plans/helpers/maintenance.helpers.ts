import {
  MAINTENANCE_MACRO_PLAN,
  NO_TARGET,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/constants';
import {
  formatCalories,
  formatGrams,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';

import { IBodyMetrics } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';
import { IMaintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { INutritionColumn } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';

/** Unset while Maintenance can't be computed. */
export const maintenanceTargets = ({
  calories,
  macros,
}: IBodyMetrics): IMaintenanceTargets | undefined => {
  const plan = macros?.plans.find(
    ({ plan }) => plan === MAINTENANCE_MACRO_PLAN,
  );
  if (!calories || !macros || !plan) return undefined;

  return {
    calories: calories.maintenance,
    protein: plan.protein.grams,
    totalFat: plan.fat.grams,
    totalCarbohydrates: plan.carbs.grams,
    saturatedFat: macros.saturatedFatMaxGrams,
    sugar: macros.sugarMaxGrams,
  };
};

/** Rounds only for display, e.g. `74 (<30) g`, `2,615 kcal` or `–`. */
export const formatMaintenanceTarget = (
  targets: IMaintenanceTargets,
  { nutrient, subNutrient, unit }: INutritionColumn,
  locale: string,
) => {
  if (!(nutrient in targets)) return NO_TARGET;

  const key = nutrient as keyof IMaintenanceTargets;
  const amount =
    key === 'calories'
      ? formatCalories(targets[key], locale)
      : formatGrams(targets[key], locale);
  const cap =
    subNutrient &&
    `(<${formatGrams(targets[subNutrient as keyof IMaintenanceTargets], locale)})`;

  return [amount, cap, unit].filter(Boolean).join(' ');
};

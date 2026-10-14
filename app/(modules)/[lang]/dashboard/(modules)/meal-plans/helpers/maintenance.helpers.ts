import { EMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';
import { IBodyMetrics } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';
import { IMaintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { ON_TARGET_KCAL } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/constants';

/** Unset while Maintenance can't be computed. */
export const maintenanceTargets = (
  { calories, macros }: IBodyMetrics,
  planName: EMacroPlan = EMacroPlan.BALANCED,
): IMaintenanceTargets | undefined => {
  const plan = macros?.plans.find((option) => option.plan === planName);
  if (!calories || !macros || !plan) return undefined;

  return {
    plan: planName,
    calories: calories.maintenance,
    protein: plan.protein.grams,
    totalFat: plan.fat.grams,
    totalCarbohydrates: plan.carbs.grams,
    saturatedFat: macros.saturatedFatMaxGrams,
    sugar: macros.sugarMaxGrams,
  };
};

/** A day's calories against Maintenance: the signed gap, and if it's close. */
export const calorieGap = (kcal: number, maintenance: number) => {
  const diff = kcal - maintenance;
  return { diff, onTarget: Math.abs(Math.round(diff)) <= ON_TARGET_KCAL };
};

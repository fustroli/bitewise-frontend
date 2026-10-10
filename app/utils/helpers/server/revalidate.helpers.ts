import 'server-only';

import { TApiResult } from '@/app/utils/interfaces';
import { revalidatePath } from 'next/cache';

/**
 * Refreshes every dashboard page in every locale after a successful change.
 * Ingredient, Meal and Meal plan changes ripple into each other's nutrition
 * totals and the statistics, so the whole dashboard is refreshed.
 */
export const refreshDashboardOnSuccess = <T>(result: TApiResult<T>) => {
  if (result.ok) revalidatePath('/[lang]/dashboard', 'layout');
  return result;
};

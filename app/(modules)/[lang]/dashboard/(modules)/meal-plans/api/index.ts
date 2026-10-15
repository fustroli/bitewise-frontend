import 'server-only';

import {
  IMealPlan,
  IMealPlanOption,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { request, unwrap } from '@/app/utils/helpers/server';

import { IQueryParams } from '@/app/utils/interfaces';

export async function fetchMealPlans(params: IQueryParams) {
  return unwrap(
    await request<{ data: IMealPlan[]; count: number }>(
      'meal-plan',
      'GET',
      undefined,
      params,
    ),
  );
}

/** Every Meal plan of the User, by name, as a picker offers them. */
export async function fetchMealPlanOptions() {
  return unwrap(await request<IMealPlanOption[]>('meal-plan/options', 'GET'));
}

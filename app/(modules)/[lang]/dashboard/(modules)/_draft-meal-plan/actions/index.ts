'use server';

import { IDraftMealPlanOption } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import { IMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { MAX_LIST_LIMIT } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { TApiResult } from '@/app/utils/interfaces';
import { request } from '@/app/utils/helpers/server';

/** The User's Meal plans to load the draft from, fetched when the modal opens. */
export async function fetchDraftMealPlans(): Promise<
  TApiResult<IDraftMealPlanOption[]>
> {
  const result = await request<{ data: IMealPlan[] }>(
    'meal-plan',
    'GET',
    undefined,
    { limit: MAX_LIST_LIMIT },
  );
  if (!result.ok) return result;

  return {
    ok: true,
    data: result.data.data.map(({ id, name, meals }) => ({
      id,
      name,
      mealIds: meals.map((meal) => meal.id),
    })),
  };
}

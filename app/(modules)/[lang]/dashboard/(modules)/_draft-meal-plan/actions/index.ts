'use server';

import { IMealPlanOption } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { TApiResult } from '@/app/utils/interfaces';
import { request } from '@/app/utils/helpers/server';

/** The User's Meal plans to load the draft from, fetched when the modal opens. */
export async function fetchDraftMealPlans(): Promise<
  TApiResult<IMealPlanOption[]>
> {
  return request<IMealPlanOption[]>('meal-plan/options', 'GET');
}

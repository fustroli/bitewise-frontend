import 'server-only';

import { request, unwrap } from '@/app/utils/helpers/server';

import { IMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
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

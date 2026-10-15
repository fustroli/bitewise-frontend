import 'server-only';

import { request, unwrap } from '@/app/utils/helpers/server';

import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IMealOption } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IQueryParams } from '@/app/utils/interfaces';

export async function fetchMeals(params: IQueryParams) {
  return unwrap(
    await request<{ data: IMeal[]; count: number }>(
      'meal',
      'GET',
      undefined,
      params,
    ),
  );
}

/** Every Meal of the User, by name, as a picker offers them. */
export async function fetchMealOptions() {
  return unwrap(await request<IMealOption[]>('meal/options', 'GET'));
}

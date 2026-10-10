import 'server-only';

import { request, unwrap } from '@/app/utils/helpers/server';

import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
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

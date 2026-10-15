import 'server-only';

import { request, unwrap } from '@/app/utils/helpers/server';

import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IIngredientOption } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IQueryParams } from '@/app/utils/interfaces';

export async function fetchIngredients(params: IQueryParams) {
  return unwrap(
    await request<{ data: IIngredient[]; count: number }>(
      'ingredient',
      'GET',
      undefined,
      params,
    ),
  );
}

/** Every Ingredient of the User, by name, as a picker offers them. */
export async function fetchIngredientOptions() {
  return unwrap(
    await request<IIngredientOption[]>('ingredient/options', 'GET'),
  );
}

'use server';

import {
  ICreateIngredient,
  IIngredient,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { refreshDashboardOnSuccess, request } from '@/app/utils/helpers/server';

export async function createIngredient(ingredient: ICreateIngredient) {
  return refreshDashboardOnSuccess(
    await request<IIngredient>('ingredient', 'POST', ingredient),
  );
}

export async function updateIngredient(
  ingredient: ICreateIngredient,
  ingredientId: number,
) {
  return refreshDashboardOnSuccess(
    await request<IIngredient>(
      `ingredient/${ingredientId}`,
      'PATCH',
      ingredient,
    ),
  );
}

export async function deleteIngredient(ingredientId: number) {
  return refreshDashboardOnSuccess(
    await request(`ingredient/${ingredientId}`, 'DELETE'),
  );
}

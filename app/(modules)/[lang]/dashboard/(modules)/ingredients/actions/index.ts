'use server';

import {
  ICreateIngredient,
  IIngredient,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import {
  actionDictionary,
  idSchema,
  parseActionInput,
  refreshDashboardOnSuccess,
  request,
} from '@/app/utils/helpers/server';
import { createIngredientSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/validations';
import { z } from 'zod';

const ingredientSchema = async () =>
  createIngredientSchema(await actionDictionary());

export async function createIngredient(ingredient: ICreateIngredient) {
  const input = parseActionInput(await ingredientSchema(), ingredient);
  if (!input.ok) return input;

  return refreshDashboardOnSuccess(
    await request<IIngredient>('ingredient', 'POST', input.data),
  );
}

export async function updateIngredient(
  ingredient: ICreateIngredient,
  ingredientId: number,
) {
  const input = parseActionInput(
    z.tuple([await ingredientSchema(), idSchema]),
    [ingredient, ingredientId],
  );
  if (!input.ok) return input;

  const [body, id] = input.data;
  return refreshDashboardOnSuccess(
    await request<IIngredient>(`ingredient/${id}`, 'PATCH', body),
  );
}

export async function deleteIngredient(ingredientId: number) {
  const input = parseActionInput(idSchema, ingredientId);
  if (!input.ok) return input;

  return refreshDashboardOnSuccess(
    await request(`ingredient/${input.data}`, 'DELETE'),
  );
}

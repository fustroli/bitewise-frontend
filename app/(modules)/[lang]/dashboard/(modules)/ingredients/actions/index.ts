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

import { MAX_IDS_PER_FETCH } from '@/app/utils/constants';
import { TApiResult } from '@/app/utils/interfaces';
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

/** The User's Ingredients among `ids`, in full; ids not returned are gone. */
export async function fetchIngredientsByIds(
  ids: number[],
): Promise<TApiResult<IIngredient[]>> {
  const input = parseActionInput(
    z.array(idSchema).min(1).max(MAX_IDS_PER_FETCH),
    ids,
  );
  if (!input.ok) return input;

  const result = await request<{ data: IIngredient[] }>(
    'ingredient',
    'GET',
    undefined,
    { ids: input.data.join(',') },
  );
  return result.ok ? { ok: true, data: result.data.data } : result;
}

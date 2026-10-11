'use server';

import {
  ICreateMeal,
  IMeal,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import {
  actionDictionary,
  idSchema,
  parseActionInput,
  refreshDashboardOnSuccess,
  request,
} from '@/app/utils/helpers/server';
import { createMealSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/validations';
import { z } from 'zod';

const mealSchema = async () => createMealSchema(await actionDictionary());

export async function createMeal(meal: ICreateMeal) {
  const input = parseActionInput(await mealSchema(), meal);
  if (!input.ok) return input;

  return refreshDashboardOnSuccess(
    await request<IMeal>('meal', 'POST', input.data),
  );
}

export async function updateMeal(meal: ICreateMeal, mealId: number) {
  const input = parseActionInput(z.tuple([await mealSchema(), idSchema]), [
    meal,
    mealId,
  ]);
  if (!input.ok) return input;

  const [body, id] = input.data;
  return refreshDashboardOnSuccess(
    await request<IMeal>(`meal/${id}`, 'PATCH', body),
  );
}

export async function deleteMeal(mealId: number) {
  const input = parseActionInput(idSchema, mealId);
  if (!input.ok) return input;

  return refreshDashboardOnSuccess(
    await request(`meal/${input.data}`, 'DELETE'),
  );
}

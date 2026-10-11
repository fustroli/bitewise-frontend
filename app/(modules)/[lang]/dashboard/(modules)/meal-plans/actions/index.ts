'use server';

import {
  ICreateMealPlan,
  IMealPlan,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import {
  actionDictionary,
  idSchema,
  parseActionInput,
  refreshDashboardOnSuccess,
  request,
} from '@/app/utils/helpers/server';
import { createMealPlanSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/validations';
import { z } from 'zod';

const mealPlanSchema = async () =>
  createMealPlanSchema(await actionDictionary());

export async function createMealPlan(mealPlan: ICreateMealPlan) {
  const input = parseActionInput(await mealPlanSchema(), mealPlan);
  if (!input.ok) return input;

  return refreshDashboardOnSuccess(
    await request<IMealPlan>('meal-plan', 'POST', input.data),
  );
}

export async function updateMealPlan(
  mealPlan: ICreateMealPlan,
  mealPlanId: number,
) {
  const input = parseActionInput(z.tuple([await mealPlanSchema(), idSchema]), [
    mealPlan,
    mealPlanId,
  ]);
  if (!input.ok) return input;

  const [body, id] = input.data;
  return refreshDashboardOnSuccess(
    await request<IMealPlan>(`meal-plan/${id}`, 'PATCH', body),
  );
}

export async function deleteMealPlan(mealPlanId: number) {
  const input = parseActionInput(idSchema, mealPlanId);
  if (!input.ok) return input;

  return refreshDashboardOnSuccess(
    await request(`meal-plan/${input.data}`, 'DELETE'),
  );
}

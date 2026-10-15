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

import { MAX_IDS_PER_FETCH } from '@/app/utils/constants';
import { TApiResult } from '@/app/utils/interfaces';
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

/** The User's Meal plans among `ids`, in full; ids not returned are gone. */
export async function fetchMealPlansByIds(
  ids: number[],
): Promise<TApiResult<IMealPlan[]>> {
  const input = parseActionInput(
    z.array(idSchema).min(1).max(MAX_IDS_PER_FETCH),
    ids,
  );
  if (!input.ok) return input;

  const result = await request<{ data: IMealPlan[] }>(
    'meal-plan',
    'GET',
    undefined,
    { ids: input.data.join(',') },
  );
  return result.ok ? { ok: true, data: result.data.data } : result;
}

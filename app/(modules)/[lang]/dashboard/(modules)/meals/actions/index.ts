'use server';

import {
  ICreateMeal,
  IMeal,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { refreshDashboardOnSuccess, request } from '@/app/utils/helpers/server';

export async function createMeal(meal: ICreateMeal) {
  return refreshDashboardOnSuccess(await request<IMeal>('meal', 'POST', meal));
}

export async function updateMeal(meal: ICreateMeal, mealId: number) {
  return refreshDashboardOnSuccess(
    await request<IMeal>(`meal/${mealId}`, 'PATCH', meal),
  );
}

export async function deleteMeal(mealId: number) {
  return refreshDashboardOnSuccess(await request(`meal/${mealId}`, 'DELETE'));
}

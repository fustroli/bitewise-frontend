'use server';

import {
  ICreateMealPlan,
  IMealPlan,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { refreshDashboardOnSuccess, request } from '@/app/utils/helpers/server';

export async function createMealPlan(mealPlan: ICreateMealPlan) {
  return refreshDashboardOnSuccess(
    await request<IMealPlan>('meal-plan', 'POST', mealPlan),
  );
}

export async function updateMealPlan(
  mealPlan: ICreateMealPlan,
  mealPlanId: number,
) {
  return refreshDashboardOnSuccess(
    await request<IMealPlan>(`meal-plan/${mealPlanId}`, 'PATCH', mealPlan),
  );
}

export async function deleteMealPlan(mealPlanId: number) {
  return refreshDashboardOnSuccess(
    await request(`meal-plan/${mealPlanId}`, 'DELETE'),
  );
}

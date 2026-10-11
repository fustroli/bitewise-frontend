import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createMealPlan,
  deleteMealPlan,
  updateMealPlan,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/actions';

import { request } from '@/app/utils/helpers/server';

vi.mock('@/app/utils/helpers/server', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  request: vi.fn(async () => ({ ok: true, data: undefined })),
  refreshDashboardOnSuccess: <T>(result: T) => result,
}));

const INVALID = { ok: false, status: 400, message: 'Invalid input' };

beforeEach(() => {
  vi.mocked(request).mockClear();
});

const MEAL_PLAN = { name: 'Week 1', mealIds: [1, 2] };

describe('meal plan actions', () => {
  it('rejects a path-traversal id without calling the backend', async () => {
    expect(await deleteMealPlan('../users/me' as any)).toEqual(INVALID);
    expect(await updateMealPlan(MEAL_PLAN, '../users/me' as any)).toEqual(
      INVALID,
    );
    expect(request).not.toHaveBeenCalled();
  });

  it('strips fields the schema does not know', async () => {
    await createMealPlan({ ...MEAL_PLAN, userId: 2 } as any);

    expect(request).toHaveBeenCalledWith('meal-plan', 'POST', MEAL_PLAN);
  });

  it('sends a valid update to the id', async () => {
    await updateMealPlan(MEAL_PLAN, 4);

    expect(request).toHaveBeenCalledWith('meal-plan/4', 'PATCH', MEAL_PLAN);
  });
});

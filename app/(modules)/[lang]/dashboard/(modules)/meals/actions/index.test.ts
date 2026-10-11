import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createMeal,
  deleteMeal,
  updateMeal,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/actions';

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

const MEAL = {
  name: 'Breakfast',
  mealIngredients: [{ ingredientId: 1, quantity: 100 }],
};

describe('meal actions', () => {
  it('rejects a path-traversal id without calling the backend', async () => {
    expect(await deleteMeal('../users/me' as any)).toEqual(INVALID);
    expect(await updateMeal(MEAL, '../users/me' as any)).toEqual(INVALID);
    expect(request).not.toHaveBeenCalled();
  });

  it('strips fields the schema does not know, also when nested', async () => {
    await createMeal({
      ...MEAL,
      userId: 2,
      mealIngredients: [{ ingredientId: 1, quantity: 100, mealId: 9 }],
    } as any);

    expect(request).toHaveBeenCalledWith('meal', 'POST', MEAL);
  });

  it('sends a valid update to the id', async () => {
    await updateMeal(MEAL, 3);

    expect(request).toHaveBeenCalledWith('meal/3', 'PATCH', MEAL);
  });
});

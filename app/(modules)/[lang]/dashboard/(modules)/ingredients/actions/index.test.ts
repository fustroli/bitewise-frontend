import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createIngredient,
  deleteIngredient,
  updateIngredient,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/actions';

import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';
import { request } from '@/app/utils/helpers/server';

vi.mock('@/app/utils/helpers/server', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  request: vi.fn(async () => ({ ok: true, data: undefined })),
  refreshDashboardOnSuccess: <T>(result: T) => result,
}));

const INGREDIENT = {
  name: 'Oats',
  protein: 13,
  totalFat: 7,
  saturatedFat: 1,
  totalCarbohydrates: 68,
  sugar: 1,
  dietaryFiber: 10,
  calories: 389,
  unit: EUnit.HUNDRED_GRAMS,
};

const INVALID = { ok: false, status: 400, message: 'Invalid input' };

beforeEach(() => {
  vi.mocked(request).mockClear();
});

describe('ingredient actions', () => {
  it('rejects a path-traversal id without calling the backend', async () => {
    expect(await deleteIngredient('../users/me' as any)).toEqual(INVALID);
    expect(
      await updateIngredient(INGREDIENT, '1/../../users/me' as any),
    ).toEqual(INVALID);
    expect(request).not.toHaveBeenCalled();
  });

  it.each([0, -1, 1.5, NaN])('rejects the id %s', async (id) => {
    expect(await deleteIngredient(id)).toEqual(INVALID);
    expect(request).not.toHaveBeenCalled();
  });

  it('strips fields the schema does not know', async () => {
    await createIngredient({ ...INGREDIENT, userId: 2 } as any);

    expect(request).toHaveBeenCalledWith('ingredient', 'POST', INGREDIENT);
  });

  it('rejects an invalid body without calling the backend', async () => {
    expect(await createIngredient({ ...INGREDIENT, calories: -1 })).toEqual(
      INVALID,
    );
    expect(request).not.toHaveBeenCalled();
  });

  it('sends a valid update to the id', async () => {
    await updateIngredient(INGREDIENT, 7);

    expect(request).toHaveBeenCalledWith('ingredient/7', 'PATCH', INGREDIENT);
  });
});

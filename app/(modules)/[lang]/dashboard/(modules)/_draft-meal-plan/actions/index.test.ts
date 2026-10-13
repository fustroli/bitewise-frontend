import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchDraftMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/actions';
import { request } from '@/app/utils/helpers/server';

vi.mock('@/app/utils/helpers/server', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  request: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(request).mockReset();
});

describe('fetchDraftMealPlans', () => {
  it('returns each Meal plan with the ids of its Meals', async () => {
    vi.mocked(request).mockResolvedValue({
      ok: true,
      data: {
        data: [
          {
            id: 1,
            name: 'Week 1',
            mealIds: [],
            meals: [{ id: 10 }, { id: 11 }],
          },
        ],
      },
    });

    expect(await fetchDraftMealPlans()).toEqual({
      ok: true,
      data: [{ id: 1, name: 'Week 1', mealIds: [10, 11] }],
    });
    expect(request).toHaveBeenCalledWith('meal-plan', 'GET', undefined, {
      limit: 100,
    });
  });

  it('passes a failure through', async () => {
    const failure = { ok: false as const, status: 500, message: 'Boom' };
    vi.mocked(request).mockResolvedValue(failure);

    expect(await fetchDraftMealPlans()).toEqual(failure);
  });
});

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
  it("returns the Meal plan options, every one of the User's", async () => {
    const options = [{ id: 1, name: 'Week 1', mealIds: [11, 10] }];
    vi.mocked(request).mockResolvedValue({ ok: true, data: options });

    expect(await fetchDraftMealPlans()).toEqual({ ok: true, data: options });
    expect(request).toHaveBeenCalledWith('meal-plan/options', 'GET');
  });

  it('passes a failure through', async () => {
    const failure = { ok: false as const, status: 500, message: 'Boom' };
    vi.mocked(request).mockResolvedValue(failure);

    expect(await fetchDraftMealPlans()).toEqual(failure);
  });
});

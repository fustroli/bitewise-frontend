import { describe, expect, it } from 'vitest';

import { createMealPlanSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/validations';
import en from '@/app/i18n/locales/en.json';

const schema = createMealPlanSchema(en);

describe('createMealPlanSchema', () => {
  it('requires at least one Meal', () => {
    expect(
      schema.safeParse({ name: 'Week', mealIds: [] }).error?.issues,
    ).toMatchObject([
      {
        path: ['mealIds'],
        message: en.resources.mealPlans.validation.mealsRequired,
      },
    ]);
  });

  it('accepts a Meal plan with Meals', () => {
    expect(schema.safeParse({ name: 'Week', mealIds: [1, 2] }).success).toBe(
      true,
    );
  });
});

import { describe, expect, it } from 'vitest';

import { createMealSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/validations';
import en from '@/app/i18n/locales/en.json';

const schema = createMealSchema(en);
const { validation } = en.resources.meals;

const issues = (
  mealIngredients: { ingredientId: number; quantity: number }[],
) =>
  schema.safeParse({ name: 'Breakfast', mealIngredients }).error?.issues ?? [];

describe('createMealSchema', () => {
  it('accepts distinct Ingredients', () => {
    expect(
      issues([
        { ingredientId: 1, quantity: 100 },
        { ingredientId: 2, quantity: 1 },
      ]),
    ).toEqual([]);
  });

  it('requires at least one Meal ingredient', () => {
    expect(issues([])).toMatchObject([
      { path: ['mealIngredients'], message: validation.ingredientsRequired },
    ]);
  });

  it('flags a repeated Ingredient on the repeat', () => {
    expect(
      issues([
        { ingredientId: 1, quantity: 100 },
        { ingredientId: 2, quantity: 1 },
        { ingredientId: 1, quantity: 50 },
      ]),
    ).toMatchObject([
      {
        path: ['mealIngredients', 2, 'ingredientId'],
        message: validation.ingredientDuplicate,
      },
    ]);
  });

  it('does not count unpicked rows as repeats', () => {
    expect(
      issues([
        { ingredientId: 0, quantity: 1 },
        { ingredientId: 0, quantity: 1 },
      ]).map(({ message }) => message),
    ).toEqual([validation.ingredientRequired, validation.ingredientRequired]);
  });
});

// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import MealCard from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Card/MealCard';
import en from '@/app/i18n/locales/en.json';
import userEvent from '@testing-library/user-event';

const PER_UNIT = {
  createTimeStamp: new Date(),
  updateTimeStamp: new Date(),
  deleteTimeStamp: null,
};

const MEAL = {
  id: 1,
  name: 'Overnight oats',
  mealIngredients: [
    {
      ...PER_UNIT,
      id: 11,
      ingredientId: 2,
      ingredientName: 'Rolled oats',
      name: 'Rolled oats',
      unit: EUnit.HUNDRED_GRAMS,
      quantity: 60,
      calories: 379,
      protein: 13.2,
      totalFat: 6.5,
      saturatedFat: 1.1,
      totalCarbohydrates: 67.7,
      sugar: 1,
      dietaryFiber: 10.1,
    },
    {
      ...PER_UNIT,
      id: 12,
      ingredientId: 3,
      ingredientName: 'Banana',
      name: 'Banana',
      unit: EUnit.PIECE,
      quantity: 1,
      calories: 105,
      protein: 1.3,
      totalFat: 0.4,
      saturatedFat: 0.1,
      totalCarbohydrates: 27,
      sugar: 14.4,
      dietaryFiber: 3.1,
    },
  ],
} as IMeal;

const renderCard = () =>
  render(
    <DictionaryProvider dictionary={en}>
      <MealCard
        meal={MEAL}
        dictionary={en}
        labels={{ ...en.resources.meals, columns: en.resources.meals.columns }}
        tableLabels={en.resourceTable}
        actions={null}
        edit={null}
        compareHref=""
        lang="en"
      />
    </DictionaryProvider>,
  );

describe('MealCard', () => {
  afterEach(cleanup);

  it('shows the totals of quantity × per-unit values', () => {
    renderCard();

    // 0.6 × 379 + 105 = 332.4 kcal; 0.6 × 13.2 + 1.3 = 9.2 g protein.
    expect(screen.getByText('332')).toBeTruthy();
    expect(screen.getByText('9.2')).toBeTruthy();
    expect(screen.getByText('sugar 15 g')).toBeTruthy();
    expect(screen.getByText('2 ingredients · 9.2 g fiber')).toBeTruthy();
  });

  it('lists the ingredients with their quantities on demand', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(
      screen.getByRole('button', { name: 'Show 2 ingredients' }),
    );
    // The first list is the ingredients; each row nests its macro pills' list.
    const list = within(screen.getAllByRole('list')[0]);

    expect(list.getByText('60 g')).toBeTruthy();
    expect(list.getByText('1 piece')).toBeTruthy();
    expect(list.getByText('227 kcal')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Hide ingredients' }),
    ).toBeTruthy();
  });
});

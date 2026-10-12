'use server';

import {
  idSchema,
  parseActionInput,
  request,
} from '@/app/utils/helpers/server';
import { COMPARISON_MAX_ITEMS } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/constants';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IComparisonRow } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import { INutritionMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';
import { TApiResult } from '@/app/utils/interfaces';
import { mealNutrition } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/helpers';
import { z } from 'zod';

const inputSchema = z.tuple([
  z.enum([EComparisonKind.INGREDIENTS, EComparisonKind.MEALS]),
  z.array(idSchema).max(COMPARISON_MAX_ITEMS),
]);

const ENDPOINTS = {
  [EComparisonKind.INGREDIENTS]: 'ingredient',
  [EComparisonKind.MEALS]: 'meal',
};

const ingredientRow = (row: IComparisonRow): IComparisonRow => ({
  id: row.id,
  name: row.name,
  unit: row.unit,
  calories: row.calories,
  protein: row.protein,
  totalFat: row.totalFat,
  saturatedFat: row.saturatedFat,
  totalCarbohydrates: row.totalCarbohydrates,
  sugar: row.sugar,
  dietaryFiber: row.dietaryFiber,
});

const mealRow = (meal: IComparisonRow & INutritionMeal): IComparisonRow => ({
  id: meal.id,
  name: meal.name,
  ...mealNutrition(meal),
});

/** The compared records as they are now; ids that no longer exist are missing. */
export async function fetchComparison(
  kind: EComparisonKind,
  ids: number[],
): Promise<TApiResult<IComparisonRow[]>> {
  const input = parseActionInput(inputSchema, [kind, ids]);
  if (!input.ok) return input;

  const [validKind, itemIds] = input.data;
  if (!itemIds.length) return { ok: true, data: [] };

  const result = await request<{ data: (IComparisonRow & INutritionMeal)[] }>(
    ENDPOINTS[validKind],
    'GET',
    undefined,
    { ids: itemIds.join(',') },
  );
  if (!result.ok) return result;

  const toRow = validKind === EComparisonKind.MEALS ? mealRow : ingredientRow;
  return { ok: true, data: result.data.data.map(toRow) };
}

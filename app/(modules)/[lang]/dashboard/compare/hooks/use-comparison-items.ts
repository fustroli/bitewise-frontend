'use client';

import { IRecordCache, useRecordCache } from '@/app/hooks/use-record-cache';
import {
  ingredientItem,
  mealItem,
  mealPlanItem,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/helpers';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IComparisonItem } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import { TApiResult } from '@/app/utils/interfaces';
import { TComparisonItems } from '@/app/(modules)/[lang]/dashboard/compare/components/compare.types';
import { fetchIngredientsByIds } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/actions';
import { fetchMealPlansByIds } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/actions';
import { fetchMealsByIds } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/actions';
import { toastResult } from '@/app/utils/helpers/client';

const asItems =
  <T>(
    fetchByIds: (ids: number[]) => Promise<TApiResult<T[]>>,
    toItem: (record: T) => IComparisonItem,
  ) =>
  async (ids: number[]): Promise<TApiResult<IComparisonItem[]>> => {
    const result = await fetchByIds(ids);
    return result.ok ? { ok: true, data: result.data.map(toItem) } : result;
  };

const FETCH_ITEMS = {
  [EComparisonKind.INGREDIENTS]: asItems(fetchIngredientsByIds, ingredientItem),
  [EComparisonKind.MEALS]: asItems(fetchMealsByIds, mealItem),
  [EComparisonKind.MEAL_PLANS]: asItems(fetchMealPlansByIds, mealPlanItem),
};

/**
 * Each kind's compared records, fetched by id as they're picked and kept
 * while switching kinds. `initial` holds what the server already fetched.
 */
export const useComparisonItems = (
  initial: Partial<TComparisonItems>,
): Record<EComparisonKind, IRecordCache<IComparisonItem>> => ({
  [EComparisonKind.INGREDIENTS]: useRecordCache(
    FETCH_ITEMS[EComparisonKind.INGREDIENTS],
    toastResult,
    initial[EComparisonKind.INGREDIENTS],
  ),
  [EComparisonKind.MEALS]: useRecordCache(
    FETCH_ITEMS[EComparisonKind.MEALS],
    toastResult,
    initial[EComparisonKind.MEALS],
  ),
  [EComparisonKind.MEAL_PLANS]: useRecordCache(
    FETCH_ITEMS[EComparisonKind.MEAL_PLANS],
    toastResult,
    initial[EComparisonKind.MEAL_PLANS],
  ),
});

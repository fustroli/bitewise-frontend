'use server';

import {
  idSchema,
  parseActionInput,
  request,
} from '@/app/utils/helpers/server';
import { COMPARISON_MAX_ITEMS } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/constants';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IComparisonRow } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import { TApiResult } from '@/app/utils/interfaces';
import { z } from 'zod';

const inputSchema = z.tuple([
  z.literal(EComparisonKind.INGREDIENTS),
  z.array(idSchema).max(COMPARISON_MAX_ITEMS),
]);

/** The compared records as they are now; ids that no longer exist are missing. */
export async function fetchComparison(
  kind: EComparisonKind,
  ids: number[],
): Promise<TApiResult<IComparisonRow[]>> {
  const input = parseActionInput(inputSchema, [kind, ids]);
  if (!input.ok) return input;

  const [, itemIds] = input.data;
  if (!itemIds.length) return { ok: true, data: [] };

  const result = await request<{ data: IComparisonRow[] }>(
    'ingredient',
    'GET',
    undefined,
    { ids: itemIds.join(',') },
  );
  if (!result.ok) return result;

  return {
    ok: true,
    data: result.data.data.map((row) => ({
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
    })),
  };
}

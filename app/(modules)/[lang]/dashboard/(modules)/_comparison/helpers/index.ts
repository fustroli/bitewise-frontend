import {
  COMPARISON_MAX_ITEMS,
  COMPARISON_STORAGE_VERSION,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/constants';
import {
  TStoredComparison,
  storedComparisonSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/validations';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';

/** Per User, since localStorage is shared by everyone using the browser. */
export const comparisonStorageKey = (userId: number) =>
  `bitewise:comparison:v${COMPARISON_STORAGE_VERSION}:${userId}`;

export const EMPTY_COMPARISON: TStoredComparison = {
  [EComparisonKind.INGREDIENTS]: [],
  [EComparisonKind.MEALS]: [],
  [EComparisonKind.MEAL_PLANS]: [],
};

/** Empty when nothing is stored or the data is unreadable. */
export const parseComparison = (
  raw: string | null | undefined,
): TStoredComparison => {
  if (!raw) return EMPTY_COMPARISON;
  try {
    const result = storedComparisonSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : EMPTY_COMPARISON;
  } catch {
    return EMPTY_COMPARISON;
  }
};

export const serializeComparison = (comparison: TStoredComparison) =>
  JSON.stringify(comparison);

export const toggleId = (ids: number[], id: number) => {
  if (ids.includes(id)) return ids.filter((existing) => existing !== id);
  return ids.length < COMPARISON_MAX_ITEMS ? [...ids, id] : ids;
};

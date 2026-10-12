import { COMPARISON_MAX_ITEMS } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/constants';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { z } from 'zod';

const idsSchema = z
  .array(z.number().int().positive())
  .max(COMPARISON_MAX_ITEMS)
  .refine((ids) => new Set(ids).size === ids.length);

/** What localStorage holds: the ids of every kind. */
export const storedComparisonSchema = z.object({
  [EComparisonKind.INGREDIENTS]: idsSchema,
  [EComparisonKind.MEALS]: idsSchema,
  [EComparisonKind.MEAL_PLANS]: idsSchema,
});

export type TStoredComparison = z.infer<typeof storedComparisonSchema>;

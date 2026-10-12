import { Carrot, LucideIcon, Utensils } from 'lucide-react';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { INutritionColumn } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';

/** Compared items per kind. */
export const COMPARISON_MAX_ITEMS = 3;

/** Bumped when the stored shape changes; data of another version is ignored. */
export const COMPARISON_STORAGE_VERSION = 1;

/** The kinds that can be compared so far, in header order. */
export const COMPARISON_KINDS: { kind: EComparisonKind; icon: LucideIcon }[] = [
  { kind: EComparisonKind.INGREDIENTS, icon: Carrot },
  { kind: EComparisonKind.MEALS, icon: Utensils },
];

/** One column per Nutrition value. */
export const COMPARISON_NUTRITION_COLUMNS: INutritionColumn[] = [
  { nutrient: 'calories', unit: 'kcal' },
  { nutrient: 'protein', unit: 'g' },
  { nutrient: 'totalFat', unit: 'g' },
  { nutrient: 'saturatedFat', unit: 'g' },
  { nutrient: 'totalCarbohydrates', unit: 'g' },
  { nutrient: 'sugar', unit: 'g' },
  { nutrient: 'dietaryFiber', unit: 'g' },
];

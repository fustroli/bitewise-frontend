import {
  ingredientItem,
  mealItem,
  mealPlanItem,
  parseComparisonQuery,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/helpers';

import ComparePage from '@/app/(modules)/[lang]/dashboard/compare/components/ComparePage';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IPageProps } from '@/app/utils/interfaces';
import { MAX_LIST_LIMIT } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

const ALL = { limit: MAX_LIST_LIMIT };

/**
 * Loads every kind's records once, so switching kinds keeps each kind's
 * picks; the picks of the kind on screen live in the URL.
 */
export default async function Page(props: IPageProps) {
  const query = parseComparisonQuery((await props.searchParams) ?? {});
  const [ingredients, meals, mealPlans] = await Promise.all([
    fetchIngredients(ALL),
    fetchMeals(ALL),
    fetchMealPlans(ALL),
  ]);

  return (
    <ComparePage
      initial={query}
      items={{
        [EComparisonKind.INGREDIENTS]: ingredients.data.map(ingredientItem),
        [EComparisonKind.MEALS]: meals.data.map(mealItem),
        [EComparisonKind.MEAL_PLANS]: mealPlans.data.map(mealPlanItem),
      }}
    />
  );
}

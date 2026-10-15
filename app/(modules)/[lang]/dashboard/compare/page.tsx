import {
  fetchIngredientOptions,
  fetchIngredients,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import {
  fetchMealOptions,
  fetchMeals,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';
import {
  fetchMealPlanOptions,
  fetchMealPlans,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/api';
import {
  ingredientItem,
  mealItem,
  mealPlanItem,
  parseComparisonQuery,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/helpers';

import ComparePage from '@/app/(modules)/[lang]/dashboard/compare/components/ComparePage';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IComparisonItem } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import { IPageProps } from '@/app/utils/interfaces';

/** The full records of the URL's picks, as the page compares them. */
const fetchItems = async (
  kind: EComparisonKind,
  ids: number[],
): Promise<IComparisonItem[]> => {
  if (!ids.length) return [];
  const params = { ids: ids.join(',') };

  switch (kind) {
    case EComparisonKind.INGREDIENTS:
      return (await fetchIngredients(params)).data.map(ingredientItem);
    case EComparisonKind.MEALS:
      return (await fetchMeals(params)).data.map(mealItem);
    case EComparisonKind.MEAL_PLANS:
      return (await fetchMealPlans(params)).data.map(mealPlanItem);
  }
};

/**
 * Loads every kind's options, so switching kinds keeps each kind's picks,
 * and the URL's picks in full; later picks are fetched as they're made.
 */
export default async function Page(props: IPageProps) {
  const query = parseComparisonQuery((await props.searchParams) ?? {});
  const [ingredients, meals, mealPlans, items] = await Promise.all([
    fetchIngredientOptions(),
    fetchMealOptions(),
    fetchMealPlanOptions(),
    fetchItems(
      query.kind,
      query.ids.filter((id): id is number => id !== null),
    ),
  ]);

  return (
    <ComparePage
      initial={query}
      options={{
        [EComparisonKind.INGREDIENTS]: ingredients,
        [EComparisonKind.MEALS]: meals,
        [EComparisonKind.MEAL_PLANS]: mealPlans,
      }}
      items={{ [query.kind]: items }}
    />
  );
}

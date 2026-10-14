import 'server-only';

import { ILibraryCounts } from '@/app/(modules)/[lang]/dashboard/interfaces';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

/** The smallest page the lists accept: only their totals are wanted. */
const COUNT_ONLY = { limit: 1 };

/** The totals the lists report, the same numbers their pages show. */
export async function fetchLibraryCounts(): Promise<ILibraryCounts> {
  const [ingredients, meals, mealPlans] = await Promise.all([
    fetchIngredients(COUNT_ONLY),
    fetchMeals(COUNT_ONLY),
    fetchMealPlans(COUNT_ONLY),
  ]);

  return {
    ingredients: ingredients.count,
    meals: meals.count,
    mealPlans: mealPlans.count,
  };
}

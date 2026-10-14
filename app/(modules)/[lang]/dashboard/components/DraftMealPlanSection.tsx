import DraftMealPlan from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlan';
import { ILangProps } from '@/app/utils/interfaces';
import { MAX_LIST_LIMIT } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { PROFILE_SECTION_IDS } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/constants';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

/** Loads the Meals and Ingredients the Draft meal plan picks from. */
const DraftMealPlanSection = async ({ lang }: ILangProps) => {
  const [meals, ingredients] = await Promise.all([
    fetchMeals({ limit: MAX_LIST_LIMIT }),
    fetchIngredients({ limit: MAX_LIST_LIMIT }),
  ]);

  return (
    <DraftMealPlan
      meals={meals.data}
      ingredients={ingredients.data}
      profileHref={`/${lang}/dashboard/profile#${PROFILE_SECTION_IDS.bodyStats}`}
    />
  );
};

export default DraftMealPlanSection;

import DraftMealPlan from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlan';
import { ILangProps } from '@/app/utils/interfaces';
import { PROFILE_SECTION_IDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/constants';
import { fetchIngredientOptions } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMealOptions } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

/** Loads the Meals and Ingredients the Draft meal plan picks from. */
const DraftMealPlanSection = async ({ lang }: ILangProps) => {
  const [meals, ingredients] = await Promise.all([
    fetchMealOptions(),
    fetchIngredientOptions(),
  ]);

  return (
    <DraftMealPlan
      options={{ meals, ingredients }}
      profileHref={`/${lang}/dashboard/profile#${PROFILE_SECTION_IDS.bodyStats}`}
    />
  );
};

export default DraftMealPlanSection;

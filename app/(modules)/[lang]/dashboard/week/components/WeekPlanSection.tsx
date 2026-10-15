import { ILangProps } from '@/app/utils/interfaces';
import { PROFILE_SECTION_IDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/constants';
import WeekPlan from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/components/WeekPlan';
import { fetchIngredientOptions } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMealOptions } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

/** Loads the Meals and Ingredients the Week plan's days pick from. */
const WeekPlanSection = async ({ lang }: ILangProps) => {
  const [meals, ingredients] = await Promise.all([
    fetchMealOptions(),
    fetchIngredientOptions(),
  ]);

  return (
    <WeekPlan
      options={{ meals, ingredients }}
      bodyStatsHref={`/${lang}/dashboard/profile#${PROFILE_SECTION_IDS.bodyStats}`}
    />
  );
};

export default WeekPlanSection;

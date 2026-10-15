import { ILangProps } from '@/app/utils/interfaces';
import { MAX_LIST_LIMIT } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { PROFILE_SECTION_IDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/constants';
import WeekPlan from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/components/WeekPlan';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

/** Loads the Meals and Ingredients the Week plan's days pick from. */
const WeekPlanSection = async ({ lang }: ILangProps) => {
  const [meals, ingredients] = await Promise.all([
    fetchMeals({ limit: MAX_LIST_LIMIT }),
    fetchIngredients({ limit: MAX_LIST_LIMIT }),
  ]);

  return (
    <WeekPlan
      meals={meals.data}
      ingredients={ingredients.data}
      bodyStatsHref={`/${lang}/dashboard/profile#${PROFILE_SECTION_IDS.bodyStats}`}
    />
  );
};

export default WeekPlanSection;

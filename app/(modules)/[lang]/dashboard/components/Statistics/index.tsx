import {
  CookingPot,
  HandPlatter,
  NotebookPen,
  ShoppingBasket,
} from 'lucide-react';

import { ILangProps } from '@/app/utils/interfaces';
import StatisticsCard from '@/app/(modules)/[lang]/dashboard/components/Statistics/StatisticsCard';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';
import { getDictionary } from '@/app/i18n/dictionaries';

const Statistics = async ({ lang }: ILangProps) => {
  const dict = await getDictionary(lang);

  const [ingredients, meals, mealPlans] = await Promise.all([
    fetchIngredients({}),
    fetchMeals({}),
    fetchMealPlans({}),
  ]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatisticsCard
        title={dict.dashboard.statistics.totalIngredients}
        value={ingredients.data.length}
        icon={<ShoppingBasket />}
      />
      <StatisticsCard
        title={dict.dashboard.statistics.totalMeals}
        value={meals.data.length}
        icon={<HandPlatter />}
      />
      <StatisticsCard
        title={dict.dashboard.statistics.totalMealPlans}
        value={mealPlans.data.length}
        icon={<NotebookPen />}
      />
      <StatisticsCard
        title={dict.dashboard.statistics.totalRecipes}
        value={100}
        icon={<CookingPot />}
      />
    </section>
  );
};

export default Statistics;

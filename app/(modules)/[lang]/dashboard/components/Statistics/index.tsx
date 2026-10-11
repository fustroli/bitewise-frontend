import StatisticsCards from '@/app/(modules)/[lang]/dashboard/components/Statistics/StatisticsCards';
import { TDictionary } from '@/app/providers/dictionary-provider';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

interface IProps {
  labels: TDictionary['dashboard']['statistics'];
}

const Statistics = async ({ labels }: IProps) => {
  const [ingredients, meals, mealPlans] = await Promise.all([
    fetchIngredients({}),
    fetchMeals({}),
    fetchMealPlans({}),
  ]);

  return (
    <StatisticsCards
      labels={labels}
      counts={{
        ingredients: ingredients.count,
        meals: meals.count,
        mealPlans: mealPlans.count,
      }}
    />
  );
};

export default Statistics;

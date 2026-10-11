import { HandPlatter, NotebookPen, ShoppingBasket } from 'lucide-react';

import { IStatistics } from '@/app/(modules)/[lang]/dashboard/interfaces';
import StatisticsCard from '@/app/(modules)/[lang]/dashboard/components/Statistics/StatisticsCard';
import { TDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  labels: TDictionary['dashboard']['statistics'];
  /** Left out while loading: the cards show skeleton values. */
  counts?: IStatistics;
}

/** The three count cards, shared by the loaded section and its skeleton. */
const StatisticsCards = ({ labels, counts }: IProps) => {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <StatisticsCard
        title={labels.totalIngredients}
        value={counts?.ingredients}
        icon={<ShoppingBasket />}
      />
      <StatisticsCard
        title={labels.totalMeals}
        value={counts?.meals}
        icon={<HandPlatter />}
      />
      <StatisticsCard
        title={labels.totalMealPlans}
        value={counts?.mealPlans}
        icon={<NotebookPen />}
      />
    </section>
  );
};

export default StatisticsCards;

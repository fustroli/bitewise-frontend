import StatisticsCards from '@/app/(modules)/[lang]/dashboard/components/Statistics/StatisticsCards';
import { TDictionary } from '@/app/providers/dictionary-provider';
import { fetchStatistics } from '@/app/(modules)/[lang]/dashboard/api';

interface IProps {
  labels: TDictionary['dashboard']['statistics'];
}

const Statistics = async ({ labels }: IProps) => {
  const counts = await fetchStatistics();

  return <StatisticsCards labels={labels} counts={counts} />;
};

export default Statistics;

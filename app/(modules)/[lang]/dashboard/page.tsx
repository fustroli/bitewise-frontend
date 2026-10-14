import BodyMetrics from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics';
import DraftMealPlanSection from '@/app/(modules)/[lang]/dashboard/components/DraftMealPlan';
import DraftMealPlanSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlanSkeleton';
import { IPageProps } from '@/app/utils/interfaces';
import PageHeader from '@/app/components/layout/PageHeader';
import Statistics from '@/app/(modules)/[lang]/dashboard/components/Statistics';
import StatisticsCards from '@/app/(modules)/[lang]/dashboard/components/Statistics/StatisticsCards';
import { Suspense } from 'react';
import { getDictionary } from '@/app/i18n/dictionaries';

/**
 * The fetched sections stream in behind skeletons of their own layout;
 * BodyMetrics reads the User from context, so it renders at once. Suspense
 * catches no errors: a failed fetch still reaches `error.tsx`.
 */
export default async function Page(props: IPageProps) {
  const { lang } = await props.params;
  const { dashboard } = await getDictionary(lang);
  const labels = dashboard.statistics;

  return (
    <>
      <PageHeader title={dashboard.sidebar.dashboard} />
      <Suspense fallback={<StatisticsCards labels={labels} />}>
        <Statistics labels={labels} />
      </Suspense>
      <Suspense fallback={<DraftMealPlanSkeleton />}>
        <DraftMealPlanSection lang={lang} />
      </Suspense>
      <BodyMetrics />
    </>
  );
}

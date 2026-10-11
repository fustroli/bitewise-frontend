import BodyMetrics from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics';
import DraftMealPlanSection from '@/app/(modules)/[lang]/dashboard/components/DraftMealPlan';
import DraftMealPlanSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlanSkeleton';
import { IPageProps } from '@/app/utils/interfaces';
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
  const labels = (await getDictionary(lang)).dashboard.statistics;

  return (
    <div className="space-y-6 px-4 pb-8 md:px-8">
      <Suspense fallback={<StatisticsCards labels={labels} />}>
        <Statistics labels={labels} />
      </Suspense>
      <Suspense fallback={<DraftMealPlanSkeleton />}>
        <DraftMealPlanSection lang={lang} />
      </Suspense>
      <BodyMetrics />
    </div>
  );
}

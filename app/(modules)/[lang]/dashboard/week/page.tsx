import { IPageProps } from '@/app/utils/interfaces';
import PageHeader from '@/app/components/layout/PageHeader';
import PlansSwitch from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/PlansSwitch';
import { Suspense } from 'react';
import WeekPlanActions from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/components/WeekPlanActions';
import { WeekPlanProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/provider';
import WeekPlanSection from '@/app/(modules)/[lang]/dashboard/week/components/WeekPlanSection';
import WeekPlanSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/components/WeekPlanSkeleton';
import { getDictionary } from '@/app/i18n/dictionaries';

/** The Week plan: kept in this browser, its Meals and Ingredients fetched. */
export default async function Page(props: IPageProps) {
  const { lang } = await props.params;
  const { weekPlan } = await getDictionary(lang);

  return (
    <WeekPlanProvider mealPlansHref={`/${lang}/dashboard/meal-plans`}>
      <PageHeader
        title={weekPlan.title}
        description={weekPlan.description}
        actions={<WeekPlanActions variant="buttons" />}
        mobileActions={<WeekPlanActions variant="icon" />}
      />
      <PlansSwitch />
      <Suspense fallback={<WeekPlanSkeleton />}>
        <WeekPlanSection lang={lang} />
      </Suspense>
    </WeekPlanProvider>
  );
}

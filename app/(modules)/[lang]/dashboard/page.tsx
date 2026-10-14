import DraftActions from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftActions';
import { DraftMealPlanProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/provider';
import DraftMealPlanSection from '@/app/(modules)/[lang]/dashboard/components/DraftMealPlanSection';
import DraftMealPlanSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlanSkeleton';
import { IPageProps } from '@/app/utils/interfaces';
import Library from '@/app/(modules)/[lang]/dashboard/components/Library/Library';
import LibrarySection from '@/app/(modules)/[lang]/dashboard/components/Library';
import Overview from '@/app/(modules)/[lang]/dashboard/components/Overview';
import PageHeader from '@/app/components/layout/PageHeader';
import { Suspense } from 'react';
import UserMenuLink from '@/app/(modules)/[lang]/dashboard/components/UserMenuLink';
import { getDictionary } from '@/app/i18n/dictionaries';

/**
 * The fetched sections stream in behind skeletons of their own layout; the
 * Overview reads the User from context, so it renders at once. Suspense
 * catches no errors: a failed fetch still reaches `error.tsx`.
 */
export default async function Page(props: IPageProps) {
  const { lang } = await props.params;
  const { dashboard } = await getDictionary(lang);

  return (
    <DraftMealPlanProvider mealPlansHref={`/${lang}/dashboard/meal-plans`}>
      <PageHeader
        title={dashboard.sidebar.dashboard}
        description={dashboard.description}
        actions={<DraftActions />}
        mobileActions={<UserMenuLink />}
      />
      <Overview
        afterSummary={
          <Suspense fallback={<DraftMealPlanSkeleton />}>
            <DraftMealPlanSection lang={lang} />
          </Suspense>
        }
      />
      <Suspense fallback={<Library />}>
        <LibrarySection />
      </Suspense>
    </DraftMealPlanProvider>
  );
}

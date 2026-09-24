import { IPageProps } from '@/app/utils/interfaces';
import MealPlansLoading from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlansLoading';
import MealPlansTable from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlansTable';
import { Suspense } from 'react';

export default async function Page(props: IPageProps) {
  const pageKey = JSON.stringify(await props.searchParams);

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 md:px-8">
      <section className="flex flex-col gap-4">
        <Suspense key={pageKey} fallback={<MealPlansLoading />}>
          <MealPlansTable {...props} />
        </Suspense>
      </section>
    </div>
  );
}

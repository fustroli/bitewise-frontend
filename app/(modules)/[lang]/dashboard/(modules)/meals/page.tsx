import { IPageProps } from '@/app/utils/interfaces';
import MealsLoading from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealsLoading';
import MealsTable from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealsTable';
import { Suspense } from 'react';

export default async function Page(props: IPageProps) {
  const pageKey = JSON.stringify(await props.searchParams);

  return (
    <div className="p-2 md:p-4 xl:p-8">
      <section className="flex flex-col gap-4">
        <Suspense key={pageKey} fallback={<MealsLoading />}>
          <MealsTable {...props} />
        </Suspense>
      </section>
    </div>
  );
}

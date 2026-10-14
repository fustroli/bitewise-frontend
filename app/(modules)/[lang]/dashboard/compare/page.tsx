import ComparisonButtons from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/components/ComparisonButtons';
import { IPageProps } from '@/app/utils/interfaces';
import PageHeader from '@/app/components/layout/PageHeader';
import { getDictionary } from '@/app/i18n/dictionaries';

export default async function Page(props: IPageProps) {
  const { lang } = await props.params;
  const { comparison } = await getDictionary(lang);

  return (
    <>
      <PageHeader
        title={comparison.page.title}
        description={comparison.page.description}
      />
      <div className="flex gap-3">
        <ComparisonButtons triggerClassName="relative size-11 border bg-card" />
      </div>
    </>
  );
}

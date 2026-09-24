import { IPageProps } from '@/app/utils/interfaces';
import Statistics from '@/app/(modules)/[lang]/dashboard/components/Statistics';

export default async function Page(props: IPageProps) {
  const { lang } = await props.params;

  return (
    <div className="px-4 pb-8 md:px-8">
      <Statistics lang={lang} />
    </div>
  );
}

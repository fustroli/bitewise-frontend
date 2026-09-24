import { IPageProps } from '@/app/utils/interfaces';
import Statistics from '@/app/(modules)/[lang]/dashboard/components/Statistics';

export default async function Page(props: IPageProps) {
  const { lang } = await props.params;

  return (
    <div className="p-6">
      <Statistics lang={lang} />
    </div>
  );
}

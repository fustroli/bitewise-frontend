import { IPageProps } from '@/app/utils/interfaces';
import ResourcePage from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourcePage';
import { mealList } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/resource/list';

export default function Page(props: IPageProps) {
  return <ResourcePage resource={mealList} {...props} />;
}

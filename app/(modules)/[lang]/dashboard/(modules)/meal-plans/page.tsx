import { IPageProps } from '@/app/utils/interfaces';
import ResourcePage from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourcePage';
import { mealPlanList } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/resource/list';

export default function Page(props: IPageProps) {
  return <ResourcePage resource={mealPlanList} {...props} />;
}

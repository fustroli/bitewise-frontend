import { IPageProps } from '@/app/utils/interfaces';
import ResourcePage from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourcePage';
import { ingredientList } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/resource/list';

export default function Page(props: IPageProps) {
  return <ResourcePage resource={ingredientList} {...props} />;
}

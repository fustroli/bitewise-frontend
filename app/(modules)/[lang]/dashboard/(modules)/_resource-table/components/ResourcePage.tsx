import {
  IResourceList,
  IResourceRecord,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import {
  getResourceLabels,
  toListQuery,
  toSuspenseKey,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';

import { DEFAULT_PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { IPageProps } from '@/app/utils/interfaces';
import ResourceTable from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceTable';
import ResourceTableSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceTableSkeleton';
import { Suspense } from 'react';
import { getDictionary } from '@/app/i18n/dictionaries';

interface IProps<
  TRecord extends IResourceRecord,
  TFormData,
> extends IPageProps {
  resource: IResourceList<TRecord, TFormData>;
}

/** A whole list page: skeleton while loading, then the resource's table. */
async function ResourcePage<TRecord extends IResourceRecord, TFormData>({
  resource,
  params,
  searchParams,
}: IProps<TRecord, TFormData>) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  const dictionary = await getDictionary(lang);
  const pageSize = resource.pageSize ?? DEFAULT_PAGE_SIZE;

  return (
    <div className="px-4 pb-8 md:px-8">
      <section className="flex flex-col gap-4">
        <Suspense
          key={toSuspenseKey(query)}
          fallback={
            <ResourceTableSkeleton
              columns={resource.columns}
              labels={getResourceLabels(dictionary, resource.resourceKey)}
              sort={toListQuery(query, pageSize).sort}
              pageSize={pageSize}
            />
          }
        >
          <ResourceTable
            resource={resource}
            searchParams={query}
            dictionary={dictionary}
          />
        </Suspense>
      </section>
    </div>
  );
}

export default ResourcePage;

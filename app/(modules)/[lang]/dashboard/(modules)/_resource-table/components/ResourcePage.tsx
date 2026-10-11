import {
  IResourceList,
  IResourceRecord,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import {
  ResourceSearchPending,
  ResourceSearchProvider,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceSearchProvider';
import {
  getResourceLabels,
  toListQuery,
  toSuspenseKey,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';

import { DEFAULT_PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { IPageProps } from '@/app/utils/interfaces';
import ResourceSearch from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceSearch';
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

/**
 * A whole list page: the search bar, then a skeleton while loading and the
 * resource's table. The search bar sits outside Suspense so it keeps focus.
 */
async function ResourcePage<TRecord extends IResourceRecord, TFormData>({
  resource,
  params,
  searchParams,
}: IProps<TRecord, TFormData>) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  const dictionary = await getDictionary(lang);
  const pageSize = resource.pageSize ?? DEFAULT_PAGE_SIZE;
  const { sort, search } = toListQuery(query, pageSize);

  return (
    <div className="px-4 pb-8 md:px-8">
      <ResourceSearchProvider search={search} sort={sort}>
        <section className="flex flex-col gap-4">
          {resource.searchable && (
            <ResourceSearch resourceKey={resource.resourceKey} />
          )}
          <ResourceSearchPending>
            <Suspense
              key={toSuspenseKey(query)}
              fallback={
                <ResourceTableSkeleton
                  columns={resource.columns}
                  labels={getResourceLabels(dictionary, resource.resourceKey)}
                  sort={sort}
                  search={search}
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
          </ResourceSearchPending>
        </section>
      </ResourceSearchProvider>
    </div>
  );
}

export default ResourcePage;

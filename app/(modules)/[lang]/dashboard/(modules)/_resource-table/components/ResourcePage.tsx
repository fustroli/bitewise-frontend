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
import PageHeader from '@/app/components/layout/PageHeader';
import ResourceHeaderActions from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceHeaderActions';
import ResourceList from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceList';
import ResourceListSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceListSkeleton';
import ResourceSearch from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceSearch';
import { Suspense } from 'react';
import { getDictionary } from '@/app/i18n/dictionaries';

interface IProps<
  TRecord extends IResourceRecord,
  TFormData,
> extends IPageProps {
  resource: IResourceList<TRecord, TFormData>;
}

/**
 * A whole list page: the header with Compare and Add, the search bar, then a
 * skeleton while loading and the list. The search bar sits outside Suspense
 * so it keeps focus. The form data loads once, for the Add dialog and rows.
 */
async function ResourcePage<TRecord extends IResourceRecord, TFormData>({
  resource,
  params,
  searchParams,
}: IProps<TRecord, TFormData>) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  const dictionary = await getDictionary(lang);
  const pageSize = resource.pageSize ?? DEFAULT_PAGE_SIZE;
  const { sort, search } = toListQuery(query, resource.columns, pageSize);
  const labels = getResourceLabels(dictionary, resource.resourceKey);
  const formData = (resource.loadFormData?.() ??
    Promise.resolve(undefined)) as Promise<TFormData>;
  const Toolbar = resource.toolbar;

  const headerActions = (variant: 'buttons' | 'icon') => (
    <ResourceHeaderActions
      resource={resource}
      formData={formData}
      compareLabel={labels.compare}
      addLabel={labels.addTitle}
      lang={lang}
      variant={variant}
    />
  );

  return (
    <>
      <PageHeader
        title={labels.title}
        description={labels.description}
        actions={headerActions('buttons')}
        mobileActions={headerActions('icon')}
      />
      <ResourceSearchProvider search={search} sort={sort}>
        {/* Pulls the list up to the header: a list page is one block. */}
        <section className="-mt-2 flex flex-col gap-4 md:-mt-6">
          {(resource.searchable || Toolbar) && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {resource.searchable && (
                <ResourceSearch resourceKey={resource.resourceKey} />
              )}
              {Toolbar && <Toolbar />}
            </div>
          )}
          <ResourceSearchPending>
            <Suspense
              key={toSuspenseKey(query, resource.columns)}
              fallback={
                <ResourceListSkeleton
                  layout={resource.layout}
                  gridClassName={resource.gridClassName}
                  pageSize={pageSize}
                />
              }
            >
              <ResourceList
                resource={resource}
                searchParams={query}
                dictionary={dictionary}
                lang={lang}
                formData={formData}
              />
            </Suspense>
          </ResourceSearchPending>
        </section>
      </ResourceSearchProvider>
    </>
  );
}

export default ResourcePage;

import {
  IResourceList,
  IResourceRecord,
  IResourceRowContext,
  TSearchParams,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { Table, TableBody } from '@/app/components/ui/table';
import {
  getResourceLabels,
  toListQuery,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';

import ClearSearchButton from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ClearSearchButton';
import { DEFAULT_PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import EmptyState from '@/app/components/EmptyState';
import { Fragment } from 'react';
import ResourceFooter from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceFooter';
import ResourceTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceTableHead';
import { TDictionary } from '@/app/providers/dictionary-provider';
import { interpolate } from '@/app/utils/helpers';

interface IProps<TRecord extends IResourceRecord, TFormData> {
  resource: IResourceList<TRecord, TFormData>;
  searchParams: TSearchParams | undefined;
  dictionary: TDictionary;
  lang: string;
  formData: Promise<TFormData>;
}

/** One page of a resource's records, as a table or a card grid. */
async function ResourceList<TRecord extends IResourceRecord, TFormData>({
  resource,
  searchParams,
  dictionary,
  lang,
  formData: formDataPromise,
}: IProps<TRecord, TFormData>) {
  const { dialog: Dialog, rowActions: RowActions, columns } = resource;
  const pageSize = resource.pageSize ?? DEFAULT_PAGE_SIZE;
  const { page, sort, search, params } = toListQuery(
    searchParams,
    columns,
    pageSize,
  );

  const [{ data: rows, count }, formData] = await Promise.all([
    resource.fetch(params),
    formDataPromise,
  ]);

  const labels = getResourceLabels(dictionary, resource.resourceKey);
  const tableLabels = dictionary.resourceTable;

  const context = (row: TRecord): IResourceRowContext => ({
    dictionary,
    labels,
    tableLabels,
    actions: <RowActions record={row} formData={formData} />,
    edit: <Dialog record={row} formData={formData} trigger="outline" />,
    compareHref: `/${lang}/dashboard/compare?type=${resource.compareType}&ids=${row.id}`,
    lang,
  });

  const empty = search ? (
    <EmptyState
      title={interpolate(labels.noMatch, { term: search })}
      action={<ClearSearchButton />}
    />
  ) : (
    <EmptyState title={labels.empty} />
  );

  const footer = !!rows.length && (
    <ResourceFooter
      page={page}
      pageSize={pageSize}
      total={count}
      shown={rows.length}
      sort={sort}
      search={search}
      labels={tableLabels}
      className={resource.layout === 'table' ? 'border-t px-5 py-3.5' : ''}
    />
  );

  if (resource.layout === 'cards') {
    return (
      <>
        {rows.length ? (
          <ul aria-label={labels.title} className={resource.gridClassName}>
            {rows.map((row) => (
              <li key={row.id} className="flex">
                {resource.renderRow(row, context(row))}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border bg-card">{empty}</div>
        )}
        {footer}
      </>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {rows.length ? (
        <>
          <div
            className={
              resource.renderMobileRow
                ? 'hidden overflow-x-auto md:block'
                : 'overflow-x-auto'
            }
          >
            <Table aria-label={labels.title} className="min-w-[860px]">
              <ResourceTableHead
                columns={columns}
                labels={labels}
                sort={sort}
                search={search}
                actionsLabel={tableLabels.actions}
              />
              <TableBody>
                {rows.map((row) => (
                  <Fragment key={row.id}>
                    {resource.renderRow(row, context(row))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          {resource.renderMobileRow && (
            <ul aria-label={labels.title} className="divide-y md:hidden">
              {rows.map((row) => (
                <Fragment key={row.id}>
                  {resource.renderMobileRow!(row, context(row))}
                </Fragment>
              ))}
            </ul>
          )}
        </>
      ) : (
        empty
      )}
      {footer}
    </div>
  );
}

export default ResourceList;

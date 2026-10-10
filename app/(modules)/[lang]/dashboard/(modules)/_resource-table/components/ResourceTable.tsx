import {
  IResourceList,
  IResourceRecord,
  TSearchParams,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import {
  getPageMetadata,
  getResourceLabels,
  toListQuery,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';

import { DEFAULT_PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import EmptyTable from '@/app/components/EmptyTable';
import { Fragment } from 'react';
import ResourcePagination from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourcePagination';
import ResourceTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceTableHead';
import { TDictionary } from '@/app/providers/dictionary-provider';
import { TableBody } from '@/app/components/ui/table';
import TableFrame from '@/app/components/Table/TableFrame';

interface IProps<TRecord extends IResourceRecord, TFormData> {
  resource: IResourceList<TRecord, TFormData>;
  searchParams: TSearchParams | undefined;
  dictionary: TDictionary;
}

async function ResourceTable<TRecord extends IResourceRecord, TFormData>({
  resource,
  searchParams,
  dictionary,
}: IProps<TRecord, TFormData>) {
  const { dialog: Dialog, rowActions: RowActions, columns } = resource;
  const pageSize = resource.pageSize ?? DEFAULT_PAGE_SIZE;
  const { page, sort, params } = toListQuery(searchParams, pageSize);

  const [{ data: rows, count }, formData] = await Promise.all([
    resource.fetch(params),
    resource.loadFormData?.() as Promise<TFormData>,
  ]);

  const labels = getResourceLabels(dictionary, resource.resourceKey);
  const tableLabels = dictionary.resourceTable;

  return (
    <>
      <TableFrame
        title={`${labels.title} (${count})`}
        tableHead={
          <ResourceTableHead columns={columns} labels={labels} sort={sort} />
        }
        addModal={<Dialog formData={formData} />}
      >
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <Fragment key={row.id}>
                {resource.renderRow(row, {
                  labels,
                  tableLabels,
                  actions: <RowActions record={row} formData={formData} />,
                })}
              </Fragment>
            ))
          ) : (
            <EmptyTable colSpan={columns.length + 1}>{labels.empty}</EmptyTable>
          )}
        </TableBody>
      </TableFrame>
      {!!rows.length && (
        <ResourcePagination
          page={page}
          sort={sort}
          labels={tableLabels}
          {...getPageMetadata(page, pageSize, count)}
        />
      )}
    </>
  );
}

export default ResourceTable;

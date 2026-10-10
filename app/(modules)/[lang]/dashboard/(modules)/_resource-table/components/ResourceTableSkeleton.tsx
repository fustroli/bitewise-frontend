import {
  IResourceColumn,
  IResourceLabels,
  ISortState,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { TableBody, TableCell, TableRow } from '@/app/components/ui/table';

import ResourceTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceTableHead';
import { Skeleton } from '@/app/components/ui/skeleton';
import TableFrame from '@/app/components/Table/TableFrame';
import { cn } from '@/app/lib';

interface IProps {
  columns: IResourceColumn[];
  labels: IResourceLabels;
  sort: ISortState;
  pageSize: number;
}

/** One skeleton row per page slot, one cell per head column. */
const ResourceTableSkeleton = ({ columns, labels, sort, pageSize }: IProps) => {
  const rows = Array.from({ length: pageSize });

  return (
    <TableFrame
      title={labels.title}
      tableHead={
        <ResourceTableHead columns={columns} labels={labels} sort={sort} />
      }
      addModal={<div className="h-9" />}
    >
      <TableBody>
        {rows.map((_, rowIndex) => (
          <TableRow
            key={rowIndex}
            className="block border-b text-left last:border-b-0 lg:table-row lg:border-none"
          >
            {columns.map((column) => (
              <TableCell
                key={column.id}
                className="block px-4 py-2.5 lg:table-cell lg:py-4"
              >
                <div className={cn('flex', column.align)}>
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </TableCell>
            ))}
            <TableCell className="w-36" />
          </TableRow>
        ))}
      </TableBody>
    </TableFrame>
  );
};

export default ResourceTableSkeleton;

import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import {
  IResourceColumn,
  IResourceLabels,
  ISortState,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { TableHead, TableHeader, TableRow } from '@/app/components/ui/table';

import { EOrderDirection } from '@/app/utils/enums';
import Link from 'next/link';
import { buildSortHref } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';
import { cn } from '@/app/lib';

interface IProps {
  columns: IResourceColumn[];
  labels: IResourceLabels;
  sort: ISortState;
}

const ResourceTableHead = ({ columns, labels, sort }: IProps) => {
  const Icon =
    sort.orderDirection === EOrderDirection.ASC ? ArrowDownAZ : ArrowUpAZ;

  return (
    <TableHeader className="hidden uppercase lg:table-header-group">
      <TableRow>
        {columns.map((column) => {
          const isActive = column.id === sort.orderBy;
          const className = cn(
            'flex items-center gap-1',
            column.align,
            isActive && 'text-primary',
          );

          return (
            <TableHead key={column.id}>
              {column.sortable ? (
                <Link
                  href={buildSortHref(sort, column.id)}
                  className={cn(
                    className,
                    'transition-colors duration-200 hover:text-primary',
                  )}
                >
                  {labels.columns[column.id]}
                  {isActive && <Icon size={16} />}
                </Link>
              ) : (
                <span className={className}>{labels.columns[column.id]}</span>
              )}
            </TableHead>
          );
        })}
        <TableHead />
      </TableRow>
    </TableHeader>
  );
};

export default ResourceTableHead;

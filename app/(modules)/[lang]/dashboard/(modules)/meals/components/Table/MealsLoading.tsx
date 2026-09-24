import { TableBody, TableCell, TableRow } from '@/app/components/ui/table';

import MealTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealTableHead';
import MealsLoadingCell from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealsLoadingCell';
import { PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/constants';
import { Skeleton } from '@/app/components/ui/skeleton';
import TableFrame from '@/app/components/Table/TableFrame';

const MealsLoading = () => {
  const rows = Array.from({ length: PAGE_SIZE });

  return (
    <TableFrame
      title="Meals"
      tableHead={<MealTableHead />}
      addModal={<div className="h-9" />}
    >
      <TableBody>
        {rows.map((_, index) => (
          <TableRow
            key={index}
            className="block border-b text-left last:border-b-0 lg:table-row lg:border-none"
          >
            <TableCell className="block px-4 py-2 text-foreground lg:table-cell lg:py-4 lg:text-right">
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-4/5" />
            </TableCell>
            <MealsLoadingCell />
            <MealsLoadingCell />
            <MealsLoadingCell />
            <MealsLoadingCell />
            <MealsLoadingCell />

            <TableCell className="block px-4 py-2 text-foreground lg:table-cell lg:py-4 lg:text-right">
              <div className="flex lg:justify-end">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-10" />
              </div>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableFrame>
  );
};

export default MealsLoading;

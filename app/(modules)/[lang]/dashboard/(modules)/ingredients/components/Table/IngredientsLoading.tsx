import { TableBody, TableCell, TableRow } from '@/app/components/ui/table';

import { INGREDTENTS_PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/constants';
import IngredientTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/Table/IngredientTableHead';
import IngredientsLoadingCell from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/Table/IngredientsLoadingCell';
import { Skeleton } from '@/app/components/ui/skeleton';
import TableFrame from '@/app/components/Table/TableFrame';

const IngredientsLoading = () => {
  const rows = Array.from({ length: INGREDTENTS_PAGE_SIZE });

  return (
    <TableFrame
      title="Ingredients"
      tableHead={<IngredientTableHead />}
      addModal={<div className="h-9" />}
    >
      <TableBody>
        {rows.map((_, index) => (
          <TableRow
            key={index}
            className="block border-b text-left last:border-b-0 lg:table-row lg:border-none"
          >
            <TableCell className="block px-4 py-2 text-foreground lg:table-cell lg:w-[28%] lg:py-4.5 lg:text-right">
              <Skeleton className="h-4 w-2/3" />
            </TableCell>
            <IngredientsLoadingCell />
            <IngredientsLoadingCell />
            <IngredientsLoadingCell />
            <IngredientsLoadingCell />
            <IngredientsLoadingCell />

            <TableCell className="block px-4 py-2.5 text-foreground lg:table-cell lg:py-4 lg:text-right">
              <div className="flex lg:justify-end">
                <Skeleton className="h-4 w-10" />
              </div>
            </TableCell>
            <TableCell className="w-36"></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableFrame>
  );
};

export default IngredientsLoading;

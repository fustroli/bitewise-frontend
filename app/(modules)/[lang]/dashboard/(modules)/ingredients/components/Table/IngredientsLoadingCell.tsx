import { Skeleton } from '@/app/components/ui/skeleton';
import { TableCell } from '@/app/components/ui/table';

const IngredientsLoadingCell = () => {
  return (
    <TableCell className="block px-4 py-2.5 text-foreground lg:table-cell lg:py-4 lg:text-right">
      <div className="flex justify-end">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </TableCell>
  );
};

export default IngredientsLoadingCell;

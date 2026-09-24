import { Skeleton } from '@/app/components/ui/skeleton';
import { TableCell } from '@/app/components/ui/table';

const MealsLoadingCell = () => {
  return (
    <TableCell className="block px-4 py-2 text-foreground lg:table-cell lg:py-4 lg:text-right">
      <div className="flex flex-col gap-1 lg:items-end">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </TableCell>
  );
};

export default MealsLoadingCell;

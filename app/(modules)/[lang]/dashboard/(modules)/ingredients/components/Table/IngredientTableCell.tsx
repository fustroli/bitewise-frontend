import { TableCell } from '@/app/components/ui/table';
import { cn } from '@/app/lib';

interface IProps {
  className?: string;
  rowName: string;
  rowValue: string | React.ReactNode;
}
const IngredientTableCell = ({ className, rowValue, rowName }: IProps) => {
  return (
    <TableCell
      className={cn(
        'block px-4 py-2 text-foreground lg:table-cell lg:text-right',
        className,
      )}
    >
      <span className="font-semibold text-muted-foreground lg:hidden">
        {rowName}:{' '}
      </span>
      {rowValue}
    </TableCell>
  );
};

export default IngredientTableCell;

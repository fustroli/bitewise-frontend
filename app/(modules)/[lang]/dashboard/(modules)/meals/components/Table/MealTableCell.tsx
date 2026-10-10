import { ReactNode } from 'react';
import { TableCell } from '@/app/components/ui/table';
import { cn } from '@/app/lib';

interface IProps {
  lines: { key: number; content: ReactNode }[];
  total?: string;
  footer?: ReactNode;
  className?: string;
}

const MealTableCell = ({ lines, total, footer, className }: IProps) => (
  <TableCell
    className={cn(
      'mx-2 flex items-center gap-2 px-2 py-2 text-foreground lg:table-cell lg:py-4 lg:text-right',
      className,
    )}
  >
    {lines.map(({ key, content }) => (
      <div key={key} className="flex-1 px-2 pb-1">
        {content}
      </div>
    ))}
    {total !== undefined ? (
      <div className="rounded-md bg-secondary px-2 py-1 font-semibold text-secondary-foreground">
        {total}
      </div>
    ) : (
      <div className="flex-1"></div>
    )}
    {footer}
  </TableCell>
);

export default MealTableCell;

import { TableCell } from '@/app/components/ui/table';

interface IProps {
  lines: { key: number; content: string }[];
  total: string;
}
const MealPlanTableCell = ({ lines, total }: IProps) => (
  <TableCell className="mx-2 flex items-center gap-2 p-2 text-foreground lg:table-cell lg:py-4 lg:text-right">
    <div className="flex flex-col gap-2">
      {lines.map(({ key, content }) => (
        <div key={key} className="px-1 lg:px-2">
          {content}
        </div>
      ))}
      <div className="rounded-md bg-secondary px-2 py-1 font-semibold text-secondary-foreground">
        {total}
      </div>
    </div>
  </TableCell>
);

export default MealPlanTableCell;

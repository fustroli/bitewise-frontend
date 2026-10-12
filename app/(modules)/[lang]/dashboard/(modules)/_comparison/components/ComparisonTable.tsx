import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

import { Button } from '@/app/components/ui/button';
import { COMPARISON_NUTRITION_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/constants';
import { IComparisonRow } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import { X } from 'lucide-react';
import { formatNutrition } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/helpers';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  rows: IComparisonRow[];
  onRemove: (id: number) => void;
}

const ComparisonTable = ({ rows, onRemove }: IProps) => {
  const t = useDictionary().comparison;
  const showUnit = rows.some((row) => row.unit !== undefined);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.columns.name}</TableHead>
          {COMPARISON_NUTRITION_COLUMNS.map(({ nutrient }) => (
            <TableHead key={nutrient} className="text-right">
              {t.columns[nutrient]}
            </TableHead>
          ))}
          {showUnit && (
            <TableHead className="text-right">{t.columns.unit}</TableHead>
          )}
          <TableHead>
            <span className="sr-only">{t.columns.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-semibold">{row.name}</TableCell>
            {COMPARISON_NUTRITION_COLUMNS.map((column) => (
              <TableCell key={column.nutrient} className="text-right">
                {formatNutrition(row, column)}
              </TableCell>
            ))}
            {showUnit && (
              <TableCell className="text-right">{row.unit}</TableCell>
            )}
            <TableCell className="text-right">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground"
                aria-label={interpolate(t.removeItem, { name: row.name })}
                onClick={() => onRemove(row.id)}
              >
                <X />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ComparisonTable;

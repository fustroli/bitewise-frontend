'use client';

import { TableCell, TableHead } from '@/app/components/ui/table';

import { INutrition } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';
import { MacroSwatch } from '@/app/components/nutrition/MacroLegend';
import MacroValue from '@/app/components/nutrition/MacroValue';
import { NUTRITION_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import { cn } from '@/app/lib';
import { formatNutrition } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/helpers';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useParams } from 'next/navigation';

/** The draft table's nutrition headers, macro colours on P / C / F. */
export const DraftNutritionHeads = () => {
  const { columns } = useDictionary().draftMealPlan;

  return NUTRITION_COLUMNS.map(({ nutrient, swatch }) => (
    <TableHead key={nutrient} className="whitespace-nowrap text-right">
      <span className="inline-flex items-center gap-1.5">
        {swatch && <MacroSwatch macro={swatch} />}
        {columns[nutrient as keyof typeof columns]}
      </span>
    </TableHead>
  ));
};

interface IProps {
  nutrition: INutrition;
  /** The total row: bold amounts. */
  isTotal?: boolean;
}

/** A line's (or the total's) nutrition: bold amount, sugar / saturated under. */
const DraftNutritionCells = ({ nutrition, isTotal }: IProps) => {
  const { columns } = useDictionary().draftMealPlan;
  const { lang } = useParams<{ lang: string }>();

  return NUTRITION_COLUMNS.map((column) => {
    const { value, sub } = formatNutrition(nutrition, column, lang);

    return (
      <TableCell
        key={column.nutrient}
        className={cn('whitespace-nowrap pt-4', isTotal && 'font-extrabold')}
      >
        <MacroValue
          value={value}
          unit={column.unit}
          sub={
            sub && column.subNutrient
              ? interpolate(columns[column.subNutrient], { value: sub })
              : undefined
          }
          align="end"
        />
      </TableCell>
    );
  });
};

export default DraftNutritionCells;

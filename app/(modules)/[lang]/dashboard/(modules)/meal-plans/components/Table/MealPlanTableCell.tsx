import React, { useMemo } from 'react';
import {
  calculateMealValue,
  flatMealIngredients,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/helpers';

import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { TableCell } from '@/app/components/ui/table';
import { calculateColumnSum } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/helpers';

interface IProps {
  meals: IMeal[];
  column: string;
  subColumn?: string;
  unit?: string;
}
const MealPlanTableCell = ({ meals, column, unit, subColumn }: IProps) => {
  const mealValues = useMemo(() => {
    return meals.map((meal) => calculateMealValue(meal, column, subColumn));
  }, [meals, column, subColumn]);

  const flatIngredients = flatMealIngredients(meals);

  const mainValue = useMemo(
    () => calculateColumnSum(flatIngredients, column),
    [flatIngredients, column],
  );

  return (
    <TableCell className="mx-2 flex items-center gap-2 p-2 text-foreground lg:table-cell lg:py-4 lg:text-right">
      <div className="flex flex-col gap-2">
        {mealValues.map((value, index) => (
          <div key={index} className="px-1 lg:px-2">
            {value[0]} {value[1] > 0 && <span>({value[1]})</span>}
            {unit && <span>{unit}</span>}
          </div>
        ))}
        <div className="rounded-md bg-secondary px-2 py-1 font-semibold text-secondary-foreground">
          {mainValue} {unit && <span>{unit}</span>}
        </div>
      </div>
    </TableCell>
  );
};

export default MealPlanTableCell;

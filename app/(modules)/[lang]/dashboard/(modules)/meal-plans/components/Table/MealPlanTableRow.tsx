import { TableCell, TableRow } from '@/app/components/ui/table';
import {
  formatNutrition,
  mealNutrition,
  mealPlanNutrition,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/helpers';

import { IMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import MealPlanTableCell from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanTableCell';
import { NUTRITION_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import { ReactNode } from 'react';

interface IProps {
  row: IMealPlan;
  actions: ReactNode;
}

const MealPlanTableRow = ({ row, actions }: IProps) => {
  const { meals } = row;
  const mealsNutrition = meals.map((meal) => ({
    key: meal.id,
    nutrition: mealNutrition(meal),
  }));
  const total = mealPlanNutrition(row);

  return (
    <TableRow>
      <TableCell className="mx-2 flex items-center gap-2 p-2 text-foreground lg:table-cell lg:py-4">
        <div className="flex flex-col gap-2">
          {meals.map((meal) => (
            <div key={meal.id} className="px-1 lg:px-2">
              {meal.name}
            </div>
          ))}
          <div className="rounded-md bg-primary px-2 py-1 font-semibold text-primary-foreground">
            {row.name}
          </div>
        </div>
      </TableCell>
      {NUTRITION_COLUMNS.map((column) => (
        <MealPlanTableCell
          key={column.nutrient}
          lines={mealsNutrition.map(({ key, nutrition }) => ({
            key,
            content: formatNutrition(nutrition, column),
          }))}
          total={formatNutrition(total, column)}
        />
      ))}

      <TableCell className="mx-2 flex items-center gap-2 p-2 text-foreground lg:table-cell lg:py-4 lg:text-right">
        {actions}
      </TableCell>
    </TableRow>
  );
};

export default MealPlanTableRow;

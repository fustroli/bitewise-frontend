import { TableCell, TableRow } from '@/app/components/ui/table';

import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import MealPlanTableCell from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanTableCell';
import { ReactNode } from 'react';

interface IProps {
  row: IMealPlan;
  actions: ReactNode;
}

const MealPlanTableRow = ({ row, actions }: IProps) => {
  const { meals } = row;
  return (
    <TableRow>
      <TableCell className="mx-2 flex items-center gap-2 p-2 text-foreground lg:table-cell lg:py-4">
        <div className="flex flex-col gap-2">
          {meals.map((meal: IMeal, index) => (
            <div key={index} className="px-1 lg:px-2">
              {meal.name}
            </div>
          ))}
          <div className="rounded-md bg-primary px-2 py-1 font-semibold text-primary-foreground">
            {row.name}
          </div>
        </div>
      </TableCell>
      <MealPlanTableCell meals={meals} column="calories" unit="kcal" />
      <MealPlanTableCell meals={meals} column="protein" unit="g" />
      <MealPlanTableCell
        meals={meals}
        column="totalFat"
        subColumn="saturatedFat"
        unit="g"
      />
      <MealPlanTableCell
        meals={meals}
        column="totalCarbohydrates"
        subColumn="sugar"
        unit="g"
      />
      <MealPlanTableCell meals={meals} column="dietaryFiber" unit="g" />

      <TableCell className="mx-2 flex items-center gap-2 p-2 text-foreground lg:table-cell lg:py-4 lg:text-right">
        {actions}
      </TableCell>
    </TableRow>
  );
};

export default MealPlanTableRow;

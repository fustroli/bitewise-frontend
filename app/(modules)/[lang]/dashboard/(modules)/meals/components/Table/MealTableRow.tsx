import { TableCell, TableRow } from '@/app/components/ui/table';

import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import MealTableCell from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealTableCell';
import { ReactNode } from 'react';
import Unit from '@/app/(modules)/[lang]/dashboard/components/Unit';

interface IProps {
  row: IMeal;
  actions: ReactNode;
}

const MealTableRow = ({ row, actions }: IProps) => {
  const { mealIngredients } = row;

  return (
    <TableRow>
      <MealTableCell
        mealIngredients={mealIngredients}
        column="ingredientName"
        className="lg:text-left"
        mealName={row.name}
      />

      <MealTableCell
        mealIngredients={mealIngredients}
        column="calories"
        unit="kcal"
      />
      <MealTableCell
        mealIngredients={mealIngredients}
        column="protein"
        unit="g"
      />
      <MealTableCell
        mealIngredients={mealIngredients}
        column="totalFat"
        subColumn="saturatedFat"
        unit="g"
      />
      <MealTableCell
        mealIngredients={mealIngredients}
        column="totalCarbohydrates"
        subColumn="sugar"
        unit="g"
      />
      <MealTableCell
        mealIngredients={mealIngredients}
        column="dietaryFiber"
        unit="g"
      />
      <MealTableCell mealIngredients={mealIngredients} column="quantity" />
      <TableCell className="flex items-center gap-2 lg:table-cell lg:text-right">
        {mealIngredients.map((mealIngredient) => (
          <div
            key={mealIngredient.id}
            className="block flex-1 lg:flex lg:justify-end"
          >
            <Unit unit={mealIngredient.unit} />
          </div>
        ))}
        <div className="h-7"></div>
      </TableCell>

      <TableCell className="block text-right lg:table-cell">
        {actions}
      </TableCell>
    </TableRow>
  );
};

export default MealTableRow;

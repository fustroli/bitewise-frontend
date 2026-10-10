import { TableCell, TableRow } from '@/app/components/ui/table';
import {
  formatNutrition,
  mealIngredientNutrition,
  mealNutrition,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/helpers';

import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import MealTableCell from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealTableCell';
import { NUTRITION_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import { ReactNode } from 'react';
import Unit from '@/app/(modules)/[lang]/dashboard/components/Unit';

interface IProps {
  row: IMeal;
  actions: ReactNode;
}

const MealTableRow = ({ row, actions }: IProps) => {
  const { mealIngredients } = row;
  const ingredientsNutrition = mealIngredients.map((mealIngredient) => ({
    key: mealIngredient.id,
    nutrition: mealIngredientNutrition(mealIngredient),
  }));
  const total = mealNutrition(row);

  return (
    <TableRow>
      <MealTableCell
        lines={mealIngredients.map(({ id, ingredientName }) => ({
          key: id,
          content: ingredientName,
        }))}
        className="lg:text-left"
        footer={
          <div className="flex-1 rounded-md bg-primary px-2 py-1 font-semibold text-primary-foreground">
            {row.name}
          </div>
        }
      />

      {NUTRITION_COLUMNS.map((column) => (
        <MealTableCell
          key={column.nutrient}
          lines={ingredientsNutrition.map(({ key, nutrition }) => ({
            key,
            content: formatNutrition(nutrition, column),
          }))}
          total={formatNutrition(total, column)}
        />
      ))}

      <MealTableCell
        lines={mealIngredients.map(({ id, quantity }) => ({
          key: id,
          content: quantity,
        }))}
        footer={<div className="h-7"></div>}
      />
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

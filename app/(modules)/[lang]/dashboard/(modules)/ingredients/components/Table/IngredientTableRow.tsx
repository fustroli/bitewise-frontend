import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IResourceRowContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import IngredientTableCell from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/Table/IngredientTableCell';
import { TableRow } from '@/app/components/ui/table';
import Unit from '@/app/(modules)/[lang]/dashboard/components/Unit';

interface IProps extends IResourceRowContext {
  row: IIngredient;
}

const IngredientTableRow = ({ row, labels, tableLabels, actions }: IProps) => {
  const { columns } = labels;

  return (
    <TableRow className="block border-b text-left last:border-b-0 lg:table-row lg:border-none">
      <IngredientTableCell
        rowName={columns.name}
        className="lg:text-left lg:font-semibold"
        rowValue={row.name}
      />
      <IngredientTableCell
        rowName={columns.calories}
        rowValue={`${row.calories} kcal`}
      />

      <IngredientTableCell
        rowName={columns.protein}
        rowValue={`${row.protein} g`}
      />

      <IngredientTableCell
        rowName={columns.totalFat}
        rowValue={`${row.totalFat} (${row.saturatedFat}) g`}
      />

      <IngredientTableCell
        rowName={columns.totalCarbohydrates}
        rowValue={`${row.totalCarbohydrates} (${row.sugar}) g`}
      />

      <IngredientTableCell
        rowName={columns.dietaryFiber}
        rowValue={`${row.dietaryFiber} g`}
      />
      <IngredientTableCell
        rowName={columns.unit}
        className="flex items-center gap-1"
        rowValue={
          <div className="block justify-end lg:flex">
            <Unit unit={row.unit} />
          </div>
        }
      />
      <IngredientTableCell
        rowName={tableLabels.actions}
        className="flex justify-end text-right"
        rowValue={actions}
      />
    </TableRow>
  );
};

export default IngredientTableRow;

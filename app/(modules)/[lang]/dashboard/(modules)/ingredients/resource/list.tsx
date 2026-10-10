import 'server-only';

import {
  IngredientDialog,
  IngredientRowActions,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/resource/form';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { INGREDIENT_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/constants';
import { IResourceList } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import IngredientTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/Table/IngredientTableRow';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';

export const ingredientList: IResourceList<IIngredient> = {
  resourceKey: 'ingredients',
  fetch: fetchIngredients,
  columns: INGREDIENT_COLUMNS,
  renderRow: (row, context) => <IngredientTableRow row={row} {...context} />,
  dialog: IngredientDialog,
  rowActions: IngredientRowActions,
};

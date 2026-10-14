import 'server-only';

import {
  IngredientDialog,
  IngredientRowActions,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/resource/form';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { INGREDIENT_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/constants';
import { IResourceList } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import IngredientListItem from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/Table/IngredientListItem';
import IngredientTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/Table/IngredientTableRow';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';

export const ingredientList: IResourceList<IIngredient> = {
  resourceKey: 'ingredients',
  fetch: fetchIngredients,
  layout: 'table',
  columns: INGREDIENT_COLUMNS,
  compareType: EComparisonKind.INGREDIENTS,
  searchable: true,
  renderRow: (row, context) => <IngredientTableRow row={row} {...context} />,
  renderMobileRow: (row, { lang, edit, compareHref }) => (
    <IngredientListItem
      row={row}
      lang={lang}
      edit={edit}
      compareHref={compareHref}
    />
  ),
  dialog: IngredientDialog,
  rowActions: IngredientRowActions,
};

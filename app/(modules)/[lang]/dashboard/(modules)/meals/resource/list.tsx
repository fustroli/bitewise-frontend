import 'server-only';

import {
  MEALS_PAGE_SIZE,
  MEAL_COLUMNS,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/constants';
import {
  MealDialog,
  MealRowActions,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/resource/form';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IResourceList } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { MAX_LIST_LIMIT } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import MealTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealTableRow';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

export const mealList: IResourceList<IMeal, IIngredient[]> = {
  resourceKey: 'meals',
  fetch: fetchMeals,
  columns: MEAL_COLUMNS,
  pageSize: MEALS_PAGE_SIZE,
  loadFormData: async () =>
    (await fetchIngredients({ limit: MAX_LIST_LIMIT })).data,
  renderRow: (row, { actions }) => <MealTableRow row={row} actions={actions} />,
  dialog: MealDialog,
  rowActions: MealRowActions,
};

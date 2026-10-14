import 'server-only';

import {
  MealDialog,
  MealRowActions,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/resource/form';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IResourceList } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { MAX_LIST_LIMIT } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { MEAL_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/constants';
import MacroLegendToolbar from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/MacroLegendToolbar';
import MealCard from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Card/MealCard';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

export const mealList: IResourceList<IMeal, IIngredient[]> = {
  resourceKey: 'meals',
  fetch: fetchMeals,
  layout: 'cards',
  gridClassName:
    'grid items-start gap-4 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]',
  columns: MEAL_COLUMNS,
  compareType: 'meals',
  searchable: true,
  toolbar: MacroLegendToolbar,
  loadFormData: async () =>
    (await fetchIngredients({ limit: MAX_LIST_LIMIT })).data,
  renderRow: (row, context) => <MealCard meal={row} {...context} />,
  dialog: MealDialog,
  rowActions: MealRowActions,
};

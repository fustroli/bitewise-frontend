import 'server-only';

import {
  MealDialog,
  MealRowActions,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/resource/form';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IIngredientOption } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IResourceList } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { MEAL_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/constants';
import MacroLegendToolbar from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/MacroLegendToolbar';
import MealCard from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Card/MealCard';
import { fetchIngredientOptions } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

export const mealList: IResourceList<IMeal, IIngredientOption[]> = {
  resourceKey: 'meals',
  fetch: fetchMeals,
  layout: 'cards',
  gridClassName:
    'grid items-start gap-4 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]',
  columns: MEAL_COLUMNS,
  compareType: EComparisonKind.MEALS,
  searchable: true,
  toolbar: MacroLegendToolbar,
  loadFormData: fetchIngredientOptions,
  renderRow: (row, context) => <MealCard meal={row} {...context} />,
  dialog: MealDialog,
  rowActions: MealRowActions,
};

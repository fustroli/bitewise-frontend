import 'server-only';

import {
  MealPlanDialog,
  MealPlanRowActions,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/resource/form';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { IResourceList } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { MAX_LIST_LIMIT } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { MEAL_PLAN_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/constants';
import MealPlanTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanTableRow';
import { fetchMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

export const mealPlanList: IResourceList<IMealPlan, IMeal[]> = {
  resourceKey: 'mealPlans',
  fetch: fetchMealPlans,
  layout: 'table',
  compareType: 'plans',
  columns: MEAL_PLAN_COLUMNS,
  searchable: true,
  loadFormData: async () => (await fetchMeals({ limit: MAX_LIST_LIMIT })).data,
  renderRow: (row, { actions }) => (
    <MealPlanTableRow row={row} actions={actions} />
  ),
  dialog: MealPlanDialog,
  rowActions: MealPlanRowActions,
};

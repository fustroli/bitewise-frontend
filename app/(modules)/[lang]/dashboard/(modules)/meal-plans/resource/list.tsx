import 'server-only';

import {
  MealPlanDialog,
  MealPlanRowActions,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/resource/form';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IMealOption } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { IResourceList } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { MEAL_PLAN_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/constants';
import MealPlanCard from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Card/MealPlanCard';
import MealPlanTargetsNote from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/MealPlanTargetsNote';
import { PROFILE_SECTION_IDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/constants';
import PlansSwitch from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/PlansSwitch';
import { fetchMealOptions } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';
import { fetchMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/api';

export const mealPlanList: IResourceList<IMealPlan, IMealOption[]> = {
  resourceKey: 'mealPlans',
  fetch: fetchMealPlans,
  layout: 'cards',
  gridClassName: 'flex flex-col gap-4',
  columns: MEAL_PLAN_COLUMNS,
  compareType: EComparisonKind.MEAL_PLANS,
  searchable: true,
  header: PlansSwitch,
  toolbar: MealPlanTargetsNote,
  loadFormData: fetchMealOptions,
  renderRow: (row, context) => (
    <MealPlanCard
      mealPlan={row}
      bodyStatsHref={`/${context.lang}/dashboard/profile#${PROFILE_SECTION_IDS.bodyStats}`}
      {...context}
    />
  ),
  dialog: MealPlanDialog,
  rowActions: MealPlanRowActions,
};

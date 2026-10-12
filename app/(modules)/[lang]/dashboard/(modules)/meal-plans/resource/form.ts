'use client';

import {
  ICreateMealPlan,
  IMealPlan,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import {
  TMealPlanSchema,
  createMealPlanSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/validations';
import {
  createMealPlan,
  deleteMealPlan,
  updateMealPlan,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/actions';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import MealPlanComparisonAction from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/MealPlanComparisonAction';
import MealPlanFields from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/MealPlanFields';
import { createResourceForm } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/createResourceForm';
import { useComparisonRemoval } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/context';

const useMealPlanRemoval = () =>
  useComparisonRemoval(EComparisonKind.MEAL_PLANS);

const mealPlanForm = createResourceForm<IMealPlan, TMealPlanSchema, IMeal[]>({
  resourceKey: 'mealPlans',
  schema: createMealPlanSchema,
  defaultValues: { name: '', mealIds: [] },
  toFormValues: (mealPlan) => ({
    name: mealPlan.name,
    mealIds: mealPlan.meals.map((meal) => meal.id),
  }),
  fields: MealPlanFields,
  create: createMealPlan,
  update: (values, id) => updateMealPlan(values as ICreateMealPlan, id),
  remove: deleteMealPlan,
  rowMenuItem: MealPlanComparisonAction,
  useAfterRemove: useMealPlanRemoval,
});

export const MealPlanDialog = mealPlanForm.Dialog;
export const MealPlanRowActions = mealPlanForm.RowActions;

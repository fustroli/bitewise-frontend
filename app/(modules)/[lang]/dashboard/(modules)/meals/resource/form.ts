'use client';

import {
  ICreateMeal,
  IMeal,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import {
  TMealSchema,
  createMealSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/validations';
import {
  createMeal,
  deleteMeal,
  updateMeal,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/actions';

import { DEFAULT_MEAL } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/constants';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import MealFields from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/MealFields';
import { createResourceForm } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/createResourceForm';

const mealForm = createResourceForm<IMeal, TMealSchema, IIngredient[]>({
  resourceKey: 'meals',
  schema: createMealSchema,
  defaultValues: DEFAULT_MEAL,
  toFormValues: (meal) => ({
    name: meal.name,
    mealIngredients: meal.mealIngredients.map(({ ingredientId, quantity }) => ({
      ingredientId,
      quantity,
    })),
  }),
  fields: MealFields,
  create: (values, userId) => createMeal({ ...values, userId }),
  update: (values, id) => updateMeal(values as ICreateMeal, id),
  remove: deleteMeal,
});

export const MealDialog = mealForm.Dialog;
export const MealRowActions = mealForm.RowActions;

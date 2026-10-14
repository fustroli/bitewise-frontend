'use client';

import {
  ICreateIngredient,
  IIngredient,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import {
  TIngredientSchema,
  createIngredientSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/validations';
import {
  createIngredient,
  deleteIngredient,
  updateIngredient,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/actions';

import { DEFAULT_INGREDIENT_VALUES } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/constants';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import IngredientFields from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/IngredientFields';
import { createResourceForm } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/createResourceForm';

const ingredientForm = createResourceForm<IIngredient, TIngredientSchema>({
  resourceKey: 'ingredients',
  schema: createIngredientSchema,
  defaultValues: DEFAULT_INGREDIENT_VALUES,
  toFormValues: (ingredient) => ({
    name: ingredient.name,
    protein: ingredient.protein,
    totalFat: ingredient.totalFat,
    saturatedFat: ingredient.saturatedFat,
    totalCarbohydrates: ingredient.totalCarbohydrates,
    sugar: ingredient.sugar,
    dietaryFiber: ingredient.dietaryFiber,
    calories: ingredient.calories,
    unit: ingredient.unit,
  }),
  fields: IngredientFields,
  create: (values) => createIngredient(values as ICreateIngredient),
  update: (values, id) => updateIngredient(values as ICreateIngredient, id),
  remove: deleteIngredient,
  compareType: EComparisonKind.INGREDIENTS,
});

export const IngredientDialog = ingredientForm.Dialog;
export const IngredientRowActions = ingredientForm.RowActions;

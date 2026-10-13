import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { TStoredDraft } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/validations';

/** The User's Meals and Ingredients that draft lines refer to by id. */
export interface IDraftSources {
  meals: IMeal[];
  ingredients: IIngredient[];
}

export interface IResolvedDraft {
  draft: TStoredDraft;
  /** How many lines were dropped because their Meal or Ingredient is gone. */
  removed: number;
}

/** A Meal plan the draft can be loaded from. */
export interface IDraftMealPlanOption {
  id: number;
  name: string;
  mealIds: number[];
}

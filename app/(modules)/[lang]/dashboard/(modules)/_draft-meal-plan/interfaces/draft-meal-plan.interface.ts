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

export interface IDraftMealPlanContext {
  /** The stored draft: `undefined` until read on the client, `null` for none. */
  stored: TStoredDraft | null | undefined;
  /** Bumped by every load, so a mounted editor starts over from the store. */
  loads: number;
  start: () => void;
  save: (draft: TStoredDraft) => void;
  load: (draft: TStoredDraft) => void;
  clear: () => void;
  /** Opens the Load meal plan dialog, optionally with a plan picked. */
  openLoad: (mealPlanId?: number) => void;
  mealPlansHref: string;
}

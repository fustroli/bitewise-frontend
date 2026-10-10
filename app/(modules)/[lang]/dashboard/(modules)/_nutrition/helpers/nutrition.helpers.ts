import {
  DISPLAY_DECIMALS,
  EMPTY_NUTRITION,
  GRAMS_PER_UNIT,
  NUTRIENTS,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import {
  INutrition,
  INutritionAmount,
  INutritionColumn,
  INutritionMeal,
  INutritionMealPlan,
  TNutrient,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';

import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';

const mapNutrition = (value: (nutrient: TNutrient) => number): INutrition =>
  NUTRIENTS.reduce(
    (nutrition, nutrient) => ({ ...nutrition, [nutrient]: value(nutrient) }),
    EMPTY_NUTRITION,
  );

const scaleNutrition = (nutrition: INutrition, scale: number) =>
  mapNutrition((nutrient) => nutrition[nutrient] * scale);

const sumNutrition = (items: INutrition[]) =>
  items.reduce(
    (total, item) =>
      mapNutrition((nutrient) => total[nutrient] + item[nutrient]),
    EMPTY_NUTRITION,
  );

/** Quantity is grams for 100 g Ingredients and a count for piece Ingredients. */
export const mealIngredientNutrition = (
  mealIngredient: INutritionAmount,
): INutrition =>
  scaleNutrition(
    mealIngredient,
    mealIngredient.unit === EUnit.PIECE
      ? mealIngredient.quantity
      : mealIngredient.quantity / GRAMS_PER_UNIT,
  );

export const mealNutrition = (meal: INutritionMeal): INutrition =>
  sumNutrition(meal.mealIngredients.map(mealIngredientNutrition));

export const mealPlanNutrition = (mealPlan: INutritionMealPlan): INutrition =>
  sumNutrition(mealPlan.meals.map(mealNutrition));

const formatAmount = (value: number) =>
  String(Number(value.toFixed(DISPLAY_DECIMALS)));

/** Rounds only for display, e.g. `12.5 (3.1) g` or `450 kcal`. */
export const formatNutrition = (
  nutrition: INutrition,
  { nutrient, subNutrient, unit }: INutritionColumn,
) =>
  [
    formatAmount(nutrition[nutrient]),
    subNutrient && `(${formatAmount(nutrition[subNutrient])})`,
    unit,
  ]
    .filter(Boolean)
    .join(' ');

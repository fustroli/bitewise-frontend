import {
  DEFAULT_MEAL_MULTIPLIER,
  DRAFT_STORAGE_VERSION,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/constants';
import {
  IDraftSources,
  IResolvedDraft,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import {
  TDraftLine,
  TStoredDraft,
  storedDraftSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/validations';
import {
  mealIngredientNutrition,
  mealNutrition,
  scaleNutrition,
  sumNutrition,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/helpers';

import { EDraftLineKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/enums';
import { EMPTY_NUTRITION } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';
import { INutrition } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';
import { formatCalories } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';

/** Per User, since localStorage is shared by everyone using the browser. */
export const draftStorageKey = (userId: number) =>
  `bitewise:draft-meal-plan:v${DRAFT_STORAGE_VERSION}:${userId}`;

export const EMPTY_DRAFT: TStoredDraft = {
  version: DRAFT_STORAGE_VERSION,
  collapsed: false,
  lines: [],
};

/** `null` when there is no draft, or it is unreadable or another version. */
export const parseDraft = (raw: string | null): TStoredDraft | null => {
  if (raw === null) return null;
  try {
    const result = storedDraftSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const serializeDraft = (draft: TStoredDraft) => JSON.stringify(draft);

/** A copy of a Meal plan as a draft: one serving of each of its Meals. */
export const mealPlanDraft = (mealIds: number[]): TStoredDraft => ({
  ...EMPTY_DRAFT,
  lines: mealIds.map((itemId) => ({
    kind: EDraftLineKind.MEAL,
    itemId,
    quantity: DEFAULT_MEAL_MULTIPLIER,
  })),
});

const findMeal = (id: number, { meals }: IDraftSources) =>
  meals.find((meal) => meal.id === id);

const findIngredient = (id: number, { ingredients }: IDraftSources) =>
  ingredients.find((ingredient) => ingredient.id === id);

const lineExists = ({ kind, itemId }: TDraftLine, sources: IDraftSources) =>
  kind === EDraftLineKind.MEAL
    ? Boolean(findMeal(itemId, sources))
    : Boolean(findIngredient(itemId, sources));

/** Drops lines whose Meal or Ingredient no longer exists; unpicked lines stay. */
export const resolveDraft = (
  draft: TStoredDraft,
  sources: IDraftSources,
): IResolvedDraft => {
  const lines = draft.lines.filter(
    (line) => line.itemId === 0 || lineExists(line, sources),
  );
  return {
    draft: { ...draft, lines },
    removed: draft.lines.length - lines.length,
  };
};

/** The Unit an Ingredient line's amount is in; unset for a Meal or unpicked line. */
export const draftLineUnit = (
  { kind, itemId }: TDraftLine,
  sources: IDraftSources,
): EUnit | undefined =>
  kind === EDraftLineKind.INGREDIENT
    ? findIngredient(itemId, sources)?.unit
    : undefined;

/**
 * A line's Nutrition at full precision: a Meal's scaled by its multiplier, an
 * Ingredient's by its amount (grams per 100 g, or pieces). An unpicked line or
 * an emptied quantity counts as 0.
 */
export const draftLineNutrition = (
  { kind, itemId, quantity }: TDraftLine,
  sources: IDraftSources,
): INutrition => {
  const amount = quantity ?? 0;

  if (kind === EDraftLineKind.MEAL) {
    const meal = findMeal(itemId, sources);
    return meal ? scaleNutrition(mealNutrition(meal), amount) : EMPTY_NUTRITION;
  }

  const ingredient = findIngredient(itemId, sources);
  return ingredient
    ? mealIngredientNutrition({ ...ingredient, quantity: amount })
    : EMPTY_NUTRITION;
};

export const draftNutrition = (
  lines: TDraftLine[],
  sources: IDraftSources,
): INutrition =>
  sumNutrition(lines.map((line) => draftLineNutrition(line, sources)));

/** Signed and rounded like a Calorie target, e.g. `+620` or `-150`. */
export const formatCalorieDelta = (delta: number, locale: string) => {
  const rounded = Math.round(delta);
  return `${rounded > 0 ? '+' : ''}${formatCalories(rounded, locale)}`;
};

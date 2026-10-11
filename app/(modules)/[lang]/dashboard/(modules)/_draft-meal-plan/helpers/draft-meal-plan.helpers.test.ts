import {
  EMPTY_DRAFT,
  draftLineNutrition,
  draftNutrition,
  draftStorageKey,
  formatCalorieDelta,
  maintenanceDelta,
  parseDraft,
  resolveDraft,
  serializeDraft,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/helpers';
import {
  TDraftLine,
  TStoredDraft,
  createDraftSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/validations';
import { describe, expect, it } from 'vitest';

import { EDraftLineKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/enums';
import { EMPTY_NUTRITION } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';
import { ICalories } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';
import { IDraftSources } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import en from '@/app/i18n/locales/en.json';

const ingredient = (
  id: number,
  unit: EUnit,
  nutrition: Partial<IIngredient>,
): IIngredient => ({
  ...EMPTY_NUTRITION,
  id,
  name: `Ingredient ${id}`,
  unit,
  createTimeStamp: new Date(0),
  updateTimeStamp: new Date(0),
  deleteTimeStamp: null,
  ...nutrition,
});

const OATS = ingredient(1, EUnit.HUNDRED_GRAMS, { calories: 380, protein: 13 });
const EGG = ingredient(2, EUnit.PIECE, { calories: 70, protein: 6 });

// 50 g oats (190 kcal) + 1 egg (70 kcal) = 260 kcal.
const PORRIDGE: IMeal = {
  id: 10,
  name: 'Porridge',
  mealIngredients: [
    {
      ...OATS,
      id: 100,
      ingredientId: OATS.id,
      ingredientName: OATS.name,
      quantity: 50,
    },
    {
      ...EGG,
      id: 101,
      ingredientId: EGG.id,
      ingredientName: EGG.name,
      quantity: 1,
    },
  ],
};

const SOURCES: IDraftSources = { meals: [PORRIDGE], ingredients: [OATS, EGG] };

const line = (
  kind: EDraftLineKind,
  itemId: number,
  quantity: number | null,
): TDraftLine => ({ kind, itemId, quantity });

const draft = (lines: TDraftLine[]): TStoredDraft => ({
  ...EMPTY_DRAFT,
  lines,
});

describe('draftStorageKey', () => {
  it('is per User and versioned', () => {
    expect(draftStorageKey(7)).toBe('bitewise:draft-meal-plan:v1:7');
  });
});

describe('parseDraft', () => {
  it('reads back a serialized draft', () => {
    const stored = draft([line(EDraftLineKind.MEAL, 10, 1.5)]);

    expect(parseDraft(serializeDraft(stored))).toEqual(stored);
  });

  it('is null without a draft', () => {
    expect(parseDraft(null)).toBeNull();
  });

  it.each([
    ['not JSON', '{oops'],
    ['another version', JSON.stringify({ ...EMPTY_DRAFT, version: 2 })],
    [
      'a wrong shape',
      JSON.stringify({ ...EMPTY_DRAFT, lines: [{ kind: 'pizza', itemId: 1 }] }),
    ],
  ])('discards %s', (_, raw) => {
    expect(parseDraft(raw)).toBeNull();
  });

  it('keeps lines as edited, emptied quantities included', () => {
    const stored = draft([line(EDraftLineKind.INGREDIENT, 0, null)]);

    expect(parseDraft(serializeDraft(stored))).toEqual(stored);
  });
});

describe('resolveDraft', () => {
  it('drops lines whose Meal or Ingredient no longer exists', () => {
    const { draft: resolved, removed } = resolveDraft(
      draft([
        line(EDraftLineKind.MEAL, 10, 1),
        line(EDraftLineKind.MEAL, 99, 1),
        line(EDraftLineKind.INGREDIENT, 2, 3),
        line(EDraftLineKind.INGREDIENT, 98, 100),
      ]),
      SOURCES,
    );

    expect(resolved.lines).toEqual([
      line(EDraftLineKind.MEAL, 10, 1),
      line(EDraftLineKind.INGREDIENT, 2, 3),
    ]);
    expect(removed).toBe(2);
  });

  it('looks a line up among its own kind', () => {
    // 1 is an Ingredient id, not a Meal id.
    expect(
      resolveDraft(draft([line(EDraftLineKind.MEAL, 1, 1)]), SOURCES).removed,
    ).toBe(1);
  });

  it('keeps unpicked lines', () => {
    expect(
      resolveDraft(draft([line(EDraftLineKind.MEAL, 0, 1)]), SOURCES).removed,
    ).toBe(0);
  });
});

describe('draftLineNutrition', () => {
  it('scales a Meal by its multiplier', () => {
    // Porridge: 50 g oats (190 kcal) + 1 egg (70 kcal) = 260 kcal.
    expect(
      draftLineNutrition(line(EDraftLineKind.MEAL, 10, 1.5), SOURCES).calories,
    ).toBe(390);
  });

  it('scales a 100 g Ingredient by grams / 100 and a piece by the count', () => {
    expect(
      draftLineNutrition(line(EDraftLineKind.INGREDIENT, 1, 250), SOURCES)
        .calories,
    ).toBe(950);
    expect(
      draftLineNutrition(line(EDraftLineKind.INGREDIENT, 2, 3), SOURCES)
        .protein,
    ).toBe(18);
  });

  it('counts an emptied quantity or an unpicked line as 0', () => {
    expect(
      draftLineNutrition(line(EDraftLineKind.MEAL, 10, null), SOURCES),
    ).toEqual(EMPTY_NUTRITION);
    expect(
      draftLineNutrition(line(EDraftLineKind.INGREDIENT, 0, 100), SOURCES),
    ).toEqual(EMPTY_NUTRITION);
  });
});

describe('draftNutrition', () => {
  it('sums its lines', () => {
    const total = draftNutrition(
      [line(EDraftLineKind.MEAL, 10, 2), line(EDraftLineKind.INGREDIENT, 2, 1)],
      SOURCES,
    );

    expect(total.calories).toBe(590);
    expect(total.protein).toBeCloseTo(31);
  });

  it('is all zeros without lines', () => {
    expect(draftNutrition([], SOURCES)).toEqual(EMPTY_NUTRITION);
  });
});

describe('maintenanceDelta', () => {
  const calories = { maintenance: 2200 } as ICalories;

  it('is the kcal over or under Maintenance calories', () => {
    expect(maintenanceDelta(2820, calories)).toBe(620);
    expect(maintenanceDelta(2050, calories)).toBe(-150);
  });

  it('is unset without Maintenance calories', () => {
    expect(maintenanceDelta(2820)).toBeUndefined();
  });
});

describe('formatCalorieDelta', () => {
  it('signs and rounds', () => {
    expect(formatCalorieDelta(620.4, 'en')).toBe('+620');
    expect(formatCalorieDelta(-150, 'en')).toBe('-150');
    expect(formatCalorieDelta(0.3, 'en')).toBe('0');
  });
});

describe('createDraftSchema', () => {
  const schema = createDraftSchema(en);
  const { validation } = en.draftMealPlan;

  const messages = (lines: TDraftLine[]) =>
    schema.safeParse({ lines }).error?.issues.map(({ message }) => message) ??
    [];

  it('accepts complete lines', () => {
    expect(
      messages([
        line(EDraftLineKind.MEAL, 10, 1.5),
        line(EDraftLineKind.INGREDIENT, 1, 37),
      ]),
    ).toEqual([]);
  });

  it('flags an unpicked line and an emptied quantity', () => {
    expect(messages([line(EDraftLineKind.INGREDIENT, 0, null)])).toEqual([
      validation.itemRequired,
      validation.quantityPositive,
    ]);
  });

  it('takes Meal multipliers in steps of 0.5', () => {
    expect(messages([line(EDraftLineKind.MEAL, 10, 1.25)])).toEqual([
      validation.multiplierStep,
    ]);
  });
});

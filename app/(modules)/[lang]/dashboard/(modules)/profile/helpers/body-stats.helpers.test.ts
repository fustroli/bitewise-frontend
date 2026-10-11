import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import {
  TBodyStatsSchema,
  createBodyStatsSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import { describe, expect, it } from 'vitest';
import { toBodyStatsChange, toBodyStatsFormValues } from './body-stats.helpers';

import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { TDictionary } from '@/app/providers/dictionary-provider';
import en from '@/app/i18n/locales/en.json';

const schema = createBodyStatsSchema(en as TDictionary);

const VALID: TBodyStatsSchema = {
  sex: ESex.FEMALE,
  heightCm: 170,
  weightKg: 62.5,
  activityLevel: EActivityLevel.LIGHT,
};

const USER: IUser = { id: 1, email: 'a@b.c', bodyStats: VALID };

const errorFor = (values: Partial<TBodyStatsSchema>) => {
  const result = schema.safeParse({ ...VALID, ...values });
  return result.success ? undefined : result.error.issues[0].message;
};

describe('Body stats validation', () => {
  it('accepts valid Body stats', () => {
    expect(errorFor({})).toBeUndefined();
  });

  it('accepts every field unset', () => {
    expect(
      errorFor({
        sex: null,
        heightCm: null,
        weightKg: null,
        activityLevel: null,
      }),
    ).toBeUndefined();
  });

  it.each([100, 250])('accepts a height of %s cm', (heightCm) => {
    expect(errorFor({ heightCm })).toBeUndefined();
  });

  it.each([99, 251])('rejects a height of %s cm', (heightCm) => {
    expect(errorFor({ heightCm })).toBe(
      'Height must be between 100 and 250 cm',
    );
  });

  it('rejects a height with decimals', () => {
    expect(errorFor({ heightCm: 170.5 })).toBe(en.validation.wholeNumber);
  });

  it.each([30, 300, 72.3])('accepts a weight of %s kg', (weightKg) => {
    expect(errorFor({ weightKg })).toBeUndefined();
  });

  it.each([29.9, 300.1])('rejects a weight of %s kg', (weightKg) => {
    expect(errorFor({ weightKg })).toBe('Weight must be between 30 and 300 kg');
  });

  it('rejects a weight with two decimals', () => {
    expect(errorFor({ weightKg: 72.35 })).toBe(en.validation.oneDecimal);
  });
});

describe('Body stats change', () => {
  it('starts every unset field as null', () => {
    expect(toBodyStatsFormValues({ id: 1, email: 'a@b.c' })).toEqual({
      sex: null,
      heightCm: null,
      weightKg: null,
      activityLevel: null,
    });
  });

  it('contains only the fields that changed', () => {
    expect(toBodyStatsChange({ ...VALID, weightKg: 61 }, USER)).toEqual({
      bodyStats: { weightKg: 61 },
    });
  });

  it('sends an emptied field as null', () => {
    expect(toBodyStatsChange({ ...VALID, heightCm: null }, USER)).toEqual({
      bodyStats: { heightCm: null },
    });
  });

  it('sends nothing when nothing changed', () => {
    expect(toBodyStatsChange(toBodyStatsFormValues(USER), USER)).toEqual({
      bodyStats: {},
    });
  });
});

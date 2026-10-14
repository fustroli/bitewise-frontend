import {
  comparisonSearch,
  formatDelta,
  parseComparisonQuery,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/helpers';
import { describe, expect, it } from 'vitest';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';

describe('parseComparisonQuery', () => {
  it('reads the kind and the slots', () => {
    expect(parseComparisonQuery({ type: 'meals', ids: '4,7' })).toEqual({
      kind: EComparisonKind.MEALS,
      ids: [4, 7],
    });
  });

  it('keeps an empty middle slot', () => {
    expect(parseComparisonQuery({ type: 'plans', ids: '4,,9' }).ids).toEqual([
      4,
      null,
      9,
    ]);
  });

  it.each([undefined, 'snacks', ['meals', 'plans']])(
    'falls back for the type %j',
    (type) => {
      const { kind } = parseComparisonQuery({ type });

      expect(kind).toBe(
        Array.isArray(type)
          ? EComparisonKind.MEALS
          : EComparisonKind.INGREDIENTS,
      );
    },
  );

  it('drops what is not an id and anything past three', () => {
    expect(parseComparisonQuery({ ids: 'x,1.5,3,4' }).ids).toEqual([
      null,
      null,
      3,
    ]);
    expect(parseComparisonQuery({ ids: 'x,-2' }).ids).toEqual([]);
    expect(parseComparisonQuery({ ids: '1,2,3,4' }).ids).toEqual([1, 2, 3]);
  });

  it('has no slots without ids', () => {
    expect(parseComparisonQuery({}).ids).toEqual([]);
  });
});

describe('comparisonSearch', () => {
  it('writes what it reads, without trailing empty slots', () => {
    expect(
      comparisonSearch({ kind: EComparisonKind.MEALS, ids: [4, null, null] }),
    ).toBe('?type=meals&ids=4');
    expect(
      comparisonSearch({ kind: EComparisonKind.MEALS, ids: [4, null, 9] }),
    ).toBe('?type=meals&ids=4%2C%2C9');
    expect(comparisonSearch({ kind: EComparisonKind.MEALS, ids: [] })).toBe(
      '?type=meals',
    );
  });
});

describe('formatDelta', () => {
  it.each([
    [12.34, 'g', 1, '+12.3 g'],
    [-200.4, 'kcal', 0, '−200 kcal'],
    [1500, 'kcal', 0, '+1,500 kcal'],
    [0.04, 'g', 1, 'same'],
    [-0.2, 'kcal', 0, 'same'],
  ])('formats %d %s', (diff, unit, decimals, text) => {
    expect(formatDelta(diff, unit, decimals, 'en', 'same')).toBe(text);
  });
});

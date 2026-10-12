import {
  EMPTY_COMPARISON,
  comparisonStorageKey,
  parseComparison,
  serializeComparison,
  toggleId,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/helpers';
import { describe, expect, it } from 'vitest';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';

describe('comparisonStorageKey', () => {
  it('is per User and version', () => {
    expect(comparisonStorageKey(7)).toBe('bitewise:comparison:v1:7');
  });
});

describe('parseComparison', () => {
  it('round-trips what it serializes', () => {
    const stored = { ...EMPTY_COMPARISON, [EComparisonKind.MEALS]: [1, 2] };
    expect(parseComparison(serializeComparison(stored))).toEqual(stored);
  });

  it.each([
    ['nothing stored', null],
    ['not yet read', undefined],
    ['not JSON', '{'],
    ['the wrong shape', '{"ingredients":"1"}'],
    ['more than 3 ids', '{"ingredients":[1,2,3,4],"meals":[],"mealPlans":[]}'],
    ['duplicate ids', '{"ingredients":[1,1],"meals":[],"mealPlans":[]}'],
    ['invalid ids', '{"ingredients":[0],"meals":[],"mealPlans":[]}'],
  ])('is empty for %s', (_, raw) => {
    expect(parseComparison(raw)).toEqual(EMPTY_COMPARISON);
  });
});

describe('toggleId', () => {
  it('adds a missing id and removes a present one', () => {
    expect(toggleId([1], 2)).toEqual([1, 2]);
    expect(toggleId([1, 2], 1)).toEqual([2]);
  });

  it('does not add to a full list', () => {
    expect(toggleId([1, 2, 3], 4)).toEqual([1, 2, 3]);
  });
});

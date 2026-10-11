import { describe, expect, it } from 'vitest';

import { TApiResult } from '@/app/utils/interfaces';
import { readableAvatarResult } from './avatar.helpers';

const REJECTED = 'Use an image up to 5 MB.';

describe('readableAvatarResult', () => {
  it.each([
    [400, 'Validation failed (expected size is less than 5000000)'],
    [413, '413 Payload Too Large'],
  ])('replaces the message of a %s', (status, message) => {
    expect(
      readableAvatarResult({ ok: false, status, message }, REJECTED),
    ).toEqual({ ok: false, status, message: REJECTED });
  });

  it.each<[string, TApiResult<{ id: number }>]>([
    [
      'another failure',
      { ok: false, status: 0, message: 'Could not reach the server' },
    ],
    ['a success', { ok: true, data: { id: 1 } }],
  ])('keeps %s as it is', (_, result) => {
    expect(readableAvatarResult(result, REJECTED)).toBe(result);
  });
});

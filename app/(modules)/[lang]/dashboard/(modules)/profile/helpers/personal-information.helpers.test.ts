import { afterEach, describe, expect, it } from 'vitest';
import {
  toPersonalInfoChange,
  toPersonalInfoFormValues,
} from './personal-information.helpers';

import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';

const originalTimeZone = process.env.TZ;

describe('date of birth', () => {
  afterEach(() => {
    process.env.TZ = originalTimeZone;
  });

  it.each([
    'UTC',
    'Europe/Budapest',
    'America/Los_Angeles',
    'Pacific/Auckland',
  ])('survives User → form → change unchanged in %s', (timeZone) => {
    process.env.TZ = timeZone;
    const user: IUser = {
      id: 1,
      email: 'a@b.c',
      personalInformation: { dateOfBirth: '1990-05-15T12:00:00.000Z' },
    };

    const formValues = toPersonalInfoFormValues(user);
    const change = toPersonalInfoChange(formValues);

    expect(formValues.dateOfBirth?.getDate()).toBe(15);
    expect(change.personalInformation?.dateOfBirth).toBe(
      '1990-05-15T12:00:00.000Z',
    );
  });
});

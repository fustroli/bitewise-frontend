// @vitest-environment jsdom
import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { EMPTY_NUTRITION } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import { EMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import MealPlanTargets from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Card/MealPlanTargets';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import { bodyMetrics } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';
import en from '@/app/i18n/locales/en.json';
import { macroPlanStorageKey } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/hooks';

vi.mock('@/app/(modules)/[lang]/dashboard/(modules)/_user/actions', () => ({}));

const labels = en.resources.mealPlans.card;

const USER: IUser = {
  id: 7,
  email: 'user@example.com',
  bodyStats: {
    sex: ESex.MALE,
    heightCm: 178,
    weightKg: 70,
    neckCm: null,
    waistCm: null,
    hipCm: null,
    activityLevel: EActivityLevel.MODERATE,
  },
  personalInformation: { dateOfBirth: '1990-01-15T12:00:00.000Z' },
};

const maintenance = bodyMetrics({
  bodyStats: USER.bodyStats!,
  dateOfBirth: USER.personalInformation!.dateOfBirth,
  today: new Date(),
}).calories!.maintenance;

const renderTargets = (user: IUser, calories: number) =>
  render(
    <DictionaryProvider dictionary={en}>
      <UserProvider
        authUser={user}
        actions={{
          updateUser: vi.fn(),
          updateAvatar: vi.fn(),
          requestEmailChange: vi.fn(),
          cancelEmailChange: vi.fn(),
        }}
      >
        <MealPlanTargets
          total={{ ...EMPTY_NUTRITION, calories, protein: 100 }}
          lang="en"
          bodyStatsHref="/en/dashboard/profile#body-stats"
        />
      </UserProvider>
    </DictionaryProvider>,
  );

describe('MealPlanTargets', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('is on target within 150 kcal of Maintenance', () => {
    renderTargets(USER, maintenance + 100);

    expect(screen.getByText('On target (+100 kcal)')).toBeTruthy();
  });

  it('says how far under Maintenance a day is', () => {
    renderTargets(USER, maintenance - 500);

    expect(screen.getByText('500 kcal under maintenance')).toBeTruthy();
  });

  it("uses the dashboard's macro split", () => {
    localStorage.setItem(macroPlanStorageKey(USER.id), EMacroPlan.LOW_CARB);
    renderTargets(USER, maintenance);
    const lowCarb = bodyMetrics({
      bodyStats: USER.bodyStats!,
      dateOfBirth: USER.personalInformation!.dateOfBirth,
      today: new Date(),
    }).macros!.plans.find(({ plan }) => plan === EMacroPlan.LOW_CARB)!;

    expect(
      screen.getByText(`/ ${Math.round(lowCarb.protein.grams)} g`),
    ).toBeTruthy();
  });

  it('shows plain totals and asks for Body stats without targets', () => {
    renderTargets({ ...USER, bodyStats: undefined }, 1800);

    expect(screen.getByText('1,800')).toBeTruthy();
    expect(screen.getByText(labels.noTargets)).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: en.dashboard.bodyMetrics.addBodyStats })
        .getAttribute('href'),
    ).toBe('/en/dashboard/profile#body-stats');
  });
});

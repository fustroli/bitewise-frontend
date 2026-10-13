// @vitest-environment jsdom
import {
  DictionaryProvider,
  TDictionary,
} from '@/app/providers/dictionary-provider';
import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import { Table, TableBody } from '@/app/components/ui/table';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { IMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import MealPlanTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanTableRow';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import en from '@/app/i18n/locales/en.json';
import userEvent from '@testing-library/user-event';

vi.mock('@/app/(modules)/[lang]/dashboard/(modules)/_user/actions', () => ({}));
vi.mock('next/navigation', () => ({ useParams: () => ({ lang: 'en' }) }));

const PLAN = { id: 1, name: 'Cut week', meals: [] } as unknown as IMealPlan;

const USER: IUser = {
  id: 1,
  email: 'user@example.com',
  bodyStats: {
    sex: ESex.MALE,
    heightCm: 177.8,
    weightKg: 79.3787,
    neckCm: null,
    waistCm: null,
    hipCm: null,
    activityLevel: EActivityLevel.MODERATE,
  },
  personalInformation: { dateOfBirth: '2000-01-15T12:00:00.000Z' },
} as IUser;

const renderRow = (user: IUser) =>
  render(
    <DictionaryProvider dictionary={en as TDictionary}>
      <UserProvider
        authUser={user}
        actions={{ updateUser: vi.fn(), updateAvatar: vi.fn() }}
      >
        <Table>
          <TableBody>
            <MealPlanTableRow row={PLAN} actions={null} />
          </TableBody>
        </Table>
      </UserProvider>
    </DictionaryProvider>,
  );

describe('Meal plan Maintenance line', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2025, 5, 1));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('keeps the Maintenance line shut until the row is toggled', async () => {
    const user = userEvent.setup();
    renderRow(USER);
    const toggle = screen.getByRole('button', {
      name: en.resources.mealPlans.showMaintenance,
    });
    const line = () =>
      screen.getByText('159 g').closest<HTMLElement>('[class*="grid-rows"]')!;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(line().className).toContain('grid-rows-[0fr]');
    expect(line().hasAttribute('inert')).toBe(true);

    await user.click(toggle);

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe(
      en.resources.mealPlans.hideMaintenance,
    );
    expect(line().className).toContain('grid-rows-[1fr]');
    expect(line().hasAttribute('inert')).toBe(false);

    await user.click(toggle);

    expect(line().className).toContain('grid-rows-[0fr]');
  });

  it('shows the Maintenance targets under the plan name and totals', () => {
    renderRow(USER);

    expect(screen.getByText(en.resources.mealPlans.maintenance)).toBeTruthy();
    expect(screen.getByText('159 g')).toBeTruthy();
    expect(screen.getByText('74 (<30) g')).toBeTruthy();
    expect(screen.getByText('349 (<70) g')).toBeTruthy();
    expect(screen.getByText('–')).toBeTruthy();
    expect(screen.getByText('159 g').className).toContain('bg-success/15');
  });

  it('hides the line and the toggle while Maintenance can not be computed', () => {
    renderRow({ ...USER, personalInformation: undefined });

    expect(screen.queryByText(en.resources.mealPlans.maintenance)).toBeNull();
    expect(screen.queryByText('159 g')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

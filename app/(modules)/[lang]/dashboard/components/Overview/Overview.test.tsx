// @vitest-environment jsdom
import {
  DictionaryProvider,
  TDictionary,
} from '@/app/providers/dictionary-provider';
import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

import BodyStats from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/BodyStats';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { IUserActions } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import Overview from '@/app/(modules)/[lang]/dashboard/components/Overview';
import { ReactNode } from 'react';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import en from '@/app/i18n/locales/en.json';
import userEvent from '@testing-library/user-event';

vi.mock('@/app/(modules)/[lang]/dashboard/(modules)/_user/actions', () => ({}));
vi.mock('@/app/hooks/use-toast', () => ({ toast: vi.fn() }));
vi.mock('next/navigation', () => ({ useParams: () => ({ lang: 'en' }) }));

const labels = en.dashboard.bodyMetrics;

/** calculator.net's example: 15.7 %, 11.0 kg fat, 59.0 kg lean. */
const MAN: IUser = {
  id: 1,
  email: 'user@example.com',
  bodyStats: {
    sex: ESex.MALE,
    heightCm: 178,
    weightKg: 70,
    neckCm: 50,
    waistCm: 96,
    hipCm: null,
    activityLevel: null,
  },
};

const withStats = (bodyStats: Partial<IUser['bodyStats']>): IUser => ({
  ...MAN,
  bodyStats: { ...MAN.bodyStats!, ...bodyStats },
});

const WITH_CALORIES = {
  ...withStats({ activityLevel: EActivityLevel.MODERATE }),
  personalInformation: { dateOfBirth: '2000-01-15T12:00:00.000Z' },
} as IUser;

const renderWithUser = (
  ui: ReactNode,
  user: IUser,
  updateUser: IUserActions['updateUser'] = vi.fn(),
) =>
  render(
    <DictionaryProvider dictionary={en as TDictionary}>
      <UserProvider
        authUser={user}
        actions={{
          updateUser,
          updateAvatar: vi.fn(),
          requestEmailChange: vi.fn(),
          cancelEmailChange: vi.fn(),
        }}
      >
        {ui}
      </UserProvider>
    </DictionaryProvider>,
  );

/** The card whose heading is `title`. */
const card = (title: string) =>
  within(
    screen
      .getByRole('heading', { level: 3, name: title })
      .closest<HTMLElement>('.rounded-lg')!,
  );

beforeAll(() => {
  // Radix Select needs these in jsdom.
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.scrollIntoView = () => {};
});

describe('Overview', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('shows the setup steps until there is a BMI', () => {
    renderWithUser(<Overview />, withStats({ heightCm: null }));

    expect(screen.getByText(en.dashboard.setup.title)).toBeTruthy();
    expect(screen.getByText(en.dashboard.summary.needs.bmi)).toBeTruthy();
    expect(screen.queryByText(en.dashboard.body.title)).toBeNull();
  });

  it('counts the done setup steps', () => {
    renderWithUser(<Overview />, withStats({ heightCm: null }));

    // Height missing, measurements present: one of three.
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
      '1',
    );
  });
});

describe('Body fat card', () => {
  afterEach(cleanup);

  it('shows the value, the masses and the highlighted category', async () => {
    const user = userEvent.setup();
    renderWithUser(<Overview />, MAN);
    const bodyFat = card(labels.bodyFat.title);

    expect(bodyFat.getByText('15.7%')).toBeTruthy();
    expect(bodyFat.getByText('11.0 kg')).toBeTruthy();
    expect(bodyFat.getByText('59.0 kg')).toBeTruthy();

    await user.click(
      bodyFat.getByRole('button', { name: labels.bodyFat.showTable }),
    );
    const current = bodyFat
      .getAllByRole('row')
      .find((row) => row.getAttribute('aria-current'));
    expect(current?.textContent).toBe(
      `${labels.bodyFat.categories.fitness} · you14 – 18%`,
    );
  });

  it("shows the woman's bands for a woman", async () => {
    const user = userEvent.setup();
    renderWithUser(
      <Overview />,
      withStats({
        sex: ESex.FEMALE,
        heightCm: 165,
        weightKg: 60,
        neckCm: 32,
        waistCm: 72,
        hipCm: 96,
      }),
    );
    const bodyFat = card(labels.bodyFat.title);

    expect(bodyFat.getByText('26.4%')).toBeTruthy();
    await user.click(
      bodyFat.getByRole('button', { name: labels.bodyFat.showTable }),
    );
    expect(bodyFat.getByText('≥ 32%')).toBeTruthy();
  });

  it('asks for the measurements while one is missing', () => {
    renderWithUser(<Overview />, withStats({ waistCm: null }));
    const bodyFat = card(labels.bodyFat.title);

    expect(bodyFat.getByText(labels.bodyFat.empty)).toBeTruthy();
    expect(
      bodyFat
        .getByRole('link', { name: labels.bodyFat.addMeasurements })
        .getAttribute('href'),
    ).toBe('/en/dashboard/profile#body-stats');
  });

  it('asks to check measurements that give no plausible result', () => {
    renderWithUser(<Overview />, withStats({ waistCm: 45 }));

    expect(
      card(labels.bodyFat.title).getByText(labels.bodyFat.implausible),
    ).toBeTruthy();
  });

  it('updates after a Profile save', async () => {
    const user = userEvent.setup();
    const updateUser = vi.fn().mockResolvedValue({ ok: true, data: MAN });
    renderWithUser(
      <>
        <BodyStats />
        <Overview />
      </>,
      withStats({ waistCm: null }),
      updateUser,
    );
    expect(
      card(labels.bodyFat.title).getByText(labels.bodyFat.empty),
    ).toBeTruthy();

    await user.click(screen.getByRole('button', { name: en.common.edit }));
    await user.type(screen.getAllByRole('spinbutton')[3], '96');
    await user.click(screen.getByRole('button', { name: en.common.save }));

    expect(updateUser).toHaveBeenCalledWith({ bodyStats: { waistCm: 96 } });
    expect(card(labels.bodyFat.title).getByText('15.7%')).toBeTruthy();
  });
});

describe('Macros card', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('starts on Balanced, switches plans and keeps the choice', async () => {
    const user = userEvent.setup();
    renderWithUser(<Overview />, WITH_CALORIES);
    const macros = card(labels.macros.title);
    const proteinRow = () =>
      macros.getByText(labels.macros.macros.protein).closest('li')!.textContent;

    expect(proteinRow()).toContain('25% of energy');
    expect(macros.getByText(labels.macros.sugarLimit)).toBeTruthy();

    await user.click(macros.getByRole('combobox'));
    await user.click(
      screen.getByRole('option', { name: labels.macros.plans.highProtein }),
    );

    expect(proteinRow()).toContain('35% of energy');
    expect(
      screen.getByText(`${labels.macros.plans.highProtein} macro split`),
    ).toBeTruthy();

    cleanup();
    renderWithUser(<Overview />, WITH_CALORIES);
    expect(
      card(labels.macros.title)
        .getByText(labels.macros.macros.protein)
        .closest('li')!.textContent,
    ).toContain('35% of energy');
  });

  it('asks for the Body stats while calories are unavailable', () => {
    renderWithUser(<Overview />, MAN);
    const macros = card(labels.macros.title);

    expect(macros.getByText(labels.macros.empty)).toBeTruthy();
    expect(
      macros
        .getByRole('link', { name: labels.addBodyStats })
        .getAttribute('href'),
    ).toBe('/en/dashboard/profile#body-stats');
  });

  it('asks for the date of birth when only that is missing', () => {
    renderWithUser(
      <Overview />,
      withStats({ activityLevel: EActivityLevel.MODERATE }),
    );

    expect(
      card(labels.macros.title).getByText(labels.macros.dateOfBirthMissing),
    ).toBeTruthy();
  });
});

describe('Calories by goal card', () => {
  afterEach(cleanup);

  it('flags targets below the safe minimum', async () => {
    const user = userEvent.setup();
    renderWithUser(<Overview />, WITH_CALORIES);
    const calories = card(labels.calories.title);

    expect(calories.getByText(labels.calories.loseTargets.fast)).toBeTruthy();
    await user.click(
      calories.getByRole('radio', { name: labels.calories.gain }),
    );
    expect(calories.getByText(labels.calories.gainTargets.fast)).toBeTruthy();
    expect(calories.queryByText(/safe minimum/)).toBeNull();
  });
});

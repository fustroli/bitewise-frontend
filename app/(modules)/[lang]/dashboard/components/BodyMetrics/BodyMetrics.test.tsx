// @vitest-environment jsdom
import {
  DictionaryProvider,
  TDictionary,
} from '@/app/providers/dictionary-provider';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

import BodyMetrics from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics';
import BodyStats from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/BodyStats';
import { ESex } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { IUserActions } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { ReactNode } from 'react';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import en from '@/app/i18n/locales/en.json';
import userEvent from '@testing-library/user-event';

vi.mock('@/app/(modules)/[lang]/dashboard/(modules)/_user/actions', () => ({}));
vi.mock('@/app/hooks/use-toast', () => ({ toast: vi.fn() }));
vi.mock('next/navigation', () => ({ useParams: () => ({ lang: 'en' }) }));

const labels = en.dashboard.bodyMetrics.bodyFat;

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

const renderWithUser = (
  ui: ReactNode,
  user: IUser,
  updateUser: IUserActions['updateUser'] = vi.fn(),
) =>
  render(
    <DictionaryProvider dictionary={en as TDictionary}>
      <UserProvider
        authUser={user}
        actions={{ updateUser, updateAvatar: vi.fn() }}
      >
        {ui}
      </UserProvider>
    </DictionaryProvider>,
  );

const bodyFatCard = () =>
  screen.getByText(labels.description).closest<HTMLElement>('.shadow-soft')!;

describe('Body fat card', () => {
  afterEach(cleanup);

  it('shows the value, the masses and the highlighted category', () => {
    renderWithUser(<BodyMetrics />, MAN);
    const card = within(bodyFatCard());

    expect(card.getByText('15.7%')).toBeTruthy();
    expect(card.getByText('11.0 kg')).toBeTruthy();
    expect(card.getByText('59.0 kg')).toBeTruthy();
    const current = card
      .getAllByRole('row')
      .find((row) => row.getAttribute('aria-current'));
    expect(current?.textContent).toBe(`${labels.categories.fitness}14 – 18%`);
  });

  it("shows the woman's table for a woman", () => {
    renderWithUser(
      <BodyMetrics />,
      withStats({
        sex: ESex.FEMALE,
        heightCm: 165,
        weightKg: 60,
        neckCm: 32,
        waistCm: 72,
        hipCm: 96,
      }),
    );
    const card = within(bodyFatCard());

    expect(card.getByText('26.4%')).toBeTruthy();
    expect(card.getByText('≥ 32%')).toBeTruthy();
  });

  it('asks for the measurements while one is missing', () => {
    renderWithUser(<BodyMetrics />, withStats({ waistCm: null }));
    const card = within(bodyFatCard());

    expect(card.getByText(labels.empty)).toBeTruthy();
    expect(
      card
        .getByRole('link', { name: labels.addMeasurements })
        .getAttribute('href'),
    ).toBe('/en/dashboard/profile#body-stats');
  });

  it('asks for the hip of a woman', () => {
    renderWithUser(<BodyMetrics />, withStats({ sex: ESex.FEMALE }));

    expect(within(bodyFatCard()).getByText(labels.empty)).toBeTruthy();
  });

  it('asks to check measurements that give no plausible result', () => {
    renderWithUser(<BodyMetrics />, withStats({ waistCm: 45 }));
    const card = within(bodyFatCard());

    expect(card.getByText(labels.implausible)).toBeTruthy();
    expect(
      card
        .getByRole('link', { name: labels.checkMeasurements })
        .getAttribute('href'),
    ).toBe('/en/dashboard/profile#body-stats');
  });

  it('updates after a Profile save', async () => {
    Element.prototype.hasPointerCapture = () => false;
    const user = userEvent.setup();
    const updateUser = vi.fn().mockResolvedValue({ ok: true, data: MAN });
    renderWithUser(
      <>
        <BodyStats />
        <BodyMetrics />
      </>,
      withStats({ waistCm: null }),
      updateUser,
    );
    expect(within(bodyFatCard()).getByText(labels.empty)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: en.common.edit }));
    await user.type(screen.getAllByRole('spinbutton')[3], '96');
    await user.click(screen.getByRole('button', { name: en.common.save }));

    expect(updateUser).toHaveBeenCalledWith({ bodyStats: { waistCm: 96 } });
    expect(within(bodyFatCard()).getByText('15.7%')).toBeTruthy();
  });
});

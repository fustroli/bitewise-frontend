// @vitest-environment jsdom
import {
  DictionaryProvider,
  TDictionary,
} from '@/app/providers/dictionary-provider';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import EmailNotifications from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Notifications/EmailNotifications';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { IUserActions } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { ReactNode } from 'react';
import SocialProfiles from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/SocialProfiles';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import en from '@/app/i18n/locales/en.json';
import { toast } from '@/app/hooks/use-toast';
import userEvent from '@testing-library/user-event';

vi.mock('@/app/(modules)/[lang]/dashboard/(modules)/_user/actions', () => ({}));
vi.mock('@/app/hooks/use-toast', () => ({ toast: vi.fn() }));

const { common } = en;

const USER: IUser = {
  id: 1,
  email: 'user@example.com',
  socialProfiles: { facebook: 'https://facebook.com/original' },
};

const renderWithUser = (
  ui: ReactNode,
  user: IUser,
  updateUser: IUserActions['updateUser'],
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

const facebookInput = () => screen.getAllByRole('textbox')[0];

describe('Profile section cycle', () => {
  beforeEach(() => {
    vi.mocked(toast).mockClear();
  });

  afterEach(cleanup);

  it('Cancel restores the original values', async () => {
    const user = userEvent.setup();
    renderWithUser(<SocialProfiles />, USER, vi.fn());

    await user.click(screen.getByRole('button', { name: common.edit }));
    await user.clear(facebookInput());
    await user.type(facebookInput(), 'https://facebook.com/changed');
    await user.click(screen.getByRole('button', { name: common.cancel }));

    expect(screen.getByText('https://facebook.com/original')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: common.edit }));
    expect((facebookInput() as HTMLInputElement).value).toBe(
      'https://facebook.com/original',
    );
  });

  it('a failure stays in edit mode and shows the message', async () => {
    const user = userEvent.setup();
    const updateUser = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      message: 'Backend says no',
    });
    renderWithUser(<SocialProfiles />, USER, updateUser);

    await user.click(screen.getByRole('button', { name: common.edit }));
    await user.clear(facebookInput());
    await user.type(facebookInput(), 'https://facebook.com/changed');
    await user.click(screen.getByRole('button', { name: common.save }));

    expect(toast).toHaveBeenCalledWith({
      variant: 'error',
      description: 'Backend says no',
    });
    expect(screen.getByRole('button', { name: common.save })).toBeTruthy();
    expect((facebookInput() as HTMLInputElement).value).toBe(
      'https://facebook.com/changed',
    );
  });

  it('a success updates the User and leaves edit mode', async () => {
    const user = userEvent.setup();
    const updateUser = vi.fn().mockResolvedValue({
      ok: true,
      data: {
        ...USER,
        socialProfiles: { facebook: 'https://facebook.com/changed' },
      },
    });
    renderWithUser(<SocialProfiles />, USER, updateUser);

    await user.click(screen.getByRole('button', { name: common.edit }));
    await user.clear(facebookInput());
    await user.type(facebookInput(), 'https://facebook.com/changed');
    await user.click(screen.getByRole('button', { name: common.save }));

    expect(updateUser).toHaveBeenCalledWith({
      socialProfiles: {
        facebook: 'https://facebook.com/changed',
        twitter: '',
        instagram: '',
        linkedin: '',
      },
    });
    expect(toast).toHaveBeenCalledWith({
      variant: 'success',
      description: common.savedSuccessfully,
    });
    expect(screen.queryByRole('button', { name: common.save })).toBeNull();
    expect(screen.getByText('https://facebook.com/changed')).toBeTruthy();
  });
});

describe('Email notifications', () => {
  beforeEach(() => {
    // Radix Switch measures itself; jsdom has no ResizeObserver.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders a stored securityEmail: false as off', () => {
    renderWithUser(
      <EmailNotifications />,
      { ...USER, notificationSettings: { securityEmail: false } },
      vi.fn(),
    );

    const securitySwitch = screen.getByRole('switch', {
      name: en.profile.notifications.securityEmail,
    });
    expect(securitySwitch.getAttribute('aria-checked')).toBe('false');
  });
});

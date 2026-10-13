// @vitest-environment jsdom
import EmailVerificationBanner, {
  RESEND_COOLDOWN_SECONDS,
} from '@/app/(modules)/[lang]/dashboard/components/EmailVerificationBanner';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import en from '@/app/i18n/locales/en.json';
import { resendVerification } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/actions';
import { toast } from '@/app/hooks/use-toast';
import userEvent from '@testing-library/user-event';

vi.mock('@/app/(modules)/[lang]/dashboard/(modules)/_user/actions', () => ({
  resendVerification: vi.fn(),
}));
vi.mock('@/app/hooks/use-toast', () => ({ toast: vi.fn() }));

const text = en.emailVerification;
const USER: IUser = { id: 1, email: 'user@example.com', emailVerified: false };

const renderBanner = (user: IUser = USER) =>
  render(
    <DictionaryProvider dictionary={en}>
      <UserProvider
        authUser={user}
        actions={{ updateUser: vi.fn(), updateAvatar: vi.fn() }}
      >
        <EmailVerificationBanner />
      </UserProvider>
    </DictionaryProvider>,
  );

const resend = () =>
  userEvent.click(screen.getByRole('button', { name: text.resend }));

const button = () => screen.getByRole<HTMLButtonElement>('button');

const SECOND_MS = 1000;
const OK = { ok: true, data: undefined } as const;

describe('Email verification banner', () => {
  beforeEach(() => {
    vi.mocked(resendVerification).mockReset();
    vi.mocked(toast).mockClear();
  });

  afterEach(cleanup);

  it('asks an unverified User to verify their email', () => {
    renderBanner();

    const banner = screen.getByRole('alert').textContent;
    expect(banner).toContain(text.bannerTitle);
    expect(banner).toContain('We sent a link to user@example.com.');
  });

  it.each([
    ['a verified User', { ...USER, emailVerified: true }],
    ['a User without the flag', { id: 1, email: 'user@example.com' }],
  ])('is hidden for %s', (_, user) => {
    renderBanner(user);

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('resends the email', async () => {
    vi.mocked(resendVerification).mockResolvedValue({
      ok: true,
      data: undefined,
    });
    renderBanner();

    await resend();

    expect(resendVerification).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith({
      variant: 'success',
      description: 'Verification email sent to user@example.com.',
    });
  });

  it('explains throttling', async () => {
    vi.mocked(resendVerification).mockResolvedValue({
      ok: false,
      status: 429,
      message: 'ThrottlerException: Too Many Requests',
    });
    renderBanner();

    await resend();

    expect(toast).toHaveBeenCalledWith({
      variant: 'error',
      description: text.resendThrottled,
    });
  });

  it('shows any other failure as the backend sent it', async () => {
    vi.mocked(resendVerification).mockResolvedValue({
      ok: false,
      status: 500,
      message: 'Internal server error',
    });
    renderBanner();

    await resend();

    expect(toast).toHaveBeenCalledWith({
      variant: 'error',
      description: 'Internal server error',
    });
  });

  describe('cooldown', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const tick = (seconds: number) =>
      act(async () => {
        await vi.advanceTimersByTimeAsync(seconds * SECOND_MS);
      });

    it.each([
      ['a send', OK],
      ['a throttle', { ok: false, status: 429, message: 'Too Many Requests' }],
    ] as const)('locks the button for a while after %s', async (_, result) => {
      vi.mocked(resendVerification).mockResolvedValue(result);
      renderBanner();

      await resend();

      expect(button().disabled).toBe(true);
      expect(button().textContent).toBe(
        `Resend in ${RESEND_COOLDOWN_SECONDS}s`,
      );

      await tick(RESEND_COOLDOWN_SECONDS - 1);
      expect(button().textContent).toBe('Resend in 1s');

      await tick(1);
      expect(button().disabled).toBe(false);
      expect(button().textContent).toBe(text.resend);
    });

    it('lets the User retry at once after another failure', async () => {
      vi.mocked(resendVerification).mockResolvedValue({
        ok: false,
        status: 500,
        message: 'Internal server error',
      });
      renderBanner();

      await resend();

      expect(button().disabled).toBe(false);
    });
  });
});

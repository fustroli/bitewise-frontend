// @vitest-environment jsdom
import { StrictMode, act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { EVerifyEmailStatus } from '@/app/(modules)/(auth)/enum';
import VerifyEmail from '@/app/(modules)/(auth)/components/VerifyEmail';
import en from '@/app/i18n/locales/en.json';
import { verifyEmail } from '@/app/(modules)/(auth)/api';

vi.mock('@/app/(modules)/(auth)/api', () => ({ verifyEmail: vi.fn() }));

const text = en.emailVerification;

const renderPage = (token?: string) =>
  render(
    <StrictMode>
      <DictionaryProvider dictionary={en}>
        <VerifyEmail token={token} />
      </DictionaryProvider>
    </StrictMode>,
  );

const action = () => screen.getByRole('link');

describe('Verify email page', () => {
  beforeEach(() => {
    vi.mocked(verifyEmail).mockReset();
  });

  afterEach(cleanup);

  it('shows progress while the token is redeemed', () => {
    vi.mocked(verifyEmail).mockReturnValue(new Promise(() => {}));
    renderPage('abc');

    expect(screen.getByRole('status').textContent).toBe(text.verifying);
  });

  it('redeems the token once, even in Strict Mode', async () => {
    vi.mocked(verifyEmail).mockResolvedValue(EVerifyEmailStatus.VERIFIED);
    renderPage('abc');
    await act(async () => {});

    expect(verifyEmail).toHaveBeenCalledTimes(1);
    expect(verifyEmail).toHaveBeenCalledWith('abc');
  });

  it.each([
    [EVerifyEmailStatus.VERIFIED, text.verifiedTitle, text.continue],
    [EVerifyEmailStatus.INVALID, text.invalidTitle, text.requestNew],
    [EVerifyEmailStatus.FAILED, text.failedTitle, text.continue],
  ])('shows the %s state', async (status, title, link) => {
    vi.mocked(verifyEmail).mockResolvedValue(status);
    renderPage('abc');

    expect((await screen.findByRole('heading')).textContent).toBe(title);
    expect(action().textContent).toBe(link);
    expect(action().getAttribute('href')).toBe('/dashboard');
  });

  it('is invalid without a token, without calling the backend', () => {
    renderPage();

    expect(screen.getByRole('heading').textContent).toBe(text.invalidTitle);
    expect(verifyEmail).not.toHaveBeenCalled();
  });
});

// @vitest-environment jsdom
import { StrictMode, act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import ConfirmEmailChange from '@/app/(modules)/(auth)/components/ConfirmEmailChange';
import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { confirmEmailChange } from '@/app/(modules)/(auth)/api';
import en from '@/app/i18n/locales/en.json';

vi.mock('@/app/(modules)/(auth)/api', () => ({ confirmEmailChange: vi.fn() }));

const text = en.emailChange;

const renderPage = (token?: string, signedIn = false) =>
  render(
    <StrictMode>
      <DictionaryProvider dictionary={en}>
        <ConfirmEmailChange token={token} signedIn={signedIn} />
      </DictionaryProvider>
    </StrictMode>,
  );

describe('Confirm email change page', () => {
  beforeEach(() => vi.mocked(confirmEmailChange).mockReset());
  afterEach(cleanup);

  it('confirms once on load, even in Strict Mode', async () => {
    vi.mocked(confirmEmailChange).mockResolvedValue('done');
    renderPage('abc');
    await act(async () => {});

    expect(confirmEmailChange).toHaveBeenCalledTimes(1);
    expect(confirmEmailChange).toHaveBeenCalledWith('abc');
  });

  it('asks a signed-out User to sign in', async () => {
    vi.mocked(confirmEmailChange).mockResolvedValue('done');
    renderPage('abc');

    await screen.findByText(text.confirmedSignedOut);
    expect(screen.getByRole('link').textContent).toBe(text.signIn);
  });

  it('sends a signed-in User back to settings', async () => {
    vi.mocked(confirmEmailChange).mockResolvedValue('done');
    renderPage('abc', true);

    await screen.findByText(text.confirmed);
    expect(screen.getByRole('link').getAttribute('href')).toBe(
      '/dashboard/profile',
    );
  });

  it.each([
    ['invalid', text.invalidTitle],
    ['taken', text.takenTitle],
    ['failed', text.failedTitle],
  ] as const)('shows the %s state', async (status, title) => {
    vi.mocked(confirmEmailChange).mockResolvedValue(status);
    renderPage('abc');

    expect((await screen.findByRole('heading')).textContent).toBe(title);
  });

  it('is invalid without a token, without calling the backend', () => {
    renderPage();

    expect(screen.getByRole('heading').textContent).toBe(text.invalidTitle);
    expect(confirmEmailChange).not.toHaveBeenCalled();
  });
});

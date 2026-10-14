// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import CancelEmailChange from '@/app/(modules)/(auth)/components/CancelEmailChange';
import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { cancelEmailChange } from '@/app/(modules)/(auth)/api';
import en from '@/app/i18n/locales/en.json';

vi.mock('@/app/(modules)/(auth)/api', () => ({ cancelEmailChange: vi.fn() }));

const text = en.emailChange;

const renderPage = (token?: string) =>
  render(
    <DictionaryProvider dictionary={en}>
      <CancelEmailChange token={token} />
    </DictionaryProvider>,
  );

describe('Cancel email change page', () => {
  beforeEach(() => vi.mocked(cancelEmailChange).mockReset());
  afterEach(cleanup);

  it('does nothing on load', () => {
    renderPage('abc');

    expect(cancelEmailChange).not.toHaveBeenCalled();
  });

  it('cancels on the button press and links to forgot-password', async () => {
    vi.mocked(cancelEmailChange).mockResolvedValue('done');
    renderPage('abc');
    fireEvent.click(screen.getByRole('button', { name: text.cancelAction }));

    await screen.findByText(text.cancelledDone);
    expect(cancelEmailChange).toHaveBeenCalledWith('abc');
    expect(screen.getByRole('link').getAttribute('href')).toBe(
      '/forgot-password',
    );
  });

  it('shows invalid for a bad token', async () => {
    vi.mocked(cancelEmailChange).mockResolvedValue('invalid');
    renderPage('abc');
    fireEvent.click(screen.getByRole('button', { name: text.cancelAction }));

    expect((await screen.findByRole('heading')).textContent).toBe(
      text.invalidTitle,
    );
  });

  it('lets the User retry after a failure', async () => {
    vi.mocked(cancelEmailChange).mockResolvedValue('failed');
    renderPage('abc');
    fireEvent.click(screen.getByRole('button', { name: text.cancelAction }));

    expect((await screen.findByRole('alert')).textContent).toBe(text.failed);
    expect(
      screen.getByRole('button', { name: text.cancelAction }),
    ).toBeTruthy();
  });
});

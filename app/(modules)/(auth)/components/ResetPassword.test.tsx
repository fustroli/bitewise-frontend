// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import ResetPassword from '@/app/(modules)/(auth)/components/ResetPassword';
import en from '@/app/i18n/locales/en.json';
import { confirmPasswordReset } from '@/app/(modules)/(auth)/api';

vi.mock('@/app/(modules)/(auth)/api', () => ({
  confirmPasswordReset: vi.fn(),
}));

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const toast = vi.fn();
vi.mock('@/app/hooks/use-toast', () => ({ useToast: () => ({ toast }) }));

const text = en.passwordReset;
const PASSWORD = 'Abcdefg1';

const renderPage = (token?: string) =>
  render(
    <DictionaryProvider dictionary={en}>
      <ResetPassword token={token} />
    </DictionaryProvider>,
  );

const fillAndSubmit = (confirm = PASSWORD) => {
  fireEvent.change(screen.getByLabelText(text.newPassword), {
    target: { value: PASSWORD },
  });
  fireEvent.change(screen.getByLabelText(text.confirmPassword), {
    target: { value: confirm },
  });
  fireEvent.click(screen.getByRole('button', { name: text.updatePassword }));
};

describe('Reset password page', () => {
  beforeEach(() => {
    vi.mocked(confirmPasswordReset).mockReset();
    push.mockReset();
    toast.mockReset();
  });

  afterEach(cleanup);

  it('shows the form without checking the token', () => {
    renderPage('tok');

    expect(confirmPasswordReset).not.toHaveBeenCalled();
    expect(screen.getByLabelText(text.newPassword)).toBeTruthy();
  });

  it('offers a new link when the token is missing', () => {
    renderPage();

    expect(screen.getByRole('link').getAttribute('href')).toBe(
      '/forgot-password',
    );
  });

  it('sends the token and goes to sign-in on success', async () => {
    vi.mocked(confirmPasswordReset).mockResolvedValue('done');
    renderPage('tok');
    fillAndSubmit();

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(confirmPasswordReset).toHaveBeenCalledWith({
      token: 'tok',
      password: PASSWORD,
      passwordConfirm: PASSWORD,
    });
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ description: text.updated }),
    );
  });

  it('does not submit mismatched passwords', async () => {
    renderPage('tok');
    fillAndSubmit('Different1');

    expect(
      await screen.findByText(en.passwordPolicy.passwordMatch),
    ).toBeTruthy();
    expect(confirmPasswordReset).not.toHaveBeenCalled();
  });

  it('shows the invalid link on 400', async () => {
    vi.mocked(confirmPasswordReset).mockResolvedValue('invalid');
    renderPage('tok');
    fillAndSubmit();

    expect(await screen.findByText(text.invalidTitle)).toBeTruthy();
    expect(screen.getByRole('link').getAttribute('href')).toBe(
      '/forgot-password',
    );
  });
});

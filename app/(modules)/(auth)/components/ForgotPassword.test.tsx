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
import ForgotPassword from '@/app/(modules)/(auth)/components/ForgotPassword';
import en from '@/app/i18n/locales/en.json';
import { requestPasswordReset } from '@/app/(modules)/(auth)/api';

vi.mock('@/app/(modules)/(auth)/api', () => ({
  requestPasswordReset: vi.fn(),
}));

const toast = vi.fn();
vi.mock('@/app/hooks/use-toast', () => ({ useToast: () => ({ toast }) }));

const text = en.passwordReset;

const submit = async (email?: string) => {
  render(
    <DictionaryProvider dictionary={en}>
      <ForgotPassword email={email} />
    </DictionaryProvider>,
  );
  if (!email) {
    fireEvent.change(screen.getByLabelText(text.email), {
      target: { value: 'a@b.co' },
    });
  }
  fireEvent.click(screen.getByRole('button', { name: text.sendLink }));
};

describe('Forgot password page', () => {
  beforeEach(() => {
    vi.mocked(requestPasswordReset).mockReset();
    toast.mockReset();
  });

  afterEach(cleanup);

  it('prefills the email', () => {
    render(
      <DictionaryProvider dictionary={en}>
        <ForgotPassword email="x@y.co" />
      </DictionaryProvider>,
    );

    expect((screen.getByLabelText(text.email) as HTMLInputElement).value).toBe(
      'x@y.co',
    );
  });

  it('shows the same message once sent', async () => {
    vi.mocked(requestPasswordReset).mockResolvedValue('sent');
    await submit('x@y.co');

    expect((await screen.findByRole('status')).textContent).toBe(text.sent);
    expect(requestPasswordReset).toHaveBeenCalledWith('x@y.co');
  });

  it('says to try later on 429', async () => {
    vi.mocked(requestPasswordReset).mockResolvedValue('throttled');
    await submit();

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ description: text.throttled }),
      ),
    );
  });
});

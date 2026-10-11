import { beforeEach, describe, expect, it, vi } from 'vitest';

import { changePassword } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/actions';
import { request } from '@/app/utils/helpers/server';

vi.mock('@/app/utils/helpers/server', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  request: vi.fn(async () => ({ ok: true, data: undefined })),
  refreshDashboardOnSuccess: <T>(result: T) => result,
}));

const INVALID = { ok: false, status: 400, message: 'Invalid input' };

beforeEach(() => {
  vi.mocked(request).mockClear();
});

const PASSWORDS = {
  oldPassword: 'Old-password-1',
  password: 'New-password-1!',
  confirmPassword: 'New-password-1!',
};

describe('changePassword', () => {
  it('strips fields the schema does not know', async () => {
    await changePassword({ ...PASSWORDS, userId: 2 } as any);

    expect(request).toHaveBeenCalledWith(
      'auth/change-password',
      'POST',
      PASSWORDS,
      undefined,
      { unauthorizedIsResult: true },
    );
  });

  it('rejects mismatched passwords without calling the backend', async () => {
    expect(
      await changePassword({ ...PASSWORDS, confirmPassword: 'other' }),
    ).toEqual(INVALID);
    expect(request).not.toHaveBeenCalled();
  });
});

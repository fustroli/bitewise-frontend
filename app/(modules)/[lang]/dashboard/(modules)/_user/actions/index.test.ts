import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resendVerification,
  updateAvatar,
  updateUser,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/actions';

import { ESex } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
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

const image = (type = 'image/png', size = 10) =>
  new File([new Uint8Array(size)], 'avatar.png', { type });

const formData = (entries: Record<string, string | File>) => {
  const data = new FormData();
  Object.entries(entries).forEach(([key, value]) => data.append(key, value));
  return data;
};

describe('updateUser', () => {
  it('strips fields an IUserChange does not have', async () => {
    await updateUser({
      email: 'other@example.com',
      bodyStats: { sex: ESex.FEMALE, heightCm: 170, role: 'ADMIN' },
    } as any);

    expect(request).toHaveBeenCalledWith('users/me', 'PATCH', {
      bodyStats: { sex: ESex.FEMALE, heightCm: 170 },
    });
  });

  it('rejects a wrongly typed field without calling the backend', async () => {
    expect(await updateUser({ bodyStats: { heightCm: '170' } } as any)).toEqual(
      INVALID,
    );
    expect(request).not.toHaveBeenCalled();
  });
});

describe('updateAvatar', () => {
  it('forwards only the file', async () => {
    const file = image();
    await updateAvatar(formData({ file, userId: '2' }));

    const body = vi.mocked(request).mock.calls[0][2] as FormData;
    expect([...body.keys()]).toEqual(['file']);
    expect(body.get('file')).toBeInstanceOf(File);
  });

  it.each([
    ['a missing file', formData({})],
    ['a string', formData({ file: 'x' })],
    ['a non-image', formData({ file: image('text/html') })],
    ['an empty file', formData({ file: image('image/png', 0) })],
    ['a too large file', formData({ file: image('image/png', 5000001) })],
    ['not FormData', { file: image() } as any],
  ])('rejects %s without calling the backend', async (_, data) => {
    expect(await updateAvatar(data)).toEqual(INVALID);
    expect(request).not.toHaveBeenCalled();
  });
});

describe('resendVerification', () => {
  it('asks the backend for a new link', async () => {
    await resendVerification();

    expect(request).toHaveBeenCalledWith('auth/resend-verification', 'POST');
  });
});

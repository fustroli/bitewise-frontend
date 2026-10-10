import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSessionBackend } from '@/app/session/backend';

const BASE_URL = 'https://api.test';

const fakeFetch = vi.fn<typeof fetch>();
const backend = createSessionBackend({ baseUrl: BASE_URL, fetch: fakeFetch });

const SET_COOKIE = [
  'accessToken=new-access; Path=/; Expires=Wed, 01 Jan 2031 00:00:00 GMT; HttpOnly',
  'refreshToken=new-refresh; Path=/; Expires=Wed, 08 Jan 2031 00:00:00 GMT; HttpOnly',
];

const withCookies = (setCookie: string[], status = 200) => {
  const headers = new Headers();
  for (const header of setCookie) headers.append('Set-Cookie', header);
  return new Response('{}', { status, headers });
};

beforeEach(() => {
  fakeFetch.mockReset();
});

describe('session backend', () => {
  it('refreshes with the refresh token as Bearer', async () => {
    fakeFetch.mockResolvedValue(withCookies(SET_COOKIE));

    const result = await backend.refresh('old-refresh');

    expect(result).toEqual({
      type: 'refreshed',
      tokens: { accessToken: 'new-access', refreshToken: 'new-refresh' },
      setCookie: SET_COOKIE,
    });
    const [url, init] = fakeFetch.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/auth/refresh`);
    expect(init?.method).toBe('POST');
    expect((init?.headers as any).Authorization).toBe('Bearer old-refresh');
  });

  it.each([401, 403])('treats %s as a rejected Session', async (status) => {
    fakeFetch.mockResolvedValue(new Response('{}', { status }));

    expect(await backend.refresh('old-refresh')).toEqual({ type: 'rejected' });
  });

  it.each([
    [
      'a server error',
      () => fakeFetch.mockResolvedValue(new Response('', { status: 500 })),
    ],
    [
      'a network error',
      () => fakeFetch.mockRejectedValue(new TypeError('fetch failed')),
    ],
    [
      'a response without both cookies',
      () => fakeFetch.mockResolvedValue(withCookies([SET_COOKIE[0]])),
    ],
  ])('reports %s as unavailable', async (_, arrange) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    arrange();

    expect(await backend.refresh('old-refresh')).toEqual({
      type: 'unavailable',
    });
  });

  it('signs out with the refresh token as Bearer', async () => {
    fakeFetch.mockResolvedValue(new Response(null, { status: 204 }));

    await backend.signOut('old-refresh');

    const [url, init] = fakeFetch.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/auth/signout`);
    expect((init?.headers as any).Authorization).toBe('Bearer old-refresh');
  });

  it('swallows sign-out failures', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fakeFetch.mockRejectedValue(new TypeError('fetch failed'));

    await expect(backend.signOut('old-refresh')).resolves.toBeUndefined();
  });
});

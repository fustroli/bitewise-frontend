import { applyRenewal, createSessionRenewal } from '@/app/session/renewal';
import { describe, expect, it, vi } from 'vitest';

import { TRefreshResult } from '@/app/session/backend';

const NOW = 1_700_000_000_000;
const SECOND = 1000;

const jwt = (expiresAt: number, claims: object = {}) =>
  `header.${Buffer.from(JSON.stringify({ exp: expiresAt / SECOND, ...claims })).toString('base64url')}.signature`;

const DAY = 24 * 60 * 60 * SECOND;
const OLD_REFRESH = jwt(NOW + 7 * DAY);

const fakeRequestCookies = (initial: Record<string, string>) => {
  const values = new Map(Object.entries(initial));
  return {
    values,
    get: (name: string) =>
      values.has(name) ? { value: values.get(name)! } : undefined,
    set: (name: string, value: string) => values.set(name, value),
    delete: (name: string) => values.delete(name),
  };
};

const NEW_SET_COOKIE = [
  'accessToken=new-access; Path=/; HttpOnly',
  'refreshToken=new-refresh; Path=/; HttpOnly',
];
const REFRESHED: TRefreshResult = {
  type: 'refreshed',
  tokens: { accessToken: 'new-access', refreshToken: 'new-refresh' },
  setCookie: NEW_SET_COOKIE,
};

const setup = (result: TRefreshResult = REFRESHED) => {
  let now = NOW;
  const refresh = vi.fn(async () => result);
  const renew = createSessionRenewal({ refresh, now: () => now });
  return { refresh, renew, advance: (ms: number) => (now += ms) };
};

const expiringSession = () =>
  fakeRequestCookies({
    accessToken: jwt(NOW + 10 * SECOND),
    refreshToken: OLD_REFRESH,
  });

describe('session renewal', () => {
  it('leaves a fresh access token alone', async () => {
    const { renew, refresh } = setup();
    const cookies = fakeRequestCookies({
      accessToken: jwt(NOW + 30 * 60 * SECOND),
      refreshToken: OLD_REFRESH,
    });

    expect(await renew({ cookies, pathname: '/en/dashboard' })).toEqual({
      type: 'unchanged',
    });
    expect(refresh).not.toHaveBeenCalled();
  });

  it('does nothing without a refresh token', async () => {
    const { renew, refresh } = setup();

    const renewal = await renew({
      cookies: fakeRequestCookies({}),
      pathname: '/en/dashboard',
    });

    expect(renewal).toEqual({ type: 'unchanged' });
    expect(refresh).not.toHaveBeenCalled();
  });

  it.each([
    ['about to expire', jwt(NOW + 10 * SECOND)],
    ['expired', jwt(NOW - SECOND)],
    ['unreadable', 'not-a-jwt'],
  ])('renews an access token that is %s', async (_, accessToken) => {
    const { renew, refresh } = setup();
    const cookies = fakeRequestCookies({
      accessToken,
      refreshToken: OLD_REFRESH,
    });

    const renewal = await renew({ cookies, pathname: '/en/dashboard' });

    expect(refresh).toHaveBeenCalledWith(OLD_REFRESH);
    expect(renewal).toEqual({ type: 'renewed', setCookie: NEW_SET_COOKIE });
    expect(cookies.values).toEqual(
      new Map([
        ['accessToken', 'new-access'],
        ['refreshToken', 'new-refresh'],
      ]),
    );
  });

  it('renews when only the refresh token is left', async () => {
    const { renew, refresh } = setup();
    const cookies = fakeRequestCookies({ refreshToken: OLD_REFRESH });

    await renew({ cookies, pathname: '/' });

    expect(refresh).toHaveBeenCalledWith(OLD_REFRESH);
    expect(cookies.values.get('accessToken')).toBe('new-access');
  });

  it('ends the Session when the backend rejects the refresh token', async () => {
    const { renew } = setup({ type: 'rejected' });
    const cookies = expiringSession();

    expect(await renew({ cookies, pathname: '/en/dashboard' })).toEqual({
      type: 'ended',
    });
    expect(cookies.values.size).toBe(0);
  });

  it('keeps the tokens when the backend is unavailable', async () => {
    const { renew } = setup({ type: 'unavailable' });
    const cookies = expiringSession();

    expect(await renew({ cookies, pathname: '/en/dashboard' })).toEqual({
      type: 'unchanged',
    });
    expect(cookies.values.get('refreshToken')).toBe(OLD_REFRESH);
  });

  it('never renews on the sign-out route', async () => {
    const { renew, refresh } = setup();

    await renew({ cookies: expiringSession(), pathname: '/signout' });

    expect(refresh).not.toHaveBeenCalled();
  });

  it('shares one refresh between requests carrying the same token', async () => {
    const { renew, refresh } = setup();

    const [first, second] = await Promise.all([
      renew({ cookies: expiringSession(), pathname: '/en/dashboard' }),
      renew({ cookies: expiringSession(), pathname: '/en/dashboard/meals' }),
    ]);
    const late = expiringSession();
    await renew({ cookies: late, pathname: '/en/dashboard' });

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(second).toEqual(first);
    expect(late.values.get('refreshToken')).toBe('new-refresh');
  });

  it.each([
    ['garbage', 'not-a-jwt'],
    ['too long', jwt(NOW + DAY, { pad: 'x'.repeat(3000) })],
    ['expired', jwt(NOW - SECOND)],
  ])(
    'ends the Session without asking the backend for a %s refresh token',
    async (_, refreshToken) => {
      const { renew, refresh } = setup();
      const cookies = fakeRequestCookies({ refreshToken });

      expect(await renew({ cookies, pathname: '/en/dashboard' })).toEqual({
        type: 'ended',
      });
      expect(refresh).not.toHaveBeenCalled();
      expect(cookies.values.size).toBe(0);
    },
  );

  it('drops the oldest shared refresh past the cap', async () => {
    const { renew, refresh } = setup();
    const renewWith = (refreshToken: string) =>
      renew({
        cookies: fakeRequestCookies({ refreshToken }),
        pathname: '/en/dashboard',
      });
    const tokens = Array.from({ length: 1001 }, (_, i) =>
      jwt(NOW + DAY, { jti: i }),
    );

    for (const token of tokens) await renewWith(token);
    await renewWith(tokens[1]);
    expect(refresh).toHaveBeenCalledTimes(1001);

    await renewWith(tokens[0]);
    expect(refresh).toHaveBeenCalledTimes(1002);
  });

  it('refreshes again once the shared result is stale', async () => {
    const { renew, refresh, advance } = setup();

    await renew({ cookies: expiringSession(), pathname: '/en/dashboard' });
    advance(31 * SECOND);
    await renew({
      cookies: fakeRequestCookies({ refreshToken: OLD_REFRESH }),
      pathname: '/en/dashboard',
    });

    expect(refresh).toHaveBeenCalledTimes(2);
  });
});

describe('applying a renewal to the response', () => {
  const fakeResponse = () => ({
    headers: new Headers(),
    cookies: { set: vi.fn() },
  });

  it('forwards the backend cookies verbatim', () => {
    const response = fakeResponse();

    applyRenewal(response, { type: 'renewed', setCookie: NEW_SET_COOKIE });

    expect(response.headers.getSetCookie()).toEqual(NEW_SET_COOKIE);
  });

  it('clears both cookies when the Session ended', () => {
    const response = fakeResponse();

    applyRenewal(response, { type: 'ended' }, 'bitewise.test');

    expect(response.cookies.set).toHaveBeenCalledTimes(2);
    expect(response.cookies.set).toHaveBeenCalledWith(
      'refreshToken',
      '',
      expect.objectContaining({ maxAge: 0, domain: 'bitewise.test' }),
    );
  });

  it('writes nothing when unchanged', () => {
    const response = fakeResponse();

    applyRenewal(response, { type: 'unchanged' });

    expect(response.headers.getSetCookie()).toEqual([]);
    expect(response.cookies.set).not.toHaveBeenCalled();
  });
});

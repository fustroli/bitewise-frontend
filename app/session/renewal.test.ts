import { applyRenewal, createSessionRenewal } from '@/app/session/renewal';
import { describe, expect, it, vi } from 'vitest';

import { TRefreshResult } from '@/app/session/backend';

const NOW = 1_700_000_000_000;
const SECOND = 1000;

const jwt = (expiresAt: number) =>
  `header.${Buffer.from(JSON.stringify({ exp: expiresAt / SECOND })).toString('base64url')}.signature`;

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
    refreshToken: 'old-refresh',
  });

describe('session renewal', () => {
  it('leaves a fresh access token alone', async () => {
    const { renew, refresh } = setup();
    const cookies = fakeRequestCookies({
      accessToken: jwt(NOW + 30 * 60 * SECOND),
      refreshToken: 'old-refresh',
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
      refreshToken: 'old-refresh',
    });

    const renewal = await renew({ cookies, pathname: '/en/dashboard' });

    expect(refresh).toHaveBeenCalledWith('old-refresh');
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
    const cookies = fakeRequestCookies({ refreshToken: 'old-refresh' });

    await renew({ cookies, pathname: '/' });

    expect(refresh).toHaveBeenCalledWith('old-refresh');
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
    expect(cookies.values.get('refreshToken')).toBe('old-refresh');
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

  it('refreshes again once the shared result is stale', async () => {
    const { renew, refresh, advance } = setup();

    await renew({ cookies: expiringSession(), pathname: '/en/dashboard' });
    advance(31 * SECOND);
    await renew({
      cookies: fakeRequestCookies({ refreshToken: 'old-refresh' }),
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

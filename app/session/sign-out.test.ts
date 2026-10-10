import {
  ESignOutReason,
  endSession,
  readSignOutReason,
  signOutUrl,
} from '@/app/session/sign-out';
import { describe, expect, it } from 'vitest';

const fakeCookieStore = () => {
  const writes: { name: string; value: string; options: any }[] = [];
  return {
    writes,
    set: (name: string, value: string, options: any) => {
      writes.push({ name, value, options });
    },
  };
};

const expired = (domain?: string) => ({
  value: '',
  options: expect.objectContaining({
    path: '/',
    maxAge: 0,
    ...(domain ? { domain } : {}),
  }),
});

describe('ending a session', () => {
  it('clears both cookies with the domain', () => {
    const cookies = fakeCookieStore();

    endSession(cookies, { domain: 'bitewise.test' });

    expect(cookies.writes).toEqual([
      { name: 'accessToken', ...expired('bitewise.test') },
      { name: 'refreshToken', ...expired('bitewise.test') },
    ]);
  });

  it('clears host-only cookies when no domain is configured', () => {
    const cookies = fakeCookieStore();

    endSession(cookies, {});

    expect(cookies.writes).toHaveLength(2);
    for (const { options } of cookies.writes) {
      expect(options).not.toHaveProperty('domain');
    }
  });

  it('goes to the sign-in page without a reason', () => {
    expect(endSession(fakeCookieStore(), {})).toBe('/');
  });

  it('carries the reason to the sign-in page', () => {
    expect(
      endSession(fakeCookieStore(), { reason: ESignOutReason.EXPIRED }),
    ).toBe('/?reason=expired');
  });
});

describe('sign-out URL', () => {
  it.each([
    [undefined, '/signout'],
    [ESignOutReason.EXPIRED, '/signout?reason=expired'],
  ])('reason %s → %s', (reason, url) => {
    expect(signOutUrl(reason)).toBe(url);
  });

  it.each([
    ['reason=expired', ESignOutReason.EXPIRED],
    ['reason=<script>', undefined],
    ['', undefined],
  ])('reads %j as %s', (query, reason) => {
    expect(readSignOutReason(new URLSearchParams(query))).toBe(reason);
  });
});

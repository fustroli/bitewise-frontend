import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createGateway } from '@/app/utils/helpers/server/gateway';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT ${path}`);
  }),
}));

const BASE_URL = 'https://api.test';
const TOKEN = 'test-token';

const fakeFetch = vi.fn<typeof fetch>();

const gateway = ({ token }: { token?: string } = { token: TOKEN }) =>
  createGateway({
    baseUrl: BASE_URL,
    getToken: async () => token,
    fetch: fakeFetch,
  });

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

const lastCall = () => {
  const [url, init] = fakeFetch.mock.calls.at(-1)!;
  return { url: String(url), init: init!, headers: init!.headers as any };
};

beforeEach(() => {
  fakeFetch.mockReset();
});

describe('backend gateway', () => {
  it('returns parsed JSON on success', async () => {
    fakeFetch.mockResolvedValue(jsonResponse({ id: 1, name: 'Oats' }));

    const result = await gateway()('ingredient/1');

    expect(result).toEqual({ ok: true, data: { id: 1, name: 'Oats' } });
    expect(lastCall().url).toBe(`${BASE_URL}/ingredient/1`);
    expect(lastCall().headers.Authorization).toBe(`Bearer ${TOKEN}`);
  });

  it('returns ok with no data on 204', async () => {
    fakeFetch.mockResolvedValue(new Response(null, { status: 204 }));

    const result = await gateway()('ingredient/1', 'DELETE');

    expect(result).toEqual({ ok: true, data: undefined });
  });

  it.each([
    ['a string message', { message: 'Name taken' }, 'Name taken'],
    [
      'an array message',
      { message: ['name is required', 'unit is invalid'] },
      'name is required, unit is invalid',
    ],
    ['an error field', { error: 'Bad Request' }, 'Bad Request'],
  ])('returns the backend message given as %s', async (_, body, message) => {
    fakeFetch.mockResolvedValue(jsonResponse(body, 400));

    const result = await gateway()('ingredient', 'POST', { name: 'x' });

    expect(result).toEqual({ ok: false, status: 400, message });
  });

  it('falls back to the status line for a non-JSON error body', async () => {
    fakeFetch.mockResolvedValue(
      new Response('<html>oops</html>', {
        status: 502,
        statusText: 'Bad Gateway',
      }),
    );

    const result = await gateway()('ingredient');

    expect(result).toEqual({
      ok: false,
      status: 502,
      message: '502 Bad Gateway',
    });
  });

  it('redirects on 401', async () => {
    fakeFetch.mockResolvedValue(jsonResponse({ message: 'Unauthorized' }, 401));

    await expect(gateway()('users/me')).rejects.toThrow('REDIRECT /');
  });

  it('redirects without calling the backend when there is no token', async () => {
    await expect(gateway({})('users/me')).rejects.toThrow('REDIRECT /');
    expect(fakeFetch).not.toHaveBeenCalled();
  });

  it('sends JSON with a JSON Content-Type', async () => {
    fakeFetch.mockResolvedValue(jsonResponse({}));

    await gateway()('meal', 'POST', { name: 'Porridge' });

    expect(lastCall().init.body).toBe(JSON.stringify({ name: 'Porridge' }));
    expect(lastCall().headers['Content-Type']).toBe('application/json');
  });

  it('omits Content-Type for a FormData body', async () => {
    fakeFetch.mockResolvedValue(jsonResponse({}));
    const formData = new FormData();
    formData.append('file', new Blob(['img']), 'avatar.jpg');

    await gateway()('users/me/avatar', 'POST', formData);

    expect(lastCall().init.body).toBe(formData);
    expect(lastCall().headers).not.toHaveProperty('Content-Type');
  });

  it('builds the query string, skipping empty params', async () => {
    fakeFetch.mockResolvedValue(jsonResponse({ data: [], count: 0 }));

    await gateway()('meal', 'GET', undefined, {
      limit: 10,
      offset: 20,
      orderBy: undefined,
    });

    expect(lastCall().url).toBe(`${BASE_URL}/meal?limit=10&offset=20`);
  });

  it('adds no "?" when there are no params', async () => {
    fakeFetch.mockResolvedValue(jsonResponse({ data: [], count: 0 }));

    await gateway()('meal', 'GET', undefined, {});

    expect(lastCall().url).toBe(`${BASE_URL}/meal`);
  });
});

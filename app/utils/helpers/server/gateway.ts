import 'server-only';

import { IQueryParams, TApiResult } from '@/app/utils/interfaces';

import { buildQueryParams } from '@/app/utils/helpers';
import { redirect } from 'next/navigation';

export type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IGatewayDeps {
  baseUrl: string | undefined;
  /** Where the access token comes from: the cookie in production, a fixed value in tests. */
  getToken: () => Promise<string | undefined>;
  fetch?: typeof fetch;
}

const HTTP_UNAUTHORIZED = 401;
const NETWORK_ERROR_STATUS = 0;

// TODO(#31): redirect to '/signout?reason=expired' once the Session module
// lands; '/' with a stale cookie loops between '/' and the dashboard.
const SIGNED_OUT_PATH = '/';

/**
 * The only way the Next server talks to the backend. Never throws for backend
 * failures: they come back as `{ ok: false, status, message }`. A missing or
 * rejected token redirects instead (token refresh would slot in here).
 */
export const createGateway = ({
  baseUrl,
  getToken,
  fetch: fetchFn = fetch,
}: IGatewayDeps) => {
  return async function request<T = void>(
    endpoint: string,
    method: THttpMethod = 'GET',
    body?: unknown,
    params?: IQueryParams,
  ): Promise<TApiResult<T>> {
    const token = await getToken();

    if (!token) redirect(SIGNED_OUT_PATH);

    let res: Response;

    try {
      res = await fetchFn(buildUrl(baseUrl, endpoint, params), {
        method,
        headers: buildHeaders(token, body),
        body: body instanceof FormData ? body : JSON.stringify(body),
        cache: method === 'GET' ? 'no-store' : undefined,
      });
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        status: NETWORK_ERROR_STATUS,
        message: 'Could not reach the server',
      };
    }

    if (res.status === HTTP_UNAUTHORIZED) redirect(SIGNED_OUT_PATH);

    if (!res.ok) {
      return { ok: false, status: res.status, message: await readError(res) };
    }

    // 204 and other empty bodies carry no data.
    const text = await res.text();
    return { ok: true, data: (text ? JSON.parse(text) : undefined) as T };
  };
};

/** For reads: returns the data, or throws so the nearest `error.tsx` renders. */
export const unwrap = <T>(result: TApiResult<T>): T => {
  if (!result.ok) throw new Error(result.message);
  return result.data;
};

const buildUrl = (
  baseUrl: string | undefined,
  endpoint: string,
  params?: IQueryParams,
): string => {
  const query = params ? buildQueryParams(params) : '';
  return `${baseUrl}/${endpoint}${query ? `?${query}` : ''}`;
};

const buildHeaders = (token: string, body: unknown): Record<string, string> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  // fetch sets the multipart boundary itself for FormData.
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

const readError = async (res: Response): Promise<string> => {
  const fallback = `${res.status} ${res.statusText}`.trim();

  try {
    const { message, error } = await res.json();

    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string' && message) return message;
    if (typeof error === 'string' && error) return error;
  } catch {
    // Not JSON: fall back to the status line.
  }

  return fallback;
};

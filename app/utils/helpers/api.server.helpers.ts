'server-only';
'use server';

import { buildQueryParams, getErrorMessage } from '@/app/utils/helpers';

import { API_URL } from '@/app/utils/config';
import { IApiResponse } from '@/app/(modules)/[lang]/dashboard/interfaces';
import { IQueryParams } from '@/app/utils/interfaces';
import { cookies } from 'next/headers';

export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  params?: IQueryParams,
): Promise<IApiResponse<T>> {
  const accessToken = await getAccessToken();
  try {
    const url = createUrl(endpoint, params);
    const headers = createHeaders(accessToken, body);

    const res = await fetch(url, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
      cache: method === 'GET' ? 'no-store' : undefined,
    });

    if (!res.ok) {
      const errorMessage = await getErrorMessage(res);

      throw new Error(errorMessage);
    }
    // eslint-disable-next-line
    if (res.status === 204) {
      return { data: undefined as T extends void ? undefined : T };
    }

    const data = await res.json();
    return { data };
  } catch (error: unknown) {
    throw error;
  }
}

function createHeaders(
  accessToken: string,
  body?: any,
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

function createUrl(endpoint: string, params?: IQueryParams): string {
  const queryString = params ? `?${buildQueryParams(params)}` : '';
  return `${API_URL}/${endpoint}${queryString}`;
}

async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  return accessToken;
}

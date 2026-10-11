import 'server-only';

import { request, unwrap } from '@/app/utils/helpers/server';

import { IStatistics } from '@/app/(modules)/[lang]/dashboard/interfaces';

export async function fetchStatistics() {
  return unwrap(await request<IStatistics>('users/me/statistics'));
}

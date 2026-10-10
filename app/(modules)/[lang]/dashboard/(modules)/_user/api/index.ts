import 'server-only';

import { request, unwrap } from '@/app/utils/helpers/server';

import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';

export async function fetchMe() {
  return unwrap(await request<IUser>('users/me'));
}

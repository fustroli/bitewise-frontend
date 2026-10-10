'use server';

import { ESignOutReason, signOutUrl } from '@/app/session';
import { TChangePasswordSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import { redirect } from 'next/navigation';
import { request } from '@/app/utils/helpers/server';

export async function deleteUser() {
  const result = await request(`users/me`, 'DELETE');

  if (!result.ok) return result;

  redirect(signOutUrl(ESignOutReason.ACCOUNT_DELETED));
}

export async function changePassword(data: TChangePasswordSchema) {
  // 401 here means a wrong old password, not an ended Session.
  return request(`auth/change-password`, 'POST', data, undefined, {
    unauthorizedIsResult: true,
  });
}

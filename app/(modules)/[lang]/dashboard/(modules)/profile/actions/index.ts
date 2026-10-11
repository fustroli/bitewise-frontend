'use server';

import { ESignOutReason, signOutUrl } from '@/app/session';
import {
  TChangePasswordSchema,
  createChangePasswordSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import {
  actionDictionary,
  parseActionInput,
  request,
} from '@/app/utils/helpers/server';
import { redirect } from 'next/navigation';

export async function deleteUser() {
  const result = await request(`users/me`, 'DELETE');

  if (!result.ok) return result;

  redirect(signOutUrl(ESignOutReason.ACCOUNT_DELETED));
}

export async function changePassword(data: TChangePasswordSchema) {
  const { passwordPolicy } = await actionDictionary();
  const input = parseActionInput(
    createChangePasswordSchema(passwordPolicy),
    data,
  );
  if (!input.ok) return input;

  // 401 here means a wrong old password, not an ended Session.
  return request(`auth/change-password`, 'POST', input.data, undefined, {
    unauthorizedIsResult: true,
  });
}

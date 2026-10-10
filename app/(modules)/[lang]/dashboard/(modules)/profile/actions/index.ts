'use server';

import { TChangePasswordSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import { redirect } from 'next/navigation';
import { request } from '@/app/utils/helpers/server';
import { signOutUrl } from '@/app/session';

export async function deleteUser() {
  const result = await request(`users/me`, 'DELETE');

  if (!result.ok) return result;

  redirect(signOutUrl());
}

export async function changePassword(data: TChangePasswordSchema) {
  return request(`auth/change-password`, 'POST', data);
}

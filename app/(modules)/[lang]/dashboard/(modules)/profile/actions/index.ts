'use server';
'server-only';

import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { TChangePasswordSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import { apiRequest } from '@/app/utils/helpers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function deleteUser() {
  await apiRequest<void>(`users/me`, 'DELETE');

  const cookieStore = await cookies();

  cookieStore.set('accessToken', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });
  redirect('/login');
}

export async function updateUser(user: Partial<IUser>) {
  const result = await apiRequest<IUser>(`users/me`, 'PATCH', user);

  return result;
}

export async function changePassword(data: TChangePasswordSchema) {
  await apiRequest<void>(`auth/change-password`, 'POST', data);
}

export async function updateProfilePicture(formData: FormData) {
  const result = await apiRequest<IUser>(`users/me/avatar`, 'POST', formData);

  return result;
}

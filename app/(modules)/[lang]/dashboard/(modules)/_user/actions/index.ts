'use server';

import {
  IUser,
  IUserChange,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { request } from '@/app/utils/helpers/server';

export async function updateUser(change: IUserChange) {
  return request<IUser>(`users/me`, 'PATCH', change);
}

export async function updateAvatar(formData: FormData) {
  return request<IUser>(`users/me/avatar`, 'POST', formData);
}

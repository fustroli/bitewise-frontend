'use server';

import {
  IUser,
  IUserChange,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import {
  avatarFileSchema,
  userChangeSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/validations';
import { parseActionInput, request } from '@/app/utils/helpers/server';

export async function updateUser(change: IUserChange) {
  const input = parseActionInput(userChangeSchema, change);
  if (!input.ok) return input;

  return request<IUser>(`users/me`, 'PATCH', input.data);
}

export async function updateAvatar(formData: FormData) {
  const input = parseActionInput(
    avatarFileSchema,
    formData instanceof FormData ? formData.get('file') : undefined,
  );
  if (!input.ok) return input;

  // Rebuilt so only the file is forwarded.
  const body = new FormData();
  body.append('file', input.data);

  return request<IUser>(`users/me/avatar`, 'POST', body);
}

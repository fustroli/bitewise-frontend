'use server';

import {
  IEmailChangeRequest,
  IUser,
  IUserChange,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import {
  actionDictionary,
  parseActionInput,
  request,
} from '@/app/utils/helpers/server';
import {
  avatarFileSchema,
  createEmailChangeSchema,
  userChangeSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/validations';

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

/** Mails a fresh Email verification link; a no-op once verified. */
export async function resendVerification() {
  return request('auth/resend-verification', 'POST');
}

/** The User as the backend now has them, after a pending change moved. */
const reloadUser = async (result: Awaited<ReturnType<typeof request>>) =>
  result.ok ? request<IUser>('users/me') : result;

/**
 * Asks for an Email change; also the resend of a pending one. 401 means a
 * wrong password, not an ended Session.
 */
export async function requestEmailChange(data: IEmailChangeRequest) {
  const { validation } = await actionDictionary();
  const input = parseActionInput(createEmailChangeSchema(validation), data);
  if (!input.ok) return input;

  return reloadUser(
    await request('auth/email-change', 'POST', input.data, undefined, {
      unauthorizedIsResult: true,
    }),
  );
}

/** Drops the pending Email change; ends no Session. */
export async function cancelEmailChange() {
  return reloadUser(await request('auth/email-change', 'DELETE'));
}

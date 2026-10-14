import 'client-only';

import { ISignIn, ISignUp } from '@/app/(modules)/(auth)/interfaces';

import { API_URL } from '@/app/utils/config';
import { EVerifyEmailStatus } from '@/app/(modules)/(auth)/enum';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import axios from 'axios';
import axiosInstance from '@/app/lib/axios';
import { handleAxiosError } from '@/app/utils/helpers/client';

export const login = async (userData: ISignIn): Promise<IUser> => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/auth/signin`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data as IUser;
  } catch (error) {
    return handleAxiosError(error, 'Login failed');
  }
};

export const register = async (userData: ISignUp) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/auth/signup`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data as IUser;
  } catch (error) {
    return handleAxiosError(error, 'Registration failed');
  }
};

const HTTP_BAD_REQUEST = 400;

/**
 * Redeems an Email verification token. Called from the browser, so the
 * backend's throttle counts each visitor, not the Next server.
 */
export const verifyEmail = async (
  token: string,
): Promise<EVerifyEmailStatus> => {
  try {
    await axiosInstance.post(`${API_URL}/auth/verify-email`, { token });
    return EVerifyEmailStatus.VERIFIED;
  } catch (error) {
    return axios.isAxiosError(error) &&
      error.response?.status === HTTP_BAD_REQUEST
      ? EVerifyEmailStatus.INVALID
      : EVerifyEmailStatus.FAILED;
  }
};

const HTTP_TOO_MANY_REQUESTS = 429;

export type TPasswordResetRequest = 'sent' | 'throttled' | 'failed';
export type TPasswordResetConfirm = 'done' | 'invalid' | 'failed';

/**
 * Asks for a password reset link. The backend answers the same for known and
 * unknown addresses, so `sent` says nothing about the account.
 */
export const requestPasswordReset = async (
  email: string,
): Promise<TPasswordResetRequest> => {
  try {
    await axiosInstance.post(`${API_URL}/auth/password-reset`, { email });
    return 'sent';
  } catch (error) {
    return axios.isAxiosError(error) &&
      error.response?.status === HTTP_TOO_MANY_REQUESTS
      ? 'throttled'
      : 'failed';
  }
};

/** Sets the new password with the link's token; 400 is a bad or used token. */
export const confirmPasswordReset = async (body: {
  token: string;
  password: string;
  passwordConfirm: string;
}): Promise<TPasswordResetConfirm> => {
  try {
    await axiosInstance.post(`${API_URL}/auth/password-reset/confirm`, body);
    return 'done';
  } catch (error) {
    return axios.isAxiosError(error) &&
      error.response?.status === HTTP_BAD_REQUEST
      ? 'invalid'
      : 'failed';
  }
};

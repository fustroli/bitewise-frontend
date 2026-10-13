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

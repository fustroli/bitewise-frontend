import 'client-only';

import { ISignIn, ISignUp } from '@/app/(modules)/(auth)/interfaces';

import { API_URL } from '@/app/utils/config';
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

export const logout = async () => {
  try {
    const response = await axios.get(`/api/logout`);
    // eslint-disable-next-line
    if (response.status !== 200) {
      const message = `Error: ${response.data.message} (Status code: ${response.status})`;

      throw new Error(message);
    }
  } catch (error) {
    return handleAxiosError(error, 'Logout failed');
  }
};

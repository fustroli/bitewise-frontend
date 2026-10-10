import 'client-only';

import axios from 'axios';

export const handleAxiosError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || defaultMessage);
  } else {
    throw new Error(defaultMessage);
  }
};

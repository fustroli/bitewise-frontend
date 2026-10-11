import { EAuthError } from '@/app/(modules)/(auth)/enum';

/** Only known codes survive, so the sign-in page never echoes arbitrary input. */
export const parseAuthError = (
  value: string | string[] | null | undefined,
): EAuthError | undefined =>
  Object.values(EAuthError).find((error) => error === value);

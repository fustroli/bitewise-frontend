import { TApiResult } from '@/app/utils/interfaces';

const HTTP_BAD_REQUEST = 400;
const HTTP_PAYLOAD_TOO_LARGE = 413;

/**
 * An avatar upload rejected as an unusable image (400, or 413 for a too large
 * one) comes back with a technical message or a proxy's status line; shows
 * `rejectedMessage` instead. Other failures keep theirs.
 */
export const readableAvatarResult = <T>(
  result: TApiResult<T>,
  rejectedMessage: string,
): TApiResult<T> =>
  !result.ok &&
  (result.status === HTTP_BAD_REQUEST ||
    result.status === HTTP_PAYLOAD_TOO_LARGE)
    ? { ...result, message: rejectedMessage }
    : result;

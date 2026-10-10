import 'server-only';

import { cookies } from 'next/headers';
import { readAccessToken } from './cookies';

/** The gateway's token source in production. */
export const getAccessToken = async () => readAccessToken(await cookies());

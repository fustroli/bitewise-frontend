import 'server-only';

import { API_URL } from '@/app/utils/config';
import { createGateway } from './gateway';
import { getAccessToken } from '@/app/session/server';

export * from './revalidate.helpers';
export { unwrap } from './gateway';

export const request = createGateway({
  baseUrl: API_URL,
  getToken: getAccessToken,
});

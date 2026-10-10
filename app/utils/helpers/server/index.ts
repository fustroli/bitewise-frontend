import 'server-only';

import { API_URL } from '@/app/utils/config';
import { cookies } from 'next/headers';
import { createGateway } from './gateway';

export * from './revalidate.helpers';
export { unwrap } from './gateway';

export const request = createGateway({
  baseUrl: API_URL,
  getToken: async () => (await cookies()).get('accessToken')?.value,
});

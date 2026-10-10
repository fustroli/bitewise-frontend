import { ESignOutReason, parseSignOutReason } from '@/app/session';

import AuthForm from '@/app/(modules)/(auth)/components/AuthForm';
import AuthImageFrame from '@/app/(modules)/(auth)/components/AuthImageFrame';
import { getDictionary } from '@/app/i18n/dictionaries';
import { getLocale } from '@/app/i18n/helpers';
import { headers } from 'next/headers';

interface IProps {
  searchParams: Promise<{ reason?: string | string[] }>;
}

export default async function Auth({ searchParams }: IProps) {
  const reason = parseSignOutReason((await searchParams).reason);
  const dict = await getDictionary(getLocale({ headers: await headers() }));

  const notice =
    reason === ESignOutReason.EXPIRED ? dict.auth.sessionExpired : undefined;

  return (
    <div className="flex h-screen flex-col xl:mx-auto xl:max-w-[1408px] xl:flex-row xl:items-center">
      <AuthForm notice={notice} />
      <AuthImageFrame />
    </div>
  );
}

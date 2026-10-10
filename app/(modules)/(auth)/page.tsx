import { ESignOutReason, parseSignOutReason } from '@/app/session';

import AuthForm from '@/app/(modules)/(auth)/components/AuthForm';
import AuthImageFrame from '@/app/(modules)/(auth)/components/AuthImageFrame';
import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { EAuthError } from '@/app/(modules)/(auth)/enum';
import { getDictionary } from '@/app/i18n/dictionaries';
import { getLocale } from '@/app/i18n/helpers';
import { headers } from 'next/headers';

interface IProps {
  searchParams: Promise<{
    reason?: string | string[];
    error?: string | string[];
  }>;
}

export default async function Auth({ searchParams }: IProps) {
  const query = await searchParams;
  const reason = parseSignOutReason(query.reason);
  const dict = await getDictionary(getLocale({ headers: await headers() }));

  // Only known codes map to text, so the page never echoes arbitrary input.
  const reasonNotices: Record<ESignOutReason, string> = {
    [ESignOutReason.EXPIRED]: dict.auth.sessionExpired,
    [ESignOutReason.ACCOUNT_DELETED]: dict.auth.accountDeleted,
  };
  const notice =
    query.error === EAuthError.PASSWORD_FIRST
      ? dict.auth.passwordFirst
      : reason && reasonNotices[reason];

  return (
    <DictionaryProvider dictionary={dict}>
      <div className="flex h-screen flex-col xl:mx-auto xl:max-w-[1408px] xl:flex-row xl:items-center">
        <AuthForm notice={notice} />
        <AuthImageFrame />
      </div>
    </DictionaryProvider>
  );
}

import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import VerifyEmail from '@/app/(modules)/(auth)/components/VerifyEmail';
import { getDictionary } from '@/app/i18n/dictionaries';
import { getLocale } from '@/app/i18n/helpers';
import { headers } from 'next/headers';

interface IProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

/** Where the Email verification link lands, signed in or not. */
export default async function VerifyEmailPage({ searchParams }: IProps) {
  const { token } = await searchParams;
  const dict = await getDictionary(getLocale({ headers: await headers() }));

  return (
    <DictionaryProvider dictionary={dict}>
      <main className="flex h-screen flex-col items-center justify-center gap-10 px-8">
        <div className="text-2xl font-bold tracking-tight">
          BiteWise<span className="text-primary">.</span>
        </div>
        <VerifyEmail token={typeof token === 'string' ? token : undefined} />
      </main>
    </DictionaryProvider>
  );
}

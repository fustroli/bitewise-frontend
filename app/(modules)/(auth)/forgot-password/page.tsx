import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import ForgotPassword from '@/app/(modules)/(auth)/components/ForgotPassword';
import { getDictionary } from '@/app/i18n/dictionaries';
import { getLocale } from '@/app/i18n/helpers';
import { headers } from 'next/headers';

interface IProps {
  searchParams: Promise<{ email?: string | string[] }>;
}

/** Asks for a reset link; the sign-in form passes the typed email along. */
export default async function ForgotPasswordPage({ searchParams }: IProps) {
  const { email } = await searchParams;
  const dict = await getDictionary(getLocale({ headers: await headers() }));

  return (
    <DictionaryProvider dictionary={dict}>
      <main className="flex h-screen flex-col items-center justify-center gap-10 px-8">
        <div className="text-2xl font-bold tracking-tight">
          BiteWise<span className="text-primary">.</span>
        </div>
        <ForgotPassword email={typeof email === 'string' ? email : undefined} />
      </main>
    </DictionaryProvider>
  );
}

import { isLocale } from '@/app/i18n/settings';
import { notFound } from 'next/navigation';

/** Every route under an unsupported `[lang]` (e.g. `/xx`, `/constructor`) is a 404. */
export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return children;
}

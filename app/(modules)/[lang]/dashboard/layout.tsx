import AppBar from '@/app/(modules)/[lang]/dashboard/components/AppBar';
import { AppSidebar } from '@/app/(modules)/[lang]/dashboard/components/AppSidebar';
import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { SidebarProvider } from '@/app/components/ui/sidebar';
import { TLocale } from '@/app/i18n/settings';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import { fetchMe } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/actions';
import { getDictionary } from '@/app/i18n/dictionaries';
import { notFound } from 'next/navigation';

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as TLocale);
  const user = await fetchMe();

  if (!user) {
    notFound();
  }

  return (
    <DictionaryProvider dictionary={dictionary}>
      <UserProvider authUser={user.data as IUser}>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <AppBar />
            {children}
          </main>
        </SidebarProvider>
      </UserProvider>
    </DictionaryProvider>
  );
}

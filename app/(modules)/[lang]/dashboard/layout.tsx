import AppBar from '@/app/(modules)/[lang]/dashboard/components/AppBar';
import { AppSidebar } from '@/app/(modules)/[lang]/dashboard/components/AppSidebar';
import { ComparisonProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/provider';
import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import EmailVerificationBanner from '@/app/(modules)/[lang]/dashboard/components/EmailVerificationBanner';
import { SidebarProvider } from '@/app/components/ui/sidebar';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import { fetchMe } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/api';
import { getDictionary } from '@/app/i18n/dictionaries';

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const [dictionary, user] = await Promise.all([
    getDictionary(lang),
    fetchMe(),
  ]);

  return (
    <DictionaryProvider dictionary={dictionary}>
      <UserProvider authUser={user}>
        <ComparisonProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <AppBar />
              <EmailVerificationBanner />
              {children}
            </main>
          </SidebarProvider>
        </ComparisonProvider>
      </UserProvider>
    </DictionaryProvider>
  );
}

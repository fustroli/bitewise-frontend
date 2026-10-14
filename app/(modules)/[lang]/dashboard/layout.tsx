import DesktopSidebar from '@/app/(modules)/[lang]/dashboard/components/AppNav/DesktopSidebar';
import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import EmailVerificationBanner from '@/app/(modules)/[lang]/dashboard/components/EmailVerificationBanner';
import MobileTabBar from '@/app/(modules)/[lang]/dashboard/components/AppNav/MobileTabBar';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import { fetchMe } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/api';
import { getDictionary } from '@/app/i18n/dictionaries';

/**
 * Sidebar from `md` up, a bottom tab bar below. Pages render their children
 * straight into the column (a `PageHeader` first), which spaces them.
 */
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
        <div className="flex min-h-dvh">
          <DesktopSidebar />
          <main className="min-w-0 flex-1 px-4 pb-28 pt-4 md:px-10 md:pb-18 md:pt-8">
            <div className="mx-auto flex max-w-[1180px] flex-col gap-8 md:gap-12">
              {children}
              {/* After the page so the phone app bar stays first. */}
              <EmailVerificationBanner />
            </div>
          </main>
        </div>
        <MobileTabBar />
      </UserProvider>
    </DictionaryProvider>
  );
}

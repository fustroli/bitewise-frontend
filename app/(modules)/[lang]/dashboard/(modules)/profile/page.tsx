import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

import { EProfileView } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/enum';
import { IPageProps } from '@/app/utils/interfaces';
import PageHeader from '@/app/components/layout/PageHeader';
import Preferences from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Appearance';
import Profile from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile';
import Security from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Security';
import SignOutButton from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/SignOutButton';
import { getDictionary } from '@/app/i18n/dictionaries';

export default async function Page(props: IPageProps) {
  const { lang } = await props.params;
  const { profile, dashboard } = await getDictionary(lang);

  return (
    <>
      <PageHeader
        title={dashboard.sidebar.account}
        actions={<SignOutButton />}
      />
      <section>
        <Tabs defaultValue={EProfileView.MY_PROFILE}>
          <TabsList className="">
            <TabsTrigger value={EProfileView.MY_PROFILE}>
              {profile.menuOptions.profile}
            </TabsTrigger>
            <TabsTrigger value={EProfileView.SECURITY}>
              {profile.menuOptions.security}
            </TabsTrigger>
            <TabsTrigger value={EProfileView.PREFERENCES}>
              {profile.menuOptions.preferences}
            </TabsTrigger>
          </TabsList>
          <div className="pt-8">
            <TabsContent value={EProfileView.MY_PROFILE}>
              <Profile />
            </TabsContent>
            <TabsContent value={EProfileView.SECURITY}>
              <Security />
            </TabsContent>
            <TabsContent value={EProfileView.PREFERENCES}>
              <Preferences />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </>
  );
}

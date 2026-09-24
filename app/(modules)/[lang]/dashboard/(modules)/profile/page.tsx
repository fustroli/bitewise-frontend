import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

import { EProfileView } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/enum';
import { IPageProps } from '@/app/utils/interfaces';
import Notifications from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Notifications';
import PlansAndBilling from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/PlansAndBilling';
import Preferences from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Appearance';
import Profile from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile';
import Security from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Security';
import { getDictionary } from '@/app/i18n/dictionaries';

export default async function Page(props: IPageProps) {
  const { lang } = await props.params;
  const { profile } = await getDictionary(lang);

  return (
    <div className="mt-8 p-2 md:p-4 xl:p-8">
      <nav></nav>
      <section>
        <Tabs defaultValue={EProfileView.MY_PROFILE}>
          <TabsList className="">
            <TabsTrigger value={EProfileView.MY_PROFILE}>
              {profile.menuOptions.profile}
            </TabsTrigger>
            <TabsTrigger value={EProfileView.SECURITY}>
              {profile.menuOptions.security}
            </TabsTrigger>
            <TabsTrigger value={EProfileView.BILLING}>
              {profile.menuOptions.billing}
            </TabsTrigger>
            <TabsTrigger value={EProfileView.NOTIFICATIONS}>
              {profile.menuOptions.notifications}
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
            <TabsContent value={EProfileView.BILLING}>
              <PlansAndBilling />
            </TabsContent>
            <TabsContent value={EProfileView.NOTIFICATIONS}>
              <Notifications />
            </TabsContent>
            <TabsContent value={EProfileView.PREFERENCES}>
              <Preferences />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
}

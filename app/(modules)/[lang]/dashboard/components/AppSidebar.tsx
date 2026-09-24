'use client';

import {
  MENU_ITEMS,
  SUB_MENU_ITEMS,
} from '@/app/(modules)/[lang]/dashboard/constants';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from '@/app/components/ui/sidebar';

import Link from 'next/link';
import MenuItem from '@/app/(modules)/[lang]/dashboard/components/MenuItem';
import UpgradeCard from '@/app/(modules)/[lang]/dashboard/components/UpgradeCard';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useParams } from 'next/navigation';

export function AppSidebar() {
  const params = useParams();
  const { dashboard } = useDictionary();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="px-8 pb-6 pt-10">
        <Link
          href={`/${params.lang}/dashboard`}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          BiteWise<span className="text-primary">.</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex h-full flex-col gap-4 px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {dashboard.sidebar.app}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {MENU_ITEMS.map((item) => {
                const route = `/${params.lang}/dashboard${item.route}`;

                return <MenuItem key={item.label} item={item} route={route} />;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {dashboard.sidebar.other}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {SUB_MENU_ITEMS.map((item) => {
                const route = `/${params.lang}/dashboard${item.route}`;

                return <MenuItem key={item.label} item={item} route={route} />;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <UpgradeCard href={`/${params.lang}/dashboard/payment-plans`} />
      </SidebarFooter>
    </Sidebar>
  );
}

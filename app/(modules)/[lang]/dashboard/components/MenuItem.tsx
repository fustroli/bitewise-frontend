'use client';

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/components/ui/sidebar';

import { IMenuItem } from '@/app/(modules)/[lang]/dashboard/interfaces';
import Link from 'next/link';
import { cn } from '@/app/lib';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { usePathname } from 'next/navigation';

interface IProps {
  route: string;
  item: IMenuItem;
}
const MenuItem = ({ item, route }: IProps) => {
  const pathname = usePathname();
  const { dashboard } = useDictionary();

  // Routes may carry a query string, the pathname never does
  const isActive = route.split('?')[0] === pathname;

  const labelText =
    dashboard.sidebar[item.label as keyof typeof dashboard.sidebar];

  return (
    <SidebarMenuItem key={item.label}>
      <SidebarMenuButton
        asChild
        className={cn(
          'h-11 gap-3 rounded-md px-4 font-medium text-sidebar-foreground transition-all duration-150 [&>svg]:size-5',
          isActive &&
            'bg-primary text-primary-foreground shadow-primary hover:bg-primary hover:text-primary-foreground',
        )}
      >
        <Link href={route}>
          <item.icon />
          <span className="first-letter:uppercase">{labelText}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default MenuItem;

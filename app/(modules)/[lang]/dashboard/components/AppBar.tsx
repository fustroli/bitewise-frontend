'use client';

import { Bell, LogOut } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import CustomBreadCrumbs from '@/app/(modules)/[lang]/dashboard/components/CustomBreadCrumbs';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import { SidebarTrigger } from '@/app/components/ui/sidebar';
import UserProfile from '@/app/(modules)/[lang]/dashboard/components/UserProfile';
import { logout } from '@/app/(modules)/(auth)/api';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/app/hooks/use-toast';

const iconButtonClasses =
  'size-10 rounded-md bg-card text-muted-foreground shadow-soft hover:bg-accent hover:text-foreground';

const AppBar = () => {
  const dict = useDictionary();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      toast({
        variant: 'error',
        description: (error?.message as string) || 'Uknown Error',
      });
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-6 md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className={iconButtonClasses} />
        <CustomBreadCrumbs />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className={iconButtonClasses}
          onClick={() => {
            // TODO: notifications'
          }}
        >
          <Bell />
        </Button>
        <LoadingButton
          variant="ghost"
          size="icon"
          className={iconButtonClasses}
          onClick={handleLogout}
          loading={isLoading}
          aria-label={dict.dashboard.appbar.logout}
          title={dict.dashboard.appbar.logout}
        >
          <LogOut />
        </LoadingButton>
        <UserProfile />
      </div>
    </header>
  );
};

export default AppBar;

'use client';

import CustomBreadCrumbs from '@/app/(modules)/[lang]/dashboard/components/CustomBreadCrumbs';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import { LogOut } from 'lucide-react';
import { SidebarTrigger } from '@/app/components/ui/sidebar';
import UserProfile from '@/app/(modules)/[lang]/dashboard/components/UserProfile';
import { signOutUrl } from '@/app/session';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useState } from 'react';

const iconButtonClasses =
  'size-10 rounded-md bg-card text-muted-foreground shadow-soft hover:bg-accent hover:text-foreground';

const AppBar = () => {
  const dict = useDictionary();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-6 md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className={iconButtonClasses} />
        <CustomBreadCrumbs />
      </div>
      <div className="flex items-center gap-3">
        <UserProfile />
        {/* A form POST, never a <Link>: prefetching would sign the user out. */}
        <form
          action={signOutUrl()}
          method="post"
          onSubmit={() => setIsLoading(true)}
        >
          <LoadingButton
            type="submit"
            variant="ghost"
            size="icon"
            className={iconButtonClasses}
            loading={isLoading}
            aria-label={dict.dashboard.appbar.logout}
            title={dict.dashboard.appbar.logout}
          >
            <LogOut />
          </LoadingButton>
        </form>
      </div>
    </header>
  );
};

export default AppBar;

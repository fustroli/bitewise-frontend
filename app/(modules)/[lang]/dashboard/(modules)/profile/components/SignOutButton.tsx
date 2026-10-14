'use client';

import LoadingButton from '@/app/components/buttons/LoadingButton';
import { LogOut } from 'lucide-react';
import { signOutUrl } from '@/app/session';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useState } from 'react';

interface IProps {
  className?: string;
}

/** Ends the Session. A form POST, never a <Link>: prefetching would sign out. */
const SignOutButton = ({ className }: IProps) => {
  const label = useDictionary().dashboard.appbar.logout;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      action={signOutUrl()}
      method="post"
      onSubmit={() => setIsLoading(true)}
      className={className}
    >
      <LoadingButton
        type="submit"
        variant="outline"
        loading={isLoading}
        className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut aria-hidden />
        {label}
      </LoadingButton>
    </form>
  );
};

export default SignOutButton;

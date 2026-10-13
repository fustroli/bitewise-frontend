'use client';

import Link from 'next/link';
import UserAvatar from '@/app/(modules)/[lang]/dashboard/(modules)/_user/components/UserAvatar';
import { useParams } from 'next/navigation';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

const UserProfile = () => {
  const { user } = useUserContext();
  const params = useParams();

  return (
    <Link
      href={`/${params.lang}/dashboard/profile`}
      className="flex items-center gap-3 rounded-full transition-opacity hover:opacity-80"
    >
      <span className="hidden text-sm font-medium text-muted-foreground md:block">
        {user.email}
      </span>
      <UserAvatar user={user} className="size-10 rounded-md" />
    </Link>
  );
};

export default UserProfile;

'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';

import Link from 'next/link';
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
      <Avatar className="size-10 rounded-md">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="rounded-md">
          {/* Plain img: Radix allows only one AvatarImage per Avatar */}
          <img
            src="https://github.com/shadcn.png"
            alt=""
            className="aspect-square size-full"
          />
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserProfile;

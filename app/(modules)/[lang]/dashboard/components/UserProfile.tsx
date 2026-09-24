'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';

import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

const UserProfile = () => {
  const { user } = useUserContext();

  return (
    <div className="mb-16 flex flex-col items-center justify-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          {/* Plain img: Radix allows only one AvatarImage per Avatar */}
          <img
            src="https://github.com/shadcn.png"
            alt=""
            className="aspect-square size-full"
          />
        </AvatarFallback>
      </Avatar>
      <div>{user.email}</div>
    </div>
  );
};

export default UserProfile;

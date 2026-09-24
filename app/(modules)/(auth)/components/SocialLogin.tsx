'use client';

import { API_URL } from '@/app/utils/config';
import { Button } from '@/app/components/ui/button';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  url: string;
}
const SocialLogin = ({ children, url }: IProps) => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}${url}`;
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-11 bg-card shadow-soft [&_svg]:fill-current"
      onClick={handleGoogleLogin}
    >
      {children}
    </Button>
  );
};

export default SocialLogin;

'use client';

import * as api from '../api';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import { EVerifyEmailStatus } from '@/app/(modules)/(auth)/enum';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  token?: string;
}

// Signed out, the proxy sends this on to sign-in; signed in, the dashboard's
// banner offers a new link.
const DASHBOARD_PATH = '/dashboard';

const VerifyEmail = ({ token }: IProps) => {
  const { emailVerification: text } = useDictionary();
  const [status, setStatus] = useState(
    token ? EVerifyEmailStatus.VERIFYING : EVerifyEmailStatus.INVALID,
  );
  // Redeem once: a second concurrent call (e.g. Strict Mode) would lose the
  // race for the single-use token and come back invalid.
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    api.verifyEmail(token).then(setStatus);
  }, [token]);

  if (status === EVerifyEmailStatus.VERIFYING) {
    return (
      <p className="flex items-center gap-2" role="status">
        <LoaderCircle className="animate-spin" />
        {text.verifying}
      </p>
    );
  }

  const { title, body, action } = {
    [EVerifyEmailStatus.VERIFIED]: {
      title: text.verifiedTitle,
      body: text.verified,
      action: text.continue,
    },
    [EVerifyEmailStatus.INVALID]: {
      title: text.invalidTitle,
      body: text.invalid,
      action: text.requestNew,
    },
    [EVerifyEmailStatus.FAILED]: {
      title: text.failedTitle,
      body: text.failed,
      action: text.continue,
    },
  }[status];

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>{body}</p>
      <Button asChild>
        <Link href={DASHBOARD_PATH}>{action}</Link>
      </Button>
    </div>
  );
};

export default VerifyEmail;

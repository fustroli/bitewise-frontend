'use client';

import * as api from '../api';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  token?: string;
  /** Whether this browser has a Session; the others were signed out. */
  signedIn: boolean;
}

type TStatus = 'confirming' | api.TEmailChangeConfirm;

const ConfirmEmailChange = ({ token, signedIn }: IProps) => {
  const { emailChange: text } = useDictionary();
  const [status, setStatus] = useState<TStatus>(
    token ? 'confirming' : 'invalid',
  );
  // Redeem once, even under Strict Mode.
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    api.confirmEmailChange(token).then(setStatus);
  }, [token]);

  if (status === 'confirming') {
    return (
      <p className="flex items-center gap-2" role="status">
        <LoaderCircle className="animate-spin" />
        {text.confirming}
      </p>
    );
  }

  const { title, body } = {
    done: { title: text.confirmedTitle, body: text.confirmed },
    invalid: { title: text.invalidTitle, body: text.invalid },
    taken: { title: text.takenTitle, body: text.taken },
    failed: { title: text.failedTitle, body: text.failed },
  }[status];

  const href = status === 'done' && signedIn ? '/dashboard/profile' : '/';
  const action =
    status === 'done' && signedIn ? text.returnToSettings : text.signIn;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>{status === 'done' && !signedIn ? text.confirmedSignedOut : body}</p>
      <Button asChild>
        <Link href={href}>{action}</Link>
      </Button>
    </div>
  );
};

export default ConfirmEmailChange;

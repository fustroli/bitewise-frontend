'use client';

import * as api from '../api';

import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useState } from 'react';

interface IProps {
  token?: string;
}

type TStatus = 'idle' | 'cancelling' | api.TEmailChangeCancel;

/** Cancels only on a button press: mail scanners prefetch the link. */
const CancelEmailChange = ({ token }: IProps) => {
  const { emailChange: text } = useDictionary();
  const [status, setStatus] = useState<TStatus>(token ? 'idle' : 'invalid');

  async function cancel() {
    setStatus('cancelling');
    setStatus(await api.cancelEmailChange(token ?? ''));
  }

  if (status === 'idle' || status === 'cancelling' || status === 'failed') {
    return (
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">{text.cancelTitle}</h1>
        <p>{text.cancelIntro}</p>
        {status === 'failed' && (
          <p role="alert" className="text-destructive">
            {text.failed}
          </p>
        )}
        <LoadingButton loading={status === 'cancelling'} onClick={cancel}>
          {text.cancelAction}
        </LoadingButton>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">{text.invalidTitle}</h1>
        <p>{text.invalid}</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-sm flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-bold">{text.cancelledTitle}</h1>
      <p>{text.cancelledDone}</p>
      <Button asChild>
        <Link href="/forgot-password">{text.setPassword}</Link>
      </Button>
    </div>
  );
};

export default CancelEmailChange;

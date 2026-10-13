'use client';

import { useEffect, useState } from 'react';

import LoadingButton from '@/app/components/buttons/LoadingButton';
import { MailWarning } from 'lucide-react';
import { interpolate } from '@/app/utils/helpers';
import { resendVerification } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/actions';
import { toastResult } from '@/app/utils/helpers/client';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

const HTTP_TOO_MANY_REQUESTS = 429;
// Seconds the button waits after a send or a throttle. The backend's throttle
// is the real limit; this keeps the User from running into it.
export const RESEND_COOLDOWN_SECONDS = 60;
const SECOND_MS = 1000;

const secondsUntil = (deadline: number) =>
  Math.max(0, Math.ceil((deadline - Date.now()) / SECOND_MS));

/** Asks a User who hasn't completed Email verification to do so. */
const EmailVerificationBanner = () => {
  const { emailVerification: text } = useDictionary();
  const { user } = useUserContext();
  const [isSending, setIsSending] = useState(false);
  // A deadline, not a count, so a throttled background tab stays accurate.
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!cooldownUntil) return;
    const update = () => setSecondsLeft(secondsUntil(cooldownUntil));
    update();
    const timer = setInterval(update, SECOND_MS);
    return () => clearInterval(timer);
  }, [cooldownUntil]);

  if (user.emailVerified !== false) return null;

  const resend = async () => {
    setIsSending(true);
    const result = await resendVerification();
    setIsSending(false);

    const throttled = !result.ok && result.status === HTTP_TOO_MANY_REQUESTS;
    if (result.ok || throttled) {
      setCooldownUntil(Date.now() + RESEND_COOLDOWN_SECONDS * SECOND_MS);
    }

    toastResult(
      throttled ? { ...result, message: text.resendThrottled } : result,
      interpolate(text.resent, { email: user.email }),
    );
  };

  return (
    <div className="mb-6 px-4 md:px-8">
      <div
        role="alert"
        className="flex flex-wrap items-center gap-4 rounded-lg border-2 border-primary bg-primary/10 p-4 shadow-soft"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <MailWarning className="size-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">{text.bannerTitle}</p>
          <p className="text-sm text-muted-foreground">
            {interpolate(text.banner, { email: user.email })}
          </p>
        </div>
        <LoadingButton
          loading={isSending}
          disabled={secondsLeft > 0}
          onClick={resend}
        >
          {secondsLeft > 0
            ? interpolate(text.resendIn, { seconds: secondsLeft })
            : text.resend}
        </LoadingButton>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;

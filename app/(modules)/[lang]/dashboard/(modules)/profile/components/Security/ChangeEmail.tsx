'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import {
  TEmailChangeSchema,
  createEmailChangeSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/validations';
import { useMemo, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import { Form } from '@/app/components/ui/form';
import InputField from '@/app/components/form/InputField';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import PasswordInput from '@/app/components/form/PasswordInput';
import Typography from '@/app/components/Typography';
import { interpolate } from '@/app/utils/helpers';
import { toastResult } from '@/app/utils/helpers/client';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { zodResolver } from '@hookform/resolvers/zod';

const MINUTES_END = 16;

/** Fixed format and zone, so the server and browser render the same text. */
const formatExpiry = (iso: string) =>
  `${new Date(iso).toISOString().slice(0, MINUTES_END).replace('T', ' ')} UTC`;

const ChangeEmail = () => {
  const { emailChange: text, validation } = useDictionary();
  const { user, requestEmailChange, cancelEmailChange } = useUserContext();
  const [resending, setResending] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const schema = useMemo(
    () => createEmailChangeSchema(validation),
    [validation],
  );

  const form = useForm<TEmailChangeSchema>({
    resolver: zodResolver(schema),
    defaultValues: { newEmail: '', password: '' },
  });

  const pendingEmail = user.pendingEmail ?? null;
  const showForm = !pendingEmail || resending;

  async function onSubmit(values: TEmailChangeSchema) {
    const result = await requestEmailChange(values);

    if (
      toastResult(
        result,
        interpolate(text.requested, { email: values.newEmail }),
      )
    ) {
      form.reset();
      setResending(false);
    }
  }

  async function cancel() {
    setCancelling(true);
    const result = await cancelEmailChange();
    setCancelling(false);

    if (toastResult(result, text.cancelled)) setResending(false);
  }

  function resend() {
    form.reset({ newEmail: pendingEmail ?? '', password: '' });
    setResending(true);
  }

  if (user.hasPassword === false) {
    return (
      <Card>
        <CardContent className="space-y-2 pt-6">
          <Typography variant="p" className="font-medium">
            {user.email}
          </Typography>
          <Typography variant="p">{text.managedByGoogle}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <Typography variant="p" className="font-medium">
          {interpolate(text.current, { email: user.email })}
        </Typography>

        {pendingEmail && (
          <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
            <p className="flex-1 text-sm">
              {interpolate(text.pending, {
                email: pendingEmail,
                expires: user.pendingEmailExpiresAt
                  ? formatExpiry(user.pendingEmailExpiresAt)
                  : '',
              })}
            </p>
            <Button variant="outline" type="button" onClick={resend}>
              {text.resend}
            </Button>
            <LoadingButton
              variant="outline"
              type="button"
              loading={cancelling}
              onClick={cancel}
            >
              {text.cancel}
            </LoadingButton>
          </div>
        )}

        {showForm && (
          <Form {...form}>
            <form
              className="flex flex-col gap-6 md:w-1/2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputField
                control={form.control}
                label={text.newEmail}
                name="newEmail"
                type="email"
              />
              <PasswordInput
                control={form.control}
                label={text.currentPassword}
                name="password"
              />
              <LoadingButton
                type="submit"
                className="w-fit"
                loading={form.formState.isSubmitting}
              >
                {resending ? text.resend : text.submit}
              </LoadingButton>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default ChangeEmail;

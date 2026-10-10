'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import {
  TChangePasswordSchema,
  createChangePasswordSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';

import { CHANGE_PASSWORD_DEFAULT_VALUES } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/constants';
import { Form } from '@/app/components/ui/form';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import { PASSWORD_RULE_KEYS } from '@/app/utils/password-policy';
import PasswordInput from '@/app/components/form/PasswordInput';
import Typography from '@/app/components/Typography';
import { changePassword } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/actions';
import { toastResult } from '@/app/utils/helpers/client';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

const ChangePassword = () => {
  const { profile, passwordPolicy } = useDictionary();

  const changePasswordSchema = useMemo(
    () => createChangePasswordSchema(passwordPolicy),
    [passwordPolicy],
  );

  const form = useForm<TChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: CHANGE_PASSWORD_DEFAULT_VALUES,
  });

  async function onSubmit(values: TChangePasswordSchema) {
    const result = await changePassword(values);

    if (toastResult(result, profile.security.passwordChanged)) form.reset();
  }
  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            className="relative flex flex-col gap-8 pt-6 xl:flex-row"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <article className="w-1/2 space-y-6">
              <PasswordInput
                control={form.control}
                label={profile.security.oldPassword}
                name="oldPassword"
              />
              <PasswordInput
                control={form.control}
                label={profile.security.password}
                name="password"
              />

              <PasswordInput
                control={form.control}
                label={profile.security.confirmPassword}
                name="confirmPassword"
              />
            </article>

            <article className="flex w-1/2 flex-col items-center justify-center">
              <ul className="list-disc space-y-3">
                {PASSWORD_RULE_KEYS.map((key) => (
                  <li key={key}>
                    <Typography variant="p" className="font-medium">
                      {passwordPolicy[key]}
                    </Typography>
                  </li>
                ))}
              </ul>

              <LoadingButton
                variant="default"
                type="submit"
                className="absolute bottom-0 right-0 flex w-fit justify-end"
                loading={form.formState.isSubmitting}
              >
                {profile.security.changePassword}
              </LoadingButton>
            </article>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;

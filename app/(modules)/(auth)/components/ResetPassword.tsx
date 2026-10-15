'use client';

import * as api from '../api';

import {
  TResetPasswordSchema,
  createResetPasswordSchema,
} from '@/app/(modules)/(auth)/validations';
import { useMemo, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import { Form } from '@/app/components/ui/form';
import Link from 'next/link';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import PasswordInput from '@/app/components/form/PasswordInput';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

interface IProps {
  token?: string;
}

const ResetPassword = ({ token }: IProps) => {
  const { passwordReset: text, passwordPolicy } = useDictionary();
  const router = useRouter();
  const { toast } = useToast();
  const [invalid, setInvalid] = useState(!token);

  const schema = useMemo(
    () => createResetPasswordSchema(passwordPolicy),
    [passwordPolicy],
  );

  const form = useForm<TResetPasswordSchema>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit({ password, confirmPassword }: TResetPasswordSchema) {
    const result = await api.confirmPasswordReset({
      token: token ?? '',
      password,
      passwordConfirm: confirmPassword,
    });

    if (result === 'done') {
      toast({ variant: 'success', description: text.updated });
      router.push('/');
    } else if (result === 'invalid') {
      setInvalid(true);
    } else {
      toast({ variant: 'error', description: text.failed });
    }
  }

  if (invalid) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">{text.invalidTitle}</h1>
        <p>{text.invalid}</p>
        <Button asChild>
          <Link href="/forgot-password">{text.requestNew}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <h1 className="text-center text-2xl font-bold">{text.resetTitle}</h1>
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <PasswordInput
            control={form.control}
            label={text.newPassword}
            name="password"
          />
          <PasswordInput
            control={form.control}
            label={text.confirmPassword}
            name="confirmPassword"
          />
          <LoadingButton
            variant="default"
            className="w-full"
            type="submit"
            loading={form.formState.isSubmitting}
          >
            {text.updatePassword}
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;

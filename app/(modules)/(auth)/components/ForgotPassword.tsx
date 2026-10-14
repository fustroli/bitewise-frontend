'use client';

import * as api from '../api';

import {
  TForgotPasswordSchema,
  forgotPasswordSchema,
} from '@/app/(modules)/(auth)/validations';

import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Form } from '@/app/components/ui/form';
import InputField from '@/app/components/form/InputField';
import Link from 'next/link';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

interface IProps {
  email?: string;
}

const ForgotPassword = ({ email = '' }: IProps) => {
  const { passwordReset: text } = useDictionary();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const form = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email },
  });

  async function onSubmit({ email }: TForgotPasswordSchema) {
    const result = await api.requestPasswordReset(email);
    if (result === 'sent') {
      setSent(true);
    } else {
      toast({
        variant: 'error',
        description: result === 'throttled' ? text.throttled : text.failed,
      });
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <h1 className="text-center text-2xl font-bold">{text.forgotTitle}</h1>
      {sent ? (
        <Alert>
          <AlertDescription role="status">{text.sent}</AlertDescription>
        </Alert>
      ) : (
        <>
          <p className="text-center">{text.forgotIntro}</p>
          <Form {...form}>
            <form
              className="flex w-full flex-col gap-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputField
                control={form.control}
                label={text.email}
                name="email"
                type="email"
              />
              <LoadingButton
                variant="default"
                className="w-full"
                type="submit"
                loading={form.formState.isSubmitting}
              >
                {text.sendLink}
              </LoadingButton>
            </form>
          </Form>
        </>
      )}
      <Link href="/" className="text-center text-sm underline">
        {text.backToSignIn}
      </Link>
    </div>
  );
};

export default ForgotPassword;

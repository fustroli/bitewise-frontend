'use client';

import * as api from '../api';

import {
  TSignupSchema,
  createSignupSchema,
} from '@/app/(modules)/(auth)/validations';

import { Form } from '@/app/components/ui/form';
import InputField from '@/app/components/form/InputField';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import PasswordInput from '@/app/components/form/PasswordInput';
import { defaultSignUpValues } from '@/app/(modules)/(auth)/constants';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { passwordPolicy } = useDictionary();

  const signupSchema = useMemo(
    () => createSignupSchema(passwordPolicy),
    [passwordPolicy],
  );

  const form = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: defaultSignUpValues,
  });

  async function onSubmit(values: TSignupSchema) {
    try {
      await api.register(values);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'error',
        description: error.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <InputField
          control={form.control}
          type={'email'}
          label={'Email Address'}
          name={'email'}
        />
        <PasswordInput
          control={form.control}
          label="Password"
          name="password"
        />

        <PasswordInput
          control={form.control}
          label="Confirm Password"
          name="confirmPassword"
        />

        <LoadingButton
          variant="default"
          className="w-full"
          type="submit"
          loading={form.formState.isSubmitting}
        >
          Sign Up
        </LoadingButton>
      </form>
    </Form>
  );
};

export default SignUpForm;

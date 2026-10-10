'use client';

import * as api from '../api';

import {
  TSignupSchema,
  signupSchema,
} from '@/app/(modules)/(auth)/validations';

import { Form } from '@/app/components/ui/form';
import InputField from '@/app/components/form/InputField';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import PasswordInput from '@/app/(modules)/(auth)/components/PasswordInput';
import { defaultSignUpValues } from '@/app/(modules)/(auth)/constants';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();

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
          form={form}
          type={'email'}
          label={'Email Address'}
          name={'email'}
        />
        <PasswordInput form={form} label="Password" name="password" />

        <PasswordInput
          form={form}
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

'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';

interface IProps {
  form: UseFormReturn<any>;
  label: string;
  name: string;
}
const PasswordInput = ({ form, label, name }: IProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel asChild>
            <p className="first-letter:uppercase">{label}</p>
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                className={'hide-password-toggle pr-10'}
                {...field}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeIcon className="size-4" aria-hidden="true" />
                ) : (
                  <EyeOffIcon className="size-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordInput;

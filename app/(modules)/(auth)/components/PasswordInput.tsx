'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import InputField from '@/app/components/form/InputField';
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
    <InputField
      form={form}
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      endAdornment={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-full px-3 py-2 hover:bg-transparent"
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
      }
    />
  );
};

export default PasswordInput;

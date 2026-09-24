import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/app/components/ui/form';

import React from 'react';
import { Switch } from '@/app/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface IProps {
  form: UseFormReturn<any>;
  label: string;
  description: string;
  disabled?: boolean;
  name: string;
}
const SwitchFormField = ({
  form,
  label,
  description,
  disabled,
  name,
}: IProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default SwitchFormField;

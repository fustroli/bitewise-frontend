import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';

import { Input } from '@/app/components/ui/input';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface IProps {
  form: UseFormReturn<any>;
  accept: string;
  name: string;
  label: string;
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
}
const FileUploadFormField = ({
  form,
  accept,
  name,
  label,
  changeHandler,
  id,
}: IProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              id={id}
              type="file"
              accept={accept}
              onChange={changeHandler}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUploadFormField;

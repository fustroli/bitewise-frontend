import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { HTMLInputTypeAttribute, forwardRef } from 'react';

import { Input } from '@/app/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface IProps {
  form: UseFormReturn<any>;
  label?: string;
  name: string;
  type: HTMLInputTypeAttribute;
  id?: string;
  htmlFor?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

const InputField = forwardRef<HTMLInputElement, IProps>(
  ({ id, label, form, name, htmlFor, type = 'text', onBlur, ...rest }, ref) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && (
              <FormLabel asChild htmlFor={htmlFor}>
                <p className="first-letter:uppercase">{label}</p>
              </FormLabel>
            )}
            <FormControl>
              <Input
                id={id}
                type={type}
                {...field}
                {...rest}
                onBlur={onBlur}
                ref={ref}
                onChange={(event) =>
                  field.onChange(
                    type === 'number'
                      ? +event.target.value
                      : event.target.value,
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);

export default InputField;

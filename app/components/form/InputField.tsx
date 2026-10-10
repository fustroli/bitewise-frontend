import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { HTMLInputTypeAttribute, ReactNode, forwardRef } from 'react';

import { Input } from '@/app/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/app/lib/utils';

interface IProps {
  form: UseFormReturn<any>;
  label?: string;
  name: string;
  type: HTMLInputTypeAttribute;
  id?: string;
  htmlFor?: string;
  disabled?: boolean;
  endAdornment?: ReactNode;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

const InputField = forwardRef<HTMLInputElement, IProps>(
  (
    {
      id,
      label,
      form,
      name,
      htmlFor,
      type = 'text',
      disabled,
      endAdornment,
      onBlur,
      ...rest
    },
    ref,
  ) => {
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
            <div className="relative">
              <FormControl>
                <Input
                  id={id}
                  type={type}
                  {...field}
                  {...rest}
                  className={cn(endAdornment && 'pr-10')}
                  disabled={disabled}
                  onBlur={onBlur}
                  ref={(element) => {
                    field.ref(element);
                    if (typeof ref === 'function') {
                      ref(element);
                    } else if (ref) {
                      ref.current = element;
                    }
                  }}
                  onChange={(event) =>
                    field.onChange(
                      type === 'number'
                        ? +event.target.value
                        : event.target.value,
                    )
                  }
                />
              </FormControl>
              {endAdornment && (
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {endAdornment}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);

export default InputField;

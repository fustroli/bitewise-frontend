import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/app/components/ui/form';
import { ReactElement, ReactNode } from 'react';

/** What every field takes: `T` is inferred from `control`, so `name` is checked. */
export interface IFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

interface IProps<T extends FieldValues> extends IFieldProps<T> {
  label?: string;
  description?: string;
  /** Shown over the control's right edge. */
  adornment?: ReactNode;
  className?: string;
  children: (field: ControllerRenderProps<T, FieldPath<T>>) => ReactElement;
}

/** The frame every field shares: label, control, error message, adornment. */
const FieldFrame = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  adornment,
  className,
  children,
}: IProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        {(label || description) && (
          <div className="space-y-0.5">
            {label && (
              <FormLabel
                htmlFor={name}
                className="block first-letter:uppercase"
              >
                {label}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
        )}
        <div className="relative">
          {children(field)}
          {adornment && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              {adornment}
            </div>
          )}
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

/** Wraps the focusable control; its `id` is the field's name. */
export const FieldControl = ({ children }: { children: ReactElement }) => {
  const { name } = useFormField();

  return <FormControl id={name}>{children}</FormControl>;
};

export default FieldFrame;

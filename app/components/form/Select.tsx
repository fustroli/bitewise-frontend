import FieldFrame, {
  FieldControl,
  IFieldProps,
} from '@/app/components/form/FieldFrame';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import { FieldValues } from 'react-hook-form';
import { PropsWithChildren } from 'react';

interface IProps<T extends FieldValues>
  extends IFieldProps<T>, PropsWithChildren {
  label: string;
  placeholder: string;
}

const SelectField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  children,
}: IProps<T>) => (
  <FieldFrame control={control} name={name} label={label}>
    {(field) => (
      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
        <FieldControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FieldControl>
        <SelectContent>{children}</SelectContent>
      </Select>
    )}
  </FieldFrame>
);

export default SelectField;

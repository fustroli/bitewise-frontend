'use client';

import { FieldValues, UseFormReturn } from 'react-hook-form';

import InputField from '@/app/components/form/InputField';
import Typography from '@/app/components/Typography';

interface IProps<T extends FieldValues> {
  label: string;
  info?: string;
  isEditable?: boolean;
  name: string;
  form: UseFormReturn<T>;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

const InfoBox = <T extends FieldValues>({
  label,
  info,
  isEditable,
  form,
  name,
  onBlur,
}: IProps<T>) => {
  return (
    <article>
      <Typography variant="p">{label}</Typography>
      {isEditable ? (
        <div className="max-w-[200px]">
          <InputField form={form} name={name} type={'text'} onBlur={onBlur} />
        </div>
      ) : (
        <Typography variant="large">{info || '-'}</Typography>
      )}
    </article>
  );
};

export default InfoBox;

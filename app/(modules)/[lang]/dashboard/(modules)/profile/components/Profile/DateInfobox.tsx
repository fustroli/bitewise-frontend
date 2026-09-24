'use client';

import DatePicker from '@/app/components/form/DatePicker';
import { TPersonalInfoSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import Typography from '@/app/components/Typography';
import { UseFormReturn } from 'react-hook-form';
import { format } from 'date-fns';

interface IProps {
  label: string;
  info?: Date;
  isEditable?: boolean;
  form: UseFormReturn<TPersonalInfoSchema>;
}
const DateInfoBox = ({ label, info, isEditable, form }: IProps) => {
  return (
    <article>
      <Typography variant="p">{label}</Typography>
      {isEditable ? (
        <div className="max-w-[200px]">
          <DatePicker form={form} name="dateOfBirth" />
        </div>
      ) : (
        <Typography variant="large">
          {info ? format(info, 'PPP') : '-'}
        </Typography>
      )}
    </article>
  );
};

export default DateInfoBox;

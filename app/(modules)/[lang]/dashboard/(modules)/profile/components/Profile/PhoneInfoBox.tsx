'use client';

import 'react-phone-number-input/style.css';

import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import { TPersonalInfoSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import Typography from '@/app/components/Typography';
import { UseFormReturn } from 'react-hook-form';

interface IProps {
  label: string;
  info?: string;
  isEditable?: boolean;
  form: UseFormReturn<TPersonalInfoSchema>;
}
const PhoneInfoBox = ({ label, info, isEditable, form }: IProps) => {
  return (
    <article>
      <Typography variant="p">{label}</Typography>
      {isEditable ? (
        <div className="max-w-[200px] rounded-md border border-input px-3 py-1 shadow-sm">
          <PhoneInputWithCountry
            name="phoneNumber"
            control={form.control}
            className="focus:outline-none"
          />
        </div>
      ) : (
        <Typography variant="large">{info || '-'}</Typography>
      )}
    </article>
  );
};

export default PhoneInfoBox;

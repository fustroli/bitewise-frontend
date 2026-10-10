'use client';

import 'react-phone-number-input/style.css';

import { FieldValues, PathValue, UseFormReturn } from 'react-hook-form';

import DatePicker from '@/app/components/form/DatePicker';
import InputField from '@/app/components/form/InputField';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import SwitchFormField from '@/app/components/form/SwitchFormField';
import { TProfileField } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/interfaces';
import Typography from '@/app/components/Typography';
import { format } from 'date-fns';

interface IProps<TValues extends FieldValues> {
  field: TProfileField<TValues>;
  form: UseFormReturn<TValues>;
  isEditing: boolean;
  /** The saved value, shown when not editing. */
  value: unknown;
}

const ProfileField = <TValues extends FieldValues>({
  field,
  form,
  isEditing,
  value,
}: IProps<TValues>) => {
  if (field.kind === 'switch') {
    return (
      <SwitchFormField
        form={form}
        name={field.name}
        label={field.label}
        description={field.description}
        disabled={field.disabled || !isEditing}
      />
    );
  }

  return (
    <article>
      {field.label && <Typography variant="p">{field.label}</Typography>}
      {isEditing ? (
        <div className="max-w-[200px]">{renderEditView(field, form)}</div>
      ) : (
        <Typography variant="large">{readView(field, value)}</Typography>
      )}
    </article>
  );
};

const renderEditView = <TValues extends FieldValues>(
  field: Exclude<TProfileField<TValues>, { kind: 'switch' }>,
  form: UseFormReturn<TValues>,
) => {
  switch (field.kind) {
    case 'date':
      return <DatePicker form={form} name={field.name} />;
    case 'phone':
      return (
        <div className="rounded-md border border-input px-3 py-1 shadow-sm">
          <PhoneInputWithCountry
            name={field.name}
            control={form.control}
            className="focus:outline-none"
          />
        </div>
      );
    default: {
      const { normalize } = field;

      return (
        <InputField
          form={form}
          name={field.name}
          type={field.kind}
          onBlur={
            normalize &&
            ((e) =>
              form.setValue(
                field.name,
                normalize(e.target.value) as PathValue<
                  TValues,
                  typeof field.name
                >,
                { shouldValidate: true },
              ))
          }
        />
      );
    }
  }
};

const readView = <TValues extends FieldValues>(
  field: TProfileField<TValues>,
  value: unknown,
) => {
  if (!value) return '-';
  if (field.kind === 'date') return format(value as Date, 'PPP');
  return String(value);
};

export default ProfileField;

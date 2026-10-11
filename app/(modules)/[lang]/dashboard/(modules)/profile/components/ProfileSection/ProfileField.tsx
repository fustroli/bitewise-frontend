'use client';

import 'react-phone-number-input/style.css';

import { FieldValues, PathValue, UseFormReturn } from 'react-hook-form';

import DatePicker from '@/app/components/form/DatePicker';
import InputField from '@/app/components/form/InputField';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import SelectField from '@/app/components/form/Select';
import { SelectItem } from '@/app/components/ui/select';
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
        control={form.control}
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
      {field.kind === 'number' && field.hint && (
        <Typography variant="muted">{field.hint}</Typography>
      )}
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
      return <DatePicker control={form.control} name={field.name} />;
    case 'number':
      return (
        <InputField
          control={form.control}
          name={field.name}
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
        />
      );
    case 'select':
      return (
        <SelectField
          control={form.control}
          name={field.name}
          placeholder={field.placeholder}
          clearLabel={field.clearLabel}
        >
          {field.options.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectField>
      );
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
          control={form.control}
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
  if (value === undefined || value === null || value === '') return '-';
  if (field.kind === 'date') return format(value as Date, 'PPP');
  if (field.kind === 'select') {
    return field.options.find((option) => option.value === value)?.label;
  }
  return String(value);
};

export default ProfileField;

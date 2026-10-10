import { FieldValues, Path } from 'react-hook-form';

interface IProfileFieldBase<TValues extends FieldValues> {
  name: Path<TValues>;
  label?: string;
}

interface IProfileTextField<
  TValues extends FieldValues,
> extends IProfileFieldBase<TValues> {
  kind: 'text' | 'email';
  /** Applied to the input's value when it loses focus. */
  normalize?: (value: string) => string;
}

interface IProfilePhoneOrDateField<
  TValues extends FieldValues,
> extends IProfileFieldBase<TValues> {
  kind: 'phone' | 'date';
}

interface IProfileSwitchField<
  TValues extends FieldValues,
> extends IProfileFieldBase<TValues> {
  kind: 'switch';
  label: string;
  description: string;
  disabled?: boolean;
}

/** One field of a Profile section: how it reads, and how it is edited. */
export type TProfileField<TValues extends FieldValues> =
  | IProfileTextField<TValues>
  | IProfilePhoneOrDateField<TValues>
  | IProfileSwitchField<TValues>;

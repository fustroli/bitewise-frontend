import { DefaultValues, FieldValues, UseFormReturn } from 'react-hook-form';
import { ComponentType } from 'react';
import { TApiResult } from '@/app/utils/interfaces';
import { TDictionary } from '@/app/providers/dictionary-provider';
import { z } from 'zod';

export type TResourceKey = keyof TDictionary['resources'];

/** What every table row needs: an id to act on and a name to confirm with. */
export interface IResourceRecord {
  id: number;
  name: string;
}

export interface IResourceFieldsProps<TValues extends FieldValues, TFormData> {
  form: UseFormReturn<TValues>;
  formData: TFormData;
}

/** The client half of a resource: everything its add/edit dialog needs. */
export interface IResourceForm<
  TRecord extends IResourceRecord,
  TValues extends FieldValues,
  TFormData = undefined,
> {
  resourceKey: TResourceKey;
  /** Built from the dictionary so validation messages are translated. */
  schema: (dictionary: TDictionary) => z.ZodType<TValues, any>;
  defaultValues: DefaultValues<TValues>;
  toFormValues: (record: TRecord) => DefaultValues<TValues>;
  fields: ComponentType<IResourceFieldsProps<TValues, TFormData>>;
  create: (values: TValues) => Promise<TApiResult<unknown>>;
  update: (values: TValues, id: number) => Promise<TApiResult<unknown>>;
  remove: (id: number) => Promise<TApiResult<unknown>>;
}

export interface IResourceDialogProps<TRecord, TFormData> {
  record?: TRecord;
  formData: TFormData;
}

export interface IResourceRowActionsProps<TRecord, TFormData> {
  record: TRecord;
  formData: TFormData;
}

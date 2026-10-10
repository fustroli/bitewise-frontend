import {
  IResourceDialogProps,
  IResourceForm,
  IResourceRecord,
  IResourceRowActionsProps,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { FieldValues } from 'react-hook-form';
import ResourceFormDialog from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceFormDialog';
import ResourceRowActions from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceRowActions';

/**
 * Binds a resource's form half to the module's dialog and row-actions menu.
 * Call it from a `'use client'` file and re-export the results there: the
 * config holds functions, so it can't cross from server to client as a prop.
 */
export function createResourceForm<
  TRecord extends IResourceRecord,
  TValues extends FieldValues,
  TFormData = undefined,
>(config: IResourceForm<TRecord, TValues, TFormData>) {
  const Dialog = (props: IResourceDialogProps<TRecord, TFormData>) => (
    <ResourceFormDialog config={config} {...props} />
  );

  const RowActions = (props: IResourceRowActionsProps<TRecord, TFormData>) => (
    <ResourceRowActions config={config} {...props} />
  );

  return { Dialog, RowActions };
}

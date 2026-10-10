'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { FieldValues, Path, Resolver, useForm } from 'react-hook-form';
import {
  IResourceDialogProps,
  IResourceForm,
  IResourceRecord,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { useMemo, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import { Form } from '@/app/components/ui/form';
import FormDialogFooter from '@/app/components/dialogs/FormDialogFooter';
import { Plus } from 'lucide-react';
import { getResourceLabels } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';
import { toastResult } from '@/app/utils/helpers/client';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { zodResolver } from '@hookform/resolvers/zod';

/** The backend's answer to a name another of the user's items already has. */
const NAME_TAKEN_STATUS = 409;

interface IProps<
  TRecord extends IResourceRecord,
  TValues extends FieldValues,
  TFormData,
> extends IResourceDialogProps<TRecord, TFormData> {
  config: IResourceForm<TRecord, TValues, TFormData>;
}

/**
 * Add dialog without a `record`, Edit dialog with one. Closes on success
 * (resetting the Add form); stays open on failure so the input isn't lost.
 * A name already in use shows on the name field instead of a toast.
 */
function ResourceFormDialog<
  TRecord extends IResourceRecord,
  TValues extends FieldValues,
  TFormData,
>({ config, record, formData }: IProps<TRecord, TValues, TFormData>) {
  const { fields: Fields } = config;
  const dictionary = useDictionary();
  const t = dictionary.resourceTable;
  const labels = getResourceLabels(dictionary, config.resourceKey);
  const [isOpen, setIsOpen] = useState(false);

  const schema = useMemo(() => config.schema(dictionary), [config, dictionary]);

  const form = useForm<TValues>({
    resolver: zodResolver(schema) as Resolver<TValues>,
    defaultValues: record ? config.toFormValues(record) : config.defaultValues,
  });

  const handleOpenChange = (open: boolean) => {
    // Edit always starts from the record as it is now.
    if (open && record) form.reset(config.toFormValues(record));
    setIsOpen(open);
  };

  const onSubmit = async (values: TValues) => {
    const result = record
      ? await config.update(values, record.id)
      : await config.create(values);

    if (!result.ok && result.status === NAME_TAKEN_STATUS) {
      // Every resource has a name; show the clash on that field.
      form.setError('name' as Path<TValues>, { message: t.nameTaken });
      return;
    }

    if (toastResult(result, record ? t.updated : t.created)) {
      if (!record) form.reset(config.defaultValues);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {record ? (
        <DialogTrigger>{t.edit}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className="shadow-primary">
            <Plus />
            {t.add}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2 px-4 pb-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>
                {record ? labels.editTitle : labels.addTitle}
              </DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <Fields form={form} formData={formData} />
            <FormDialogFooter
              form={form}
              submitLabel={record ? t.save : t.add}
              closeLabel={t.close}
              onClose={() => setIsOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ResourceFormDialog;

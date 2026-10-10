'use client';

import {
  IResourceForm,
  IResourceRecord,
  IResourceRowActionsProps,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/app/components/ui/menubar';

import DeleteDialog from '@/app/components/DeleteDialog';
import { Ellipsis } from 'lucide-react';
import { FieldValues } from 'react-hook-form';
import ResourceFormDialog from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceFormDialog';
import { getResourceLabels } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';
import { interpolate } from '@/app/utils/helpers';
import { toastResult } from '@/app/utils/helpers/client';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps<
  TRecord extends IResourceRecord,
  TValues extends FieldValues,
  TFormData,
> extends IResourceRowActionsProps<TRecord, TFormData> {
  config: IResourceForm<TRecord, TValues, TFormData>;
}

/** Edit, then a delete confirmation naming the record. */
function ResourceRowActions<
  TRecord extends IResourceRecord,
  TValues extends FieldValues,
  TFormData,
>({ config, record, formData }: IProps<TRecord, TValues, TFormData>) {
  const dictionary = useDictionary();
  const t = dictionary.resourceTable;
  const labels = getResourceLabels(dictionary, config.resourceKey);

  const handleOnDelete = async () => {
    toastResult(await config.remove(record.id), t.deleted);
  };

  return (
    <Menubar className="w-fit border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger
          aria-label={t.actions}
          className="size-9 justify-center rounded-md p-0 text-muted-foreground hover:cursor-pointer hover:bg-accent hover:text-foreground"
        >
          <Ellipsis />
        </MenubarTrigger>
        <MenubarContent>
          <ResourceFormDialog
            config={config}
            record={record}
            formData={formData}
          />
          <MenubarSeparator />
          <DeleteDialog
            onConfirm={handleOnDelete}
            title={labels.deleteTitle}
            subtitle={interpolate(t.deleteConfirm, { name: record.name })}
            triggerLabel={t.delete}
            cancelLabel={t.cancel}
            confirmLabel={t.continue}
          />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default ResourceRowActions;

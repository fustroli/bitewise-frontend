'use client';

import { Ellipsis, Trash2 } from 'lucide-react';
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
import { FieldValues } from 'react-hook-form';
import { ROW_ACTION_ITEM_CLASS } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import ResourceFormDialog from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceFormDialog';
import { cn } from '@/app/lib/utils';
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
    <Menubar className="ml-auto w-fit border-none bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger
          aria-label={t.actions}
          className="size-9 justify-center rounded-md p-0 text-muted-foreground hover:cursor-pointer hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
        >
          <Ellipsis />
        </MenubarTrigger>
        <MenubarContent
          align="end"
          alignOffset={0}
          sideOffset={4}
          className="min-w-40 rounded-lg p-1.5 shadow-lg"
        >
          <ResourceFormDialog
            config={config}
            record={record}
            formData={formData}
          />
          <MenubarSeparator className="mx-0 my-1.5" />
          <DeleteDialog
            onConfirm={handleOnDelete}
            title={labels.deleteTitle}
            subtitle={interpolate(t.deleteConfirm, { name: record.name })}
            triggerLabel={
              <>
                <Trash2 />
                {t.delete}
              </>
            }
            triggerClassName={cn(
              ROW_ACTION_ITEM_CLASS,
              'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10 [&_svg]:text-destructive',
            )}
            cancelLabel={t.cancel}
            confirmLabel={t.continue}
          />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default ResourceRowActions;

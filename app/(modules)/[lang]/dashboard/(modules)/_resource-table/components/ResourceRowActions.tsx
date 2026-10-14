'use client';

import {
  IResourceForm,
  IResourceRecord,
  IResourceRowActionsProps,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/app/components/ui/menubar';
import { MoreHorizontal, Scale, Trash2 } from 'lucide-react';

import DeleteDialog from '@/app/components/DeleteDialog';
import { FieldValues } from 'react-hook-form';
import Link from 'next/link';
import { ROW_ACTION_ITEM_CLASS } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import ResourceFormDialog from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceFormDialog';
import { cn } from '@/app/lib/utils';
import { getResourceLabels } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';
import { interpolate } from '@/app/utils/helpers';
import { toastResult } from '@/app/utils/helpers/client';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useParams } from 'next/navigation';

interface IProps<
  TRecord extends IResourceRecord,
  TValues extends FieldValues,
  TFormData,
> extends IResourceRowActionsProps<TRecord, TFormData> {
  config: IResourceForm<TRecord, TValues, TFormData>;
}

/** Edit, Duplicate, Compare, then a delete confirmation naming the record. */
function ResourceRowActions<
  TRecord extends IResourceRecord,
  TValues extends FieldValues,
  TFormData,
>({ config, record, formData }: IProps<TRecord, TValues, TFormData>) {
  const dictionary = useDictionary();
  const t = dictionary.resourceTable;
  const labels = getResourceLabels(dictionary, config.resourceKey);

  const { lang } = useParams<{ lang: string }>();
  const compareHref = `/${lang}/dashboard/compare?type=${config.compareType}&ids=${record.id}`;

  const handleOnDelete = async () => {
    const result = await config.remove(record.id);
    toastResult(result, t.deleted);
  };

  return (
    <Menubar className="ml-auto w-fit border-none bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger
          aria-label={interpolate(t.rowActions, { name: record.name })}
          className="size-10 justify-center rounded-md p-0 text-secondary-foreground hover:cursor-pointer hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted data-[state=open]:text-foreground"
        >
          <MoreHorizontal aria-hidden className="size-[18px]" />
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
          <ResourceFormDialog
            config={config}
            record={record}
            formData={formData}
            duplicate
          />
          <MenubarItem asChild className={ROW_ACTION_ITEM_CLASS}>
            <Link href={compareHref}>
              <Scale />
              {t.compare}
            </Link>
          </MenubarItem>
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

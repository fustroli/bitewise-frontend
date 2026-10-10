import { ComponentType, ReactNode } from 'react';
import {
  IResourceDialogProps,
  IResourceRecord,
  IResourceRowActionsProps,
  TResourceKey,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces/resource-form.interface';
import { IQueryParams } from '@/app/utils/interfaces';
import { TDictionary } from '@/app/providers/dictionary-provider';

export interface IResourceColumn {
  id: string;
  sortable: boolean;
  align?: 'justify-start' | 'justify-center' | 'justify-end';
}

/** The strings every resource has under `resources.<key>` in the dictionary. */
export interface IResourceLabels {
  title: string;
  empty: string;
  addTitle: string;
  editTitle: string;
  deleteTitle: string;
  columns: Record<string, string>;
}

export interface IResourceRowContext {
  labels: IResourceLabels;
  tableLabels: TDictionary['resourceTable'];
  /** The row-actions menu, to be placed in the row's last cell. */
  actions: ReactNode;
}

export interface IResourcePage<TRecord> {
  data: TRecord[];
  count: number;
}

/**
 * The server half of a resource: how to fetch and render its list. `dialog`
 * and `rowActions` come from the resource's client half.
 */
export interface IResourceList<
  TRecord extends IResourceRecord,
  TFormData = undefined,
> {
  resourceKey: TResourceKey;
  fetch: (params: IQueryParams) => Promise<IResourcePage<TRecord>>;
  /** Data columns; the module appends the actions column. */
  columns: IResourceColumn[];
  renderRow: (row: TRecord, context: IResourceRowContext) => ReactNode;
  /** Defaults to `DEFAULT_PAGE_SIZE`. */
  pageSize?: number;
  /** Loads, once per table, the data the add/edit form needs. */
  loadFormData?: () => Promise<TFormData>;
  dialog: ComponentType<IResourceDialogProps<TRecord, TFormData>>;
  rowActions: ComponentType<IResourceRowActionsProps<TRecord, TFormData>>;
}

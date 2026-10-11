import { EOrderDirection } from '@/app/utils/enums';
import { ISortState } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';

export const DEFAULT_PAGE_SIZE = 20;

/** The order a list has until a column is sorted: newest first. */
export const DEFAULT_SORT: ISortState = {
  orderBy: 'createTimeStamp',
  orderDirection: EOrderDirection.DESC,
};

/** The backend's list cap; dialog pickers load this many options. */
export const MAX_LIST_LIMIT = 100;

/** The backend rejects a longer search term. */
export const MAX_SEARCH_LENGTH = 100;

/** How long typing pauses before the search is applied. */
export const SEARCH_DEBOUNCE_MS = 300;

/** A row-actions menu entry; the triggers are dialog buttons, not menu items. */
export const ROW_ACTION_ITEM_CLASS =
  'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted [&_svg]:size-4 [&_svg]:text-muted-foreground';

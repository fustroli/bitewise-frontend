import {
  IListQuery,
  IPageMetadata,
  ISortState,
  TSearchParams,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { EOrderDirection } from '@/app/utils/enums';
import { FIRST_PAGE } from '@/app/utils/constants';

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const parsePage = (value: string | undefined) => {
  const page = Math.floor(Number(value));
  return Number.isFinite(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
};

const parseDirection = (value: string | undefined) =>
  Object.values(EOrderDirection).find((direction) => direction === value);

/** Reads page and sort from the URL and turns them into a backend query. */
export const toListQuery = (
  searchParams: TSearchParams | undefined,
  pageSize: number,
): IListQuery => {
  const page = parsePage(first(searchParams?.page));
  const sort: ISortState = {
    orderBy: first(searchParams?.orderBy) || undefined,
    orderDirection: parseDirection(first(searchParams?.orderDirection)),
  };

  return {
    page,
    sort,
    params: {
      limit: pageSize,
      offset: (page - FIRST_PAGE) * pageSize,
      ...sort,
    },
  };
};

export const getPageMetadata = (
  page: number,
  pageSize: number,
  total: number,
): IPageMetadata => ({
  totalPages: Math.ceil(total / pageSize),
  hasNextPage: page * pageSize < total,
});

export const buildPageHref = (page: number, sort: ISortState) => {
  const query = new URLSearchParams({ page: String(page) });

  if (sort.orderBy) query.set('orderBy', sort.orderBy);
  if (sort.orderDirection) query.set('orderDirection', sort.orderDirection);

  return `?${query}`;
};

/**
 * A new column sorts ascending; the current column flips direction. Either
 * way the list goes back to the first page.
 */
export const buildSortHref = (sort: ISortState, columnId: string) => {
  const isAscending =
    sort.orderBy === columnId && sort.orderDirection === EOrderDirection.ASC;

  return buildPageHref(FIRST_PAGE, {
    orderBy: columnId,
    orderDirection: isAscending ? EOrderDirection.DESC : EOrderDirection.ASC,
  });
};

/** Changes whenever the list changes, so Suspense shows the skeleton again. */
export const toSuspenseKey = (searchParams: TSearchParams | undefined) =>
  JSON.stringify(searchParams ?? {});

import {
  buildPageHref,
  buildSortHref,
  getPageMetadata,
  toListQuery,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers/list-query.helpers';
import { describe, expect, it } from 'vitest';

import { EOrderDirection } from '@/app/utils/enums';

describe('toListQuery', () => {
  it('turns page and sort into limit, offset and order', () => {
    expect(
      toListQuery({ page: '3', orderBy: 'name', orderDirection: 'desc' }, 10),
    ).toEqual({
      page: 3,
      sort: { orderBy: 'name', orderDirection: EOrderDirection.DESC },
      params: {
        limit: 10,
        offset: 20,
        orderBy: 'name',
        orderDirection: EOrderDirection.DESC,
      },
    });
  });

  it('starts on page 1 with no sort when the URL has nothing', () => {
    expect(toListQuery(undefined, 5)).toEqual({
      page: 1,
      sort: { orderBy: undefined, orderDirection: undefined },
      params: {
        limit: 5,
        offset: 0,
        orderBy: undefined,
        orderDirection: undefined,
      },
    });
  });

  it.each(['0', '-2', 'abc', ''])('falls back to page 1 for "%s"', (page) => {
    expect(toListQuery({ page }, 10).page).toBe(1);
  });

  it('ignores an unknown direction', () => {
    expect(
      toListQuery({ orderBy: 'name', orderDirection: 'sideways' }, 10).sort,
    ).toEqual({ orderBy: 'name', orderDirection: undefined });
  });

  it('takes the first value of a repeated param', () => {
    expect(toListQuery({ page: ['2', '4'] }, 10).page).toBe(2);
  });
});

describe('getPageMetadata', () => {
  it.each([
    [1, 10, 25, { totalPages: 3, hasNextPage: true }],
    [3, 10, 25, { totalPages: 3, hasNextPage: false }],
    [2, 10, 20, { totalPages: 2, hasNextPage: false }],
    [1, 10, 0, { totalPages: 0, hasNextPage: false }],
  ])(
    'page %i of size %i with %i records',
    (page, pageSize, total, expected) => {
      expect(getPageMetadata(page, pageSize, total)).toEqual(expected);
    },
  );
});

describe('buildSortHref', () => {
  it('sorts a new column ascending', () => {
    expect(
      buildSortHref(
        { orderBy: 'name', orderDirection: EOrderDirection.DESC },
        'calories',
      ),
    ).toBe('?page=1&orderBy=calories&orderDirection=asc');
  });

  it('sorts ascending when nothing is sorted yet', () => {
    expect(buildSortHref({}, 'name')).toBe(
      '?page=1&orderBy=name&orderDirection=asc',
    );
  });

  it('flips the direction of the current column', () => {
    expect(
      buildSortHref(
        { orderBy: 'name', orderDirection: EOrderDirection.ASC },
        'name',
      ),
    ).toBe('?page=1&orderBy=name&orderDirection=desc');
    expect(
      buildSortHref(
        { orderBy: 'name', orderDirection: EOrderDirection.DESC },
        'name',
      ),
    ).toBe('?page=1&orderBy=name&orderDirection=asc');
  });
});

describe('buildPageHref', () => {
  it('keeps the sort', () => {
    expect(
      buildPageHref(4, {
        orderBy: 'name',
        orderDirection: EOrderDirection.ASC,
      }),
    ).toBe('?page=4&orderBy=name&orderDirection=asc');
  });

  it('leaves out a missing sort', () => {
    expect(buildPageHref(2, {})).toBe('?page=2');
  });
});

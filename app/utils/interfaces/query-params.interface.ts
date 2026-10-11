import { EOrderDirection } from '@/app/utils/enums';

export interface IQueryParams {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: EOrderDirection;
  /** Filters a list by name. */
  search?: string;
}

import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from '@/app/components/ui/pagination';

import { EOrderDirection } from '@/app/utils/enums';
import { cn } from '@/app/lib';
import { getPagesToShow } from '@/app/utils/helpers';

interface IProps {
  page?: string;
  totalPages: number;
  hasNextPage: boolean;
  orderBy?: string;
  orderDirection?: EOrderDirection;
}

export const Pagination = async (props: IProps) => {
  const { page = 1, totalPages, hasNextPage, orderBy, orderDirection } = props;

  const currentPage = Math.min(Math.max(Number(page), 1), totalPages);

  const pages = getPagesToShow(currentPage, totalPages);

  const orderQuery = `&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  return (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${currentPage - 1}${orderQuery}`}
            aria-disabled={currentPage === 1}
            className={cn(
              'rounded-md px-4 py-2 transition-colors',
              currentPage === 1
                ? 'pointer-events-none bg-muted text-muted-foreground opacity-60'
                : 'bg-card text-foreground shadow-soft hover:bg-accent',
            )}
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`?page=${page}${orderQuery}`}
              className={cn(
                'rounded-md px-4 py-2 transition-colors',
                page === currentPage
                  ? 'bg-primary font-semibold text-primary-foreground shadow-primary hover:bg-primary hover:text-primary-foreground'
                  : 'bg-card text-foreground shadow-soft hover:bg-accent',
              )}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={`?page=${currentPage + 1}${orderQuery}`}
            aria-disabled={!hasNextPage}
            className={cn(
              'rounded-md px-4 py-2 transition-colors',
              !hasNextPage
                ? 'pointer-events-none bg-muted text-muted-foreground opacity-60'
                : 'bg-card text-foreground shadow-soft hover:bg-accent',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
};

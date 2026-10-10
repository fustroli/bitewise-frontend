import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  IPageMetadata,
  ISortState,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Pagination as ShadcnPagination,
} from '@/app/components/ui/pagination';
import { FIRST_PAGE } from '@/app/utils/constants';
import { TDictionary } from '@/app/providers/dictionary-provider';
import { buildPageHref } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/helpers';
import { cn } from '@/app/lib';
import { getPagesToShow } from '@/app/utils/helpers';

interface IProps extends IPageMetadata {
  page: number;
  sort: ISortState;
  labels: TDictionary['resourceTable'];
}

const disabledClasses =
  'pointer-events-none bg-muted text-muted-foreground opacity-60';
const idleClasses = 'bg-card text-foreground shadow-soft hover:bg-accent';

const ResourcePagination = (props: IProps) => {
  const { page, totalPages, hasNextPage, sort, labels } = props;

  const currentPage = Math.min(Math.max(page, FIRST_PAGE), totalPages);
  const isFirstPage = currentPage === FIRST_PAGE;

  const pages = getPagesToShow(currentPage, totalPages);

  return (
    <ShadcnPagination aria-label={labels.pagination}>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href={buildPageHref(currentPage - 1, sort)}
            aria-label={labels.previousPage}
            aria-disabled={isFirstPage}
            size="default"
            className={cn(
              'gap-1 rounded-md px-4 py-2 pl-2.5 transition-colors',
              isFirstPage ? disabledClasses : idleClasses,
            )}
          >
            <ChevronLeft className="size-4" />
            <span>{labels.previous}</span>
          </PaginationLink>
        </PaginationItem>
        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={buildPageHref(pageNumber, sort)}
              className={cn(
                'rounded-md px-4 py-2 transition-colors',
                pageNumber === currentPage
                  ? 'bg-primary font-semibold text-primary-foreground shadow-primary hover:bg-primary hover:text-primary-foreground'
                  : idleClasses,
              )}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            href={buildPageHref(currentPage + 1, sort)}
            aria-label={labels.nextPage}
            aria-disabled={!hasNextPage}
            size="default"
            className={cn(
              'gap-1 rounded-md px-4 py-2 pr-2.5 transition-colors',
              hasNextPage ? idleClasses : disabledClasses,
            )}
          >
            <span>{labels.next}</span>
            <ChevronRight className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
};

export default ResourcePagination;

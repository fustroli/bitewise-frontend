import { IPageProps, IQueryParams } from '@/app/utils/interfaces';

import AddIngredientDialog from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/AddIngredientDialog';
import { EOrderDirection } from '@/app/utils/enums';
import EmptyTable from '@/app/components/EmptyTable';
import { INGREDTENTS_PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/constants';
import IngredientTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/Table/IngredientTableHead';
import IngredientTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/Table/IngredientTableRow';
import { Pagination } from '@/app/components/Pagination';
import { TableBody } from '@/app/components/ui/table';
import TableFrame from '@/app/components/Table/TableFrame';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';

const IngredientsTable = async (props: IPageProps) => {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams?.page || 1);

  const params: IQueryParams = {
    limit: INGREDTENTS_PAGE_SIZE,
    offset: (pageNumber - 1) * INGREDTENTS_PAGE_SIZE,
    orderBy: searchParams?.orderBy as string | undefined,
    orderDirection: searchParams?.orderDirection as EOrderDirection | undefined,
  };

  const ingredientsPage = await fetchIngredients(params);

  const total = ingredientsPage.count;

  const metadata = {
    hasNextPage: (params.offset as number) + INGREDTENTS_PAGE_SIZE < total,
    totalPages: Math.ceil(total / INGREDTENTS_PAGE_SIZE),
  };

  const ingredients = ingredientsPage.data;

  return (
    <>
      <TableFrame
        title={`Ingredients (${ingredientsPage.count})`}
        tableHead={<IngredientTableHead {...searchParams} />}
        addModal={<AddIngredientDialog />}
      >
        <TableBody>
          {ingredients?.length ? (
            ingredients.map((row) => (
              <IngredientTableRow key={row.id} row={row} />
            ))
          ) : (
            <EmptyTable>No ingredients available</EmptyTable>
          )}
        </TableBody>
      </TableFrame>
      {!!ingredients.length && <Pagination {...searchParams} {...metadata} />}
    </>
  );
};

export default IngredientsTable;

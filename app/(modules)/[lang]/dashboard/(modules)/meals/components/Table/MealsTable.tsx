import { IPageProps, IQueryParams } from '@/app/utils/interfaces';

import AddMealDialog from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/AddMealDialog';
import { EOrderDirection } from '@/app/utils/enums';
import EmptyTable from '@/app/components/EmptyTable';
import MealTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealTableHead';
import MealTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealTableRow';
import { PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/constants';
import { Pagination } from '@/app/components/Pagination';
import { TableBody } from '@/app/components/ui/table';
import TableFrame from '@/app/components/Table/TableFrame';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

const MealsTable = async (props: IPageProps) => {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams?.page || 1);

  const params: IQueryParams = {
    limit: PAGE_SIZE,
    offset: (pageNumber - 1) * PAGE_SIZE,
    orderBy: searchParams?.orderBy as string | undefined,
    orderDirection: searchParams?.orderDirection as EOrderDirection | undefined,
  };

  const [mealsPage, ingredients] = await Promise.all([
    fetchMeals(params),
    fetchIngredients({}),
  ]);

  const total = mealsPage.count;

  const metadata = {
    hasNextPage: (params.offset as number) + PAGE_SIZE < total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };

  const meals = mealsPage.data;

  return (
    <>
      <TableFrame
        title={`Meals (${mealsPage.count})`}
        tableHead={<MealTableHead {...searchParams} />}
        addModal={<AddMealDialog ingredients={ingredients.data} />}
      >
        <TableBody>
          {meals?.length ? (
            meals.map((row) => <MealTableRow key={row.id} row={row} />)
          ) : (
            <EmptyTable>No meals available</EmptyTable>
          )}
        </TableBody>
      </TableFrame>
      {!!meals.length && <Pagination {...searchParams} {...metadata} />}
    </>
  );
};

export default MealsTable;

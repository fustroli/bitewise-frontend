import { IPageProps, IQueryParams } from '@/app/utils/interfaces';

import AddMealDialog from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/AddMealDialog';
import CustomError from '@/app/components/Error';
import { EOrderDirection } from '@/app/utils/enums';
import EmptyTable from '@/app/components/EmptyTable';
import { IError } from '@/app/utils/interfaces/error.interface';
import MealTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealTableHead';
import MealTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/Table/MealTableRow';
import { PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/constants';
import { Pagination } from '@/app/components/Pagination';
import { TableBody } from '@/app/components/ui/table';
import TableFrame from '@/app/components/Table/TableFrame';
import { fetchIngredients } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/actions';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/actions';

const MealsTable = async (props: IPageProps) => {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams?.page || 1);

  const params: IQueryParams = {
    limit: PAGE_SIZE,
    offset: (pageNumber - 1) * PAGE_SIZE,
    orderBy: searchParams?.orderBy as string | undefined,
    orderDirection: searchParams?.orderDirection as EOrderDirection | undefined,
  };

  const [mealsResult, ingredientsResult] = await Promise.all([
    fetchMeals(params),
    fetchIngredients({}),
  ]);

  const total = mealsResult.data?.count || 0;

  const metadata = {
    hasNextPage: (params.offset as number) + PAGE_SIZE < total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };

  if (mealsResult.error) {
    return (
      <div className="px-4 pb-8 md:px-8">
        <section className="flex flex-col gap-4">
          <CustomError result={mealsResult as IError} />
        </section>
      </div>
    );
  }

  const meals = mealsResult.data?.data || [];

  return (
    <>
      <TableFrame
        title={`Meals (${mealsResult.data?.count})`}
        tableHead={<MealTableHead {...searchParams} />}
        addModal={
          <AddMealDialog ingredients={ingredientsResult.data?.data || []} />
        }
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

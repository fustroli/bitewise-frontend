import { IPageProps, IQueryParams } from '@/app/utils/interfaces';

import AddMealPlanDialog from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/AddMealPlanDialog';
import { EOrderDirection } from '@/app/utils/enums';
import EmptyTable from '@/app/components/EmptyTable';
import MealPlanTableHead from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanTableHead';
import MealPlanTableRow from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanTableRow';
import { PAGE_SIZE } from '@/app/(modules)/[lang]/dashboard/constants';
import { Pagination } from '@/app/components/Pagination';
import { TableBody } from '@/app/components/ui/table';
import TableFrame from '@/app/components/Table/TableFrame';
import { fetchMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/api';
import { fetchMeals } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/api';

const MealPlansTable = async (props: IPageProps) => {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams?.page || 1);

  const params: IQueryParams = {
    limit: PAGE_SIZE,
    offset: (pageNumber - 1) * PAGE_SIZE,
    orderBy: searchParams?.orderBy as string | undefined,
    orderDirection: searchParams?.orderDirection as EOrderDirection | undefined,
  };

  const [mealPlansPage, meals] = await Promise.all([
    fetchMealPlans(params),
    fetchMeals({}),
  ]);

  const total = mealPlansPage.count;

  const metadata = {
    hasNextPage: (params.offset as number) + PAGE_SIZE < total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };

  const mealsPlans = mealPlansPage.data;

  return (
    <>
      <TableFrame
        title={`Meal Plans (${mealPlansPage.count})`}
        tableHead={<MealPlanTableHead {...searchParams} />}
        addModal={<AddMealPlanDialog allMeals={meals.data} />}
      >
        <TableBody>
          {mealsPlans?.length ? (
            mealsPlans.map((row) => <MealPlanTableRow key={row.id} row={row} />)
          ) : (
            <EmptyTable>No meal plans available</EmptyTable>
          )}
        </TableBody>
      </TableFrame>
      {!!mealsPlans.length && <Pagination {...searchParams} {...metadata} />}
    </>
  );
};

export default MealPlansTable;

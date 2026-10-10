import { IResourceColumn } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';

export const MEAL_PLAN_COLUMNS: IResourceColumn[] = [
  { id: 'name', sortable: true, align: 'justify-start' },
  { id: 'calories', sortable: false, align: 'justify-end' },
  { id: 'protein', sortable: false, align: 'justify-end' },
  { id: 'totalFat', sortable: false, align: 'justify-end' },
  { id: 'totalCarbohydrates', sortable: false, align: 'justify-end' },
  { id: 'dietaryFiber', sortable: false, align: 'justify-end' },
];

export const MEAL_PLANS_PAGE_SIZE = 5;

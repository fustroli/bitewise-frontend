import { IResourceColumn } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';

export const INGREDIENT_COLUMNS: IResourceColumn[] = [
  { id: 'name', sortable: true, align: 'justify-start' },
  { id: 'calories', sortable: true, align: 'justify-end' },
  { id: 'protein', sortable: true, align: 'justify-end' },
  { id: 'totalFat', sortable: true, align: 'justify-end' },
  { id: 'totalCarbohydrates', sortable: true, align: 'justify-end' },
  { id: 'dietaryFiber', sortable: true, align: 'justify-end' },
  { id: 'unit', sortable: true, align: 'justify-end' },
];

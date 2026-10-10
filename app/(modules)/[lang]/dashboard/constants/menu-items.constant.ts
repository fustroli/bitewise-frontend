import {
  HandPlatter,
  LayoutDashboard,
  NotebookPen,
  ShoppingBasket,
} from 'lucide-react';

import { EOrderDirection } from '@/app/utils/enums';
import { IMenuItem } from '@/app/(modules)/[lang]/dashboard/interfaces';

export const MENU_ITEMS: IMenuItem[] = [
  {
    label: 'dashboard',
    route: '',
    icon: LayoutDashboard,
  },
  {
    label: 'ingredients',
    route: `/ingredients?page=1&orderBy=createTimeStamp&orderDirection=${EOrderDirection.DESC}`,
    icon: ShoppingBasket,
  },
  {
    label: 'meals',
    route: `/meals?page=1&orderBy=name&orderDirection=${EOrderDirection.ASC}`,
    icon: HandPlatter,
  },
  {
    label: 'mealPlans',
    route: `/meal-plans?page=1&orderBy=name&orderDirection=${EOrderDirection.ASC}`,
    icon: NotebookPen,
  },
];

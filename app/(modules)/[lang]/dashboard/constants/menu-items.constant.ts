import {
  HandPlatter,
  LayoutDashboard,
  NotebookPen,
  ShoppingBasket,
} from 'lucide-react';

import { IMenuItem } from '@/app/(modules)/[lang]/dashboard/interfaces';

export const MENU_ITEMS: IMenuItem[] = [
  {
    label: 'dashboard',
    route: '',
    icon: LayoutDashboard,
  },
  {
    label: 'ingredients',
    route: '/ingredients',
    icon: ShoppingBasket,
  },
  {
    label: 'meals',
    route: '/meals',
    icon: HandPlatter,
  },
  {
    label: 'mealPlans',
    route: '/meal-plans',
    icon: NotebookPen,
  },
];

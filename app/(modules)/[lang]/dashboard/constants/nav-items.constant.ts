import { CalendarDays, LayoutGrid, Leaf, Scale, Utensils } from 'lucide-react';

import { INavItem } from '@/app/(modules)/[lang]/dashboard/interfaces';

/** The library: the sidebar's first group, and the tab bar's first tabs. */
export const NAV_ITEMS: INavItem[] = [
  { label: 'dashboard', mobileLabel: 'home', route: '', icon: LayoutGrid },
  {
    label: 'ingredients',
    mobileLabel: 'ingredients',
    route: '/ingredients',
    icon: Leaf,
  },
  { label: 'meals', mobileLabel: 'meals', route: '/meals', icon: Utensils },
  {
    label: 'mealPlans',
    mobileLabel: 'plans',
    route: '/meal-plans',
    icon: CalendarDays,
  },
];

/** After a divider in the sidebar, the last tab on a phone. */
export const COMPARE_NAV_ITEM: INavItem = {
  label: 'compare',
  mobileLabel: 'compare',
  route: '/compare',
  icon: Scale,
};

export const PROFILE_ROUTE = '/profile';

'use client';

import { useParams, usePathname } from 'next/navigation';

import Link from 'next/link';
import { cn } from '@/app/lib';
import { useDictionary } from '@/app/providers/dictionary-provider';

/**
 * Phone width: Meal plans and the Week plan share the Plans tab, and this
 * switches between them. The sidebar lists both from `md` up.
 */
const PlansSwitch = () => {
  const { lang } = useParams<{ lang: string }>();
  const pathname = usePathname();
  const labels = useDictionary().dashboard.sidebar;
  const base = `/${lang}/dashboard`;
  const links = [
    { href: `${base}/meal-plans`, label: labels.mealPlans },
    { href: `${base}/week`, label: labels.weekPlan },
  ];

  return (
    <nav
      aria-label={labels.plans}
      className="flex gap-1 rounded-md bg-muted p-1 md:hidden"
    >
      {links.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex min-h-10 flex-1 items-center justify-center rounded-[7px] text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'bg-card font-extrabold text-foreground shadow-sm'
                : 'font-bold text-secondary-foreground',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default PlansSwitch;

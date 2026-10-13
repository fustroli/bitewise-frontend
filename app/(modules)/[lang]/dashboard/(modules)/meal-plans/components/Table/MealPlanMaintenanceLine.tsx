'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/lib';
import { useMaintenanceOpen } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanMaintenanceContext';

interface IProps {
  className?: string;
  children: ReactNode;
}

/**
 * One cell's share of the light green Maintenance line, which grows open and
 * shrinks shut with its row. The negative margin cancels the stack's gap while
 * it is shut, its padding restores the gap while it is open.
 */
const MealPlanMaintenanceLine = ({ className, children }: IProps) => {
  const { open } = useMaintenanceOpen();

  return (
    <div
      inert={!open}
      className={cn(
        '-mt-2 grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            'mt-2 rounded-md bg-success/15 px-2 py-1 text-foreground',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MealPlanMaintenanceLine;

'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/app/lib';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useMaintenanceOpen } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanMaintenanceContext';
import { useMaintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/hooks';

/** Opens and closes the row's Maintenance line; hidden while it's unknown. */
const MealPlanMaintenanceToggle = () => {
  const labels = useDictionary().resources.mealPlans;
  const { open, toggle } = useMaintenanceOpen();

  if (!useMaintenanceTargets()) return null;

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? labels.hideMaintenance : labels.showMaintenance}
      onClick={toggle}
      className="shrink-0 rounded-full bg-white/40 p-0.5 transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Plus
        className={cn(
          'size-4 transition-transform duration-300 motion-reduce:transition-none',
          open && 'rotate-45',
        )}
      />
    </button>
  );
};

export default MealPlanMaintenanceToggle;

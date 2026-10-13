'use client';

import MealPlanMaintenanceLine from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanMaintenanceLine';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useMaintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/hooks';

/** The Maintenance line's name cell; hidden while Maintenance is unknown. */
const MealPlanMaintenanceLabel = () => {
  const labels = useDictionary().resources.mealPlans;

  if (!useMaintenanceTargets()) return null;

  return (
    <MealPlanMaintenanceLine className="font-semibold">
      {labels.maintenance}
    </MealPlanMaintenanceLine>
  );
};

export default MealPlanMaintenanceLabel;

'use client';

import { INutritionColumn } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';
import MealPlanMaintenanceLine from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/components/Table/MealPlanMaintenanceLine';
import { formatMaintenanceTarget } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/helpers';
import { useMaintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/hooks';
import { useParams } from 'next/navigation';

interface IProps {
  column: INutritionColumn;
}

/** A nutrition column's Maintenance target; hidden while it's unknown. */
const MealPlanMaintenanceCell = ({ column }: IProps) => {
  const { lang } = useParams<{ lang: string }>();
  const targets = useMaintenanceTargets();

  if (!targets) return null;

  return (
    <MealPlanMaintenanceLine>
      {formatMaintenanceTarget(targets, column, lang)}
    </MealPlanMaintenanceLine>
  );
};

export default MealPlanMaintenanceCell;

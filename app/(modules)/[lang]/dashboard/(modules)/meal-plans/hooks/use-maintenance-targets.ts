'use client';

import { bodyMetrics } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';
import { maintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/helpers';
import { useMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/hooks';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

/**
 * The User's Maintenance targets with the Macro plan picked on the dashboard;
 * unset while they can't be computed.
 */
export const useMaintenanceTargets = () => {
  const { user } = useUserContext();
  const [plan] = useMacroPlan();

  return maintenanceTargets(
    bodyMetrics({
      bodyStats: user.bodyStats,
      dateOfBirth: user.personalInformation?.dateOfBirth,
      today: new Date(),
    }),
    plan,
  );
};

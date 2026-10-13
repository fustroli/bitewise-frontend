'use client';

import { bodyMetrics } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';
import { maintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/helpers';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

/** The User's Maintenance targets, unset while they can't be computed. */
export const useMaintenanceTargets = () => {
  const { user } = useUserContext();

  return maintenanceTargets(
    bodyMetrics({
      bodyStats: user.bodyStats,
      dateOfBirth: user.personalInformation?.dateOfBirth,
      today: new Date(),
    }),
  );
};

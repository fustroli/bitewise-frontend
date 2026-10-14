'use client';

import { EMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';
import { useCallback } from 'react';
import { useLocalStorage } from '@/app/hooks/use-local-storage';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

/** Per User, since localStorage is shared by everyone using the browser. */
export const macroPlanStorageKey = (userId: number) =>
  `bitewise:macro-plan:v1:${userId}`;

/** A stored plan, or Balanced when none (or an unknown one) is stored. */
export const parseMacroPlan = (raw: string | null | undefined): EMacroPlan =>
  Object.values(EMacroPlan).find((plan) => plan === raw) ?? EMacroPlan.BALANCED;

/**
 * The Macro plan the User picked on the dashboard, kept in this browser. The
 * dashboard and the Meal plans' targets read the same one.
 */
export const useMacroPlan = () => {
  const { user } = useUserContext();
  const [raw, setRaw] = useLocalStorage(macroPlanStorageKey(user.id));

  const setPlan = useCallback((plan: EMacroPlan) => setRaw(plan), [setRaw]);

  return [parseMacroPlan(raw), setPlan] as const;
};

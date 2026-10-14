'use client';

import { formatAmount, interpolate } from '@/app/utils/helpers';

import { useDictionary } from '@/app/providers/dictionary-provider';
import { useMaintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/hooks';
import { useParams } from 'next/navigation';

/** The list toolbar's "Targets: 2,058 kcal · Balanced split"; hidden without. */
const MealPlanTargetsNote = () => {
  const { lang } = useParams<{ lang: string }>();
  const { resources, dashboard } = useDictionary();
  const targets = useMaintenanceTargets();

  if (!targets) return null;

  return (
    <p className="text-[13px] font-semibold text-muted-foreground">
      {interpolate(resources.mealPlans.targets, {
        kcal: formatAmount(targets.calories, lang, 0),
        plan: dashboard.bodyMetrics.macros.plans[targets.plan],
      })}
    </p>
  );
};

export default MealPlanTargetsNote;

'use client';

import {
  bodyMetrics,
  formatCalories,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';
import {
  formatCalorieDelta,
  maintenanceDelta,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/helpers';

import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { cn } from '@/app/lib';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useParams } from 'next/navigation';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

/** Colours the delta by where it rounds to: over, at or under Maintenance. */
const DELTA_CLASSES: Record<string, string> = {
  '1': 'text-warning',
  '0': 'text-primary',
  '-1': 'text-primary',
};

// `Math.sign(-0)` is `-0`, which `String()` still makes `'0'`.
const deltaClass = (delta: number) =>
  DELTA_CLASSES[String(Math.sign(Math.round(delta)))];

interface IProps {
  /** The draft's total, full precision. */
  kcal: number;
  profileHref: string;
}

/** The draft's calories against the User's Maintenance calories. */
const DraftMaintenance = ({ kcal, profileHref }: IProps) => {
  const labels = useDictionary().draftMealPlan.maintenance;
  const { user } = useUserContext();
  const { lang } = useParams<{ lang: string }>();

  const { calories } = bodyMetrics({
    bodyStats: user.bodyStats,
    dateOfBirth: user.personalInformation?.dateOfBirth,
    today: new Date(),
  });
  const delta = maintenanceDelta(kcal, calories);

  if (!calories || delta === undefined) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm text-muted-foreground">{labels.missing}</p>
        <Button asChild variant="outline">
          <Link href={profileHref}>{labels.completeProfile}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-md bg-surface-subtle p-4">
      <p
        className={cn(
          'text-2xl font-extrabold tracking-tight',
          deltaClass(delta),
        )}
      >
        {formatCalorieDelta(delta, lang)}{' '}
        <span className="text-base font-medium text-muted-foreground">
          {labels.kcal}
        </span>
      </p>
      <p className="text-sm text-muted-foreground">
        {interpolate(labels.comparedWith, {
          maintenance: formatCalories(calories.maintenance, lang),
        })}
      </p>
    </div>
  );
};

export default DraftMaintenance;

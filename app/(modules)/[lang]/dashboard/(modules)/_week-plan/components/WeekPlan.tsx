'use client';

import {
  resolveWeek,
  weekSummary,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/helpers';
import { useEffect, useMemo, useState } from 'react';

import DayStrip from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/components/DayStrip';
import { IDraftSources } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import { TStoredWeek } from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/validations';
import WeekDay from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/components/WeekDay';
import WeekPlanSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/components/WeekPlanSkeleton';
import WeekSummary from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/components/WeekSummary';
import { interpolate } from '@/app/utils/helpers';
import { useDailyTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/hooks';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useHydrated } from '@/app/hooks/use-hydrated';
import { useParams } from 'next/navigation';
import { useWeekPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_week-plan/context';

interface IProps extends IDraftSources {
  /** Where to complete the Body stats the targets need. */
  bodyStatsHref: string;
}

interface IWeekProps extends IProps {
  stored: TStoredWeek;
}

const Week = ({ stored, meals, ingredients, bodyStatsHref }: IWeekProps) => {
  const labels = useDictionary().weekPlan;
  const { lang } = useParams<{ lang: string }>();
  const { names, shortNames, today, selectedDay, selectDay, replaceWeek } =
    useWeekPlan();
  const targets = useDailyTargets();

  const sources = useMemo(() => ({ meals, ingredients }), [meals, ingredients]);
  const resolved = useMemo(
    () => resolveWeek(stored, sources),
    [stored, sources],
  );
  // Counted once, as the week is first shown.
  const [removed] = useState(resolved.removed);

  // Stores the week without its missing items, so they're dropped for good.
  useEffect(() => {
    if (resolved.removed) replaceWeek(resolved.week);
  }, [resolved, replaceWeek]);

  const { week } = resolved;
  const summary = weekSummary(week, sources, targets?.calories);

  return (
    <>
      {removed > 0 && (
        <p role="status" className="text-sm text-muted-foreground">
          {interpolate(labels.removed, { count: removed })}
        </p>
      )}
      <WeekSummary summary={summary} targets={targets} lang={lang} />
      <div className="flex flex-col gap-4 md:gap-6">
        <DayStrip
          summary={summary}
          targetKcal={targets?.calories}
          names={names}
          shortNames={shortNames}
          today={today}
          selectedDay={selectedDay}
          onSelect={selectDay}
          lang={lang}
        />
        <WeekDay
          day={selectedDay}
          name={names[selectedDay]}
          isToday={selectedDay === today}
          lines={week.days[selectedDay]}
          total={summary.totals[selectedDay]}
          sources={sources}
          bodyStatsHref={bodyStatsHref}
          lang={lang}
        />
      </div>
    </>
  );
};

/**
 * The User's Week plan: the week's summary, the seven days, and the selected
 * one's editor. Opens on today; an empty week shows as is.
 */
const WeekPlan = (props: IProps) => {
  const { week } = useWeekPlan();
  // This boundary can hydrate after the provider has read the store: until
  // it has, it shows what the server rendered.
  const isHydrated = useHydrated();

  if (!week || !isHydrated) return <WeekPlanSkeleton />;

  return <Week stored={week} {...props} />;
};

export default WeekPlan;

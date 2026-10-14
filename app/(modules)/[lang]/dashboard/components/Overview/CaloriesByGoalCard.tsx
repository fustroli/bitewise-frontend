'use client';

import {
  GOAL_TICK_PERCENT,
  goalBarPercent,
} from '@/app/(modules)/[lang]/dashboard/components/Overview/overview.helpers';
import MissingInputs, {
  IMissingInputs,
} from '@/app/(modules)/[lang]/dashboard/components/Overview/MissingInputs';
import {
  formatCalories,
  formatKgPerWeek,
  formatPercent,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';

import { Card } from '@/app/components/ui/card';
import CardHeading from '@/app/(modules)/[lang]/dashboard/components/Overview/CardHeading';
import { ICalories } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';
import SegmentedControl from '@/app/components/SegmentedControl';
import { TriangleAlert } from 'lucide-react';
import { cn } from '@/app/lib';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useState } from 'react';

type TDirection = 'lose' | 'gain';

interface IProps {
  calories?: ICalories;
  missing: IMissingInputs;
  locale: string;
}

/** The Calorie targets for losing or gaining weight, against Maintenance. */
const CaloriesByGoalCard = ({ calories, missing, locale }: IProps) => {
  const labels = useDictionary().dashboard.bodyMetrics.calories;
  const [direction, setDirection] = useState<TDirection>('lose');
  const names = direction === 'lose' ? labels.loseTargets : labels.gainTargets;

  return (
    <Card className="flex flex-col gap-4 p-4 md:gap-5 md:p-6">
      <CardHeading
        title={labels.title}
        aside={
          calories && (
            <SegmentedControl
              label={labels.goal}
              value={direction}
              onChange={setDirection}
              options={[
                { value: 'lose', label: labels.lose },
                { value: 'gain', label: labels.gain },
              ]}
            />
          )
        }
      />
      {calories ? (
        <>
          <ul>
            {calories[direction].map((target) => (
              <li
                key={target.pace}
                className="flex flex-col gap-2.5 border-t py-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold md:text-[15px]">
                      {names[target.pace]}
                    </span>
                    <span className="text-xs text-muted-foreground md:text-[13px]">
                      {interpolate(labels.kgPerWeek, {
                        value: formatKgPerWeek(target.kgPerWeek, locale),
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 text-right">
                    <span className="text-sm md:text-[15px]">
                      <strong className="font-extrabold">
                        {formatCalories(target.kcalPerDay, locale)}
                      </strong>{' '}
                      <span className="text-muted-foreground">
                        {labels.kcalPerDay}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground md:text-[13px]">
                      {interpolate(labels.ofMaintenance, {
                        percent: formatPercent(
                          target.percentOfMaintenance,
                          locale,
                        ),
                      })}
                    </span>
                  </div>
                </div>
                <div
                  aria-hidden
                  className="relative h-1.5 rounded-full bg-muted"
                >
                  <div
                    className={cn(
                      'h-full rounded-full',
                      target.belowSafeMinimum ? 'bg-warning' : 'bg-primary',
                    )}
                    style={{
                      width: `${goalBarPercent(target.percentOfMaintenance)}%`,
                    }}
                  />
                  <div
                    className="absolute -top-[3px] h-3 w-0.5 bg-foreground/35"
                    style={{ left: `${GOAL_TICK_PERCENT}%` }}
                  />
                </div>
                {target.belowSafeMinimum && (
                  <p className="flex items-center gap-2 text-xs font-semibold text-destructive md:text-[13px]">
                    <TriangleAlert aria-hidden className="size-4 shrink-0" />
                    {interpolate(labels.belowSafeMinimum, {
                      min: formatCalories(calories.safeMinimum, locale),
                    })}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            {interpolate(labels.tickNote, {
              kcal: formatCalories(calories.maintenance, locale),
            })}
          </p>
        </>
      ) : (
        <MissingInputs {...missing} />
      )}
    </Card>
  );
};

export default CaloriesByGoalCard;

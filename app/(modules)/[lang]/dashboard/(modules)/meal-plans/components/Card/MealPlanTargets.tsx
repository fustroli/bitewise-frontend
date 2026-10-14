'use client';

import {
  formatAmount,
  interpolate,
  macroEnergyShares,
} from '@/app/utils/helpers';

import { Button } from '@/app/components/ui/button';
import { INutrition } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';
import Link from 'next/link';
import MacroBar from '@/app/components/nutrition/MacroBar';
import { MacroSwatch } from '@/app/components/nutrition/MacroLegend';
import MacroValue from '@/app/components/nutrition/MacroValue';
import ProgressVsTarget from '@/app/components/display/ProgressVsTarget';
import { calorieGap } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/helpers';
import { cn } from '@/app/lib';
import { progressPercent } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useMaintenanceTargets } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/hooks';

const MACROS = [
  { macro: 'protein', nutrient: 'protein', bar: 'bg-protein' },
  { macro: 'carbs', nutrient: 'totalCarbohydrates', bar: 'bg-carbs' },
  { macro: 'fat', nutrient: 'totalFat', bar: 'bg-fat' },
] as const;

interface IProps {
  total: INutrition;
  lang: string;
  bodyStatsHref: string;
}

/**
 * A Meal plan's day against the User's targets: calories (green within
 * ±150 kcal of Maintenance) and each macro. Plain totals without targets.
 */
const MealPlanTargets = ({ total, lang, bodyStatsHref }: IProps) => {
  const { resources, dashboard } = useDictionary();
  const labels = resources.mealPlans.card;
  const macroNames = dashboard.bodyMetrics.macros.macros;
  const targets = useMaintenanceTargets();
  const grams = (value: number) => formatAmount(value, lang, 0);
  const kcal = grams(total.calories);

  if (!targets) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-bold text-muted-foreground">
              {labels.calories}
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-[30px] font-extrabold leading-none tracking-tight">
                {kcal}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                kcal
              </span>
            </span>
          </div>
          <div className="grid flex-1 grid-cols-3 gap-4 [&_strong]:text-lg [&_strong]:font-extrabold">
            {MACROS.map(({ macro, nutrient }) => (
              <MacroValue
                key={macro}
                name={
                  <span className="flex items-center gap-1.5">
                    <MacroSwatch macro={macro} />
                    {macroNames[macro]}
                  </span>
                }
                value={grams(total[nutrient])}
              />
            ))}
          </div>
        </div>
        <MacroBar
          heightClassName="h-2"
          shares={macroEnergyShares({
            protein: total.protein,
            carbs: total.totalCarbohydrates,
            fat: total.totalFat,
          })}
        />
        <p className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
          {labels.noTargets}
          <Button asChild variant="link" className="h-auto p-0 text-[13px]">
            <Link href={bodyStatsHref}>
              {dashboard.bodyMetrics.addBodyStats}
            </Link>
          </Button>
        </p>
      </div>
    );
  }

  const { diff, onTarget } = calorieGap(total.calories, targets.calories);
  const gap = formatAmount(Math.abs(diff), lang, 0);
  const note = onTarget
    ? interpolate(labels.onTarget, {
        diff: Math.round(diff).toLocaleString(lang, {
          signDisplay: 'exceptZero',
        }),
      })
    : interpolate(diff < 0 ? labels.under : labels.over, { value: gap });

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-6">
      <div className="flex flex-[1_1_260px] flex-col gap-2.5">
        <span className="text-[13px] font-bold text-muted-foreground">
          {labels.calories}
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-[30px] font-extrabold leading-none tracking-tight">
            {kcal}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            {interpolate(labels.ofKcal, {
              value: grams(targets.calories),
            })}
          </span>
        </span>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full',
              onTarget ? 'bg-primary' : 'bg-warning',
            )}
            style={{
              width: `${progressPercent(total.calories, targets.calories)}%`,
            }}
          />
        </div>
        <span
          className={cn(
            'text-[13px] font-bold',
            onTarget ? 'text-primary' : 'text-warning',
          )}
        >
          {note}
        </span>
      </div>
      <div className="grid flex-[2_1_420px] grid-cols-3 gap-4 md:gap-5">
        {MACROS.map(({ macro, nutrient, bar }) => (
          <ProgressVsTarget
            key={macro}
            label={
              <span className="flex items-center gap-1.5">
                <MacroSwatch macro={macro} />
                {macroNames[macro]}
              </span>
            }
            value={total[nutrient]}
            target={targets[nutrient]}
            valueText={grams(total[nutrient])}
            targetText={interpolate(labels.ofGrams, {
              value: grams(targets[nutrient]),
            })}
            barClassName={bar}
          />
        ))}
      </div>
    </div>
  );
};

export default MealPlanTargets;

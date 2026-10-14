import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  ICalorieTarget,
  ICalories,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  formatCalories,
  formatKgPerWeek,
  formatPercent,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';

import MissingBodyMetrics from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics/MissingBodyMetrics';
import { TriangleAlert } from 'lucide-react';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';

/** Why the card can't show calories yet, and where to fix it. */
export interface ICaloriesMissing {
  message: string;
  linkLabel: string;
  href: string;
}

interface IProps {
  calories?: ICalories;
  missing: ICaloriesMissing;
  locale: string;
}

enum EDirection {
  LOSE = 'lose',
  GAIN = 'gain',
}

const CalorieCard = ({ calories, missing, locale }: IProps) => {
  const labels = useDictionary().dashboard.bodyMetrics.calories;

  const renderTargets = (
    targets: ICalorieTarget[],
    names: Record<ICalorieTarget['pace'], string>,
  ) => (
    <ul className="divide-y">
      {targets.map((target) => (
        <li
          key={target.pace}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div>
            <p className="font-medium">{names[target.pace]}</p>
            <p className="text-sm text-muted-foreground">
              {interpolate(labels.kgPerWeek, {
                value: formatKgPerWeek(target.kgPerWeek, locale),
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              {formatCalories(target.kcalPerDay, locale)}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                {labels.kcalPerDay}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {formatPercent(target.percentOfMaintenance, locale)}
            </p>
            {target.belowSafeMinimum && calories && (
              <p className="flex items-center justify-end gap-1 text-sm text-destructive">
                <TriangleAlert className="size-4 shrink-0" />
                {interpolate(labels.belowSafeMinimum, {
                  min: formatCalories(calories.safeMinimum, locale),
                })}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {calories ? (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                {labels.maintenance}
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {formatCalories(calories.maintenance, locale)}{' '}
                <span className="text-base font-medium text-muted-foreground">
                  {labels.kcalPerDay}
                </span>
              </h3>
            </div>
            <Tabs defaultValue={EDirection.LOSE}>
              <TabsList>
                <TabsTrigger value={EDirection.LOSE}>{labels.lose}</TabsTrigger>
                <TabsTrigger value={EDirection.GAIN}>{labels.gain}</TabsTrigger>
              </TabsList>
              <TabsContent value={EDirection.LOSE}>
                {renderTargets(calories.lose, labels.loseTargets)}
              </TabsContent>
              <TabsContent value={EDirection.GAIN}>
                {renderTargets(calories.gain, labels.gainTargets)}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <MissingBodyMetrics {...missing} />
        )}
      </CardContent>
    </Card>
  );
};

export default CalorieCard;

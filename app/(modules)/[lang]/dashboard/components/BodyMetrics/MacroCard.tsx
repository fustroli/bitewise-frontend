import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  IMacroAmount,
  IMacros,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  formatCalories,
  formatGrams,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';

import { EMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/enums';
import { ICaloriesMissing } from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics/CalorieCard';
import MissingBodyMetrics from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics/MissingBodyMetrics';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  macros?: IMacros;
  missing: ICaloriesMissing;
  locale: string;
}

const MACROS = ['protein', 'carbs', 'fat'] as const;

const MacroCard = ({ macros, missing, locale }: IProps) => {
  const labels = useDictionary().dashboard.bodyMetrics.macros;

  const renderAmount = (
    macro: (typeof MACROS)[number],
    amount: IMacroAmount,
  ) => (
    <li key={macro} className="py-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-medium">{labels.macros[macro]}</p>
        <p className="font-semibold">
          {formatGrams(amount.grams, locale)}{' '}
          <span className="text-sm font-normal text-muted-foreground">
            {labels.gramsPerDay}
          </span>
        </p>
      </div>
    </li>
  );

  return (
    <Card className="w-full border-none shadow-soft">
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {macros ? (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                {labels.foodEnergy}
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {formatCalories(macros.kcalPerDay, locale)}{' '}
                <span className="text-base font-medium text-muted-foreground">
                  {labels.kcalPerDay}
                </span>
              </h3>
            </div>
            <Tabs defaultValue={EMacroPlan.BALANCED}>
              <TabsList className="grid h-auto w-full grid-cols-4">
                {macros.plans.map(({ plan }) => (
                  <TabsTrigger
                    key={plan}
                    value={plan}
                    className="whitespace-normal px-2 text-center"
                  >
                    {labels.plans[plan]}
                  </TabsTrigger>
                ))}
              </TabsList>
              {macros.plans.map((plan) => (
                <TabsContent key={plan.plan} value={plan.plan}>
                  <ul className="divide-y">
                    {MACROS.map((macro) => renderAmount(macro, plan[macro]))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
            <dl className="space-y-1 border-t pt-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">{labels.sugar}</dt>
                <dd className="font-medium">
                  {interpolate(labels.limit, {
                    value: formatGrams(macros.sugarMaxGrams, locale),
                  })}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">{labels.saturatedFat}</dt>
                <dd className="font-medium">
                  {interpolate(labels.limit, {
                    value: formatGrams(macros.saturatedFatMaxGrams, locale),
                  })}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <MissingBodyMetrics {...missing} />
        )}
      </CardContent>
    </Card>
  );
};

export default MacroCard;

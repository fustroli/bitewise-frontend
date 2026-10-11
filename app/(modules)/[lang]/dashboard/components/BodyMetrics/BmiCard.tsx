import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  formatBmi,
  formatBmiBand,
  formatWeight,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';

import { BMI_BANDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/constants';
import { IBmi } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';
import MissingBodyMetrics from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics/MissingBodyMetrics';
import { cn } from '@/app/lib';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  bmi?: IBmi;
  locale: string;
  bodyStatsHref: string;
}

const BmiCard = ({ bmi, locale, bodyStatsHref }: IProps) => {
  const { bodyMetrics } = useDictionary().dashboard;
  const labels = bodyMetrics.bmi;

  return (
    <Card className="w-full border-none shadow-soft">
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bmi ? (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{labels.yourBmi}</p>
              <h3 className="text-2xl font-bold text-foreground">
                {formatBmi(bmi.value, locale)}{' '}
                <span className="text-base font-medium text-muted-foreground">
                  {labels.categories[bmi.category]}
                </span>
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{labels.category}</TableHead>
                  <TableHead className="text-right">{labels.range}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BMI_BANDS.map((band) => {
                  const isCurrent = band.category === bmi.category;

                  return (
                    <TableRow
                      key={band.category}
                      aria-current={isCurrent || undefined}
                      className={cn(
                        isCurrent &&
                          'bg-secondary font-semibold text-secondary-foreground hover:bg-secondary',
                      )}
                    >
                      <TableCell>{labels.categories[band.category]}</TableCell>
                      <TableCell className="text-right">
                        {formatBmiBand(band, locale)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground">
              {interpolate(labels.healthyWeight, {
                min: formatWeight(bmi.healthyWeight.minKg, locale),
                max: formatWeight(bmi.healthyWeight.maxKg, locale),
              })}
            </p>
          </>
        ) : (
          <MissingBodyMetrics
            message={labels.empty}
            linkLabel={bodyMetrics.addBodyStats}
            href={bodyStatsHref}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BmiCard;

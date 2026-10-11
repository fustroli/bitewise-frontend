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
  formatBodyFat,
  formatBodyFatBand,
  formatWeight,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';

import { BODY_FAT_BANDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/constants';
import { ESex } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import { IBodyFat } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';
import MissingBodyMetrics from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics/MissingBodyMetrics';
import { cn } from '@/app/lib';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  bodyFat?: IBodyFat;
  /** Picks the category table; set whenever `bodyFat` is. */
  sex?: ESex | null;
  /** Some input is missing, rather than the inputs giving no result. */
  inputsMissing: boolean;
  locale: string;
  bodyStatsHref: string;
}

const BodyFatCard = ({
  bodyFat,
  sex,
  inputsMissing,
  locale,
  bodyStatsHref,
}: IProps) => {
  const labels = useDictionary().dashboard.bodyMetrics.bodyFat;

  const renderMass = (label: string, kg: number) => (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">
        {interpolate(labels.kg, { value: formatWeight(kg, locale) })}
      </p>
    </div>
  );

  return (
    <Card className="w-full border-none shadow-soft">
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bodyFat && sex ? (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                {labels.yourBodyFat}
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {formatBodyFat(bodyFat.percent, locale)}{' '}
                <span className="text-base font-medium text-muted-foreground">
                  {labels.categories[bodyFat.category]}
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
                {BODY_FAT_BANDS[sex].map((band) => {
                  const isCurrent = band.category === bodyFat.category;

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
                        {formatBodyFatBand(band, locale)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="grid grid-cols-2 gap-4">
              {renderMass(labels.fatMass, bodyFat.fatMassKg)}
              {renderMass(labels.leanMass, bodyFat.leanMassKg)}
            </div>
          </>
        ) : (
          <MissingBodyMetrics
            message={inputsMissing ? labels.empty : labels.implausible}
            linkLabel={
              inputsMissing ? labels.addMeasurements : labels.checkMeasurements
            }
            href={bodyStatsHref}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BodyFatCard;

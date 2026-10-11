import {
  ACTIVITY_MULTIPLIERS,
  BMI_BANDS,
  BMI_DISPLAY_DECIMALS,
  BMR,
  CALORIE_DISPLAY_DECIMALS,
  CALORIE_PACES,
  CM_PER_M,
  HEALTHY_BMI,
  SAFE_MINIMUM_CALORIES,
  WEIGHT_DISPLAY_DECIMALS,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/constants';
import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import {
  IBmi,
  IBmiBand,
  IBodyMetrics,
  IBodyMetricsInput,
  ICalorieTarget,
  ICalories,
  TBodyMetricsField,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/interfaces';

const PERCENT = 100;

const DIRECTION = { lose: -1, gain: 1 } as const;

/** Whole years from `dateOfBirth` to `today`, both as local calendar days. */
export const ageOn = (dateOfBirth: Date, today: Date) => {
  const hadBirthday =
    today.getMonth() > dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() &&
      today.getDate() >= dateOfBirth.getDate());

  return today.getFullYear() - dateOfBirth.getFullYear() - Number(!hadBirthday);
};

/** The stored date of birth's UTC calendar day, as a local Date. */
const birthDay = (dateOfBirth: string) => {
  const date = new Date(dateOfBirth);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const bmiCategory = (bmi: number) =>
  BMI_BANDS.findLast(({ min }) => min === undefined || bmi >= min)!.category;

const computeBmi = (heightCm: number, weightKg: number): IBmi => {
  const heightM = heightCm / CM_PER_M;
  const squareM = heightM * heightM;
  const value = weightKg / squareM;

  return {
    value,
    category: bmiCategory(value),
    healthyWeight: {
      minKg: HEALTHY_BMI.min * squareM,
      maxKg: HEALTHY_BMI.max * squareM,
    },
  };
};

const computeCalories = (
  sex: ESex,
  heightCm: number,
  weightKg: number,
  activityLevel: EActivityLevel,
  age: number,
): ICalories => {
  const bmr =
    BMR.perKg * weightKg +
    BMR.perCm * heightCm +
    BMR.perYear * age +
    BMR.bySex[sex];
  const maintenance = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const safeMinimum = SAFE_MINIMUM_CALORIES[sex];

  const targets = (
    direction: (typeof DIRECTION)[keyof typeof DIRECTION],
  ): ICalorieTarget[] =>
    CALORIE_PACES.map(({ pace, kgPerWeek, kcalPerDay }) => {
      const target = maintenance + direction * kcalPerDay;

      return {
        pace,
        kgPerWeek: direction * kgPerWeek,
        kcalPerDay: target,
        percentOfMaintenance: (target / maintenance) * PERCENT,
        belowSafeMinimum: target < safeMinimum,
      };
    });

  return {
    maintenance,
    safeMinimum,
    lose: targets(DIRECTION.lose),
    gain: targets(DIRECTION.gain),
  };
};

/**
 * BMI and Calorie targets from the User's Body stats and date of birth, at
 * full precision. Whatever can't be computed yet is left unset and its
 * inputs are listed in `missing`.
 */
export const bodyMetrics = ({
  bodyStats = {},
  dateOfBirth,
  today,
}: IBodyMetricsInput): IBodyMetrics => {
  const { sex, heightCm, weightKg, activityLevel } = bodyStats;
  const missing = (
    [
      ['heightCm', heightCm],
      ['weightKg', weightKg],
      ['sex', sex],
      ['activityLevel', activityLevel],
      ['dateOfBirth', dateOfBirth],
    ] as [TBodyMetricsField, unknown][]
  )
    .filter(([, value]) => value === null || value === undefined)
    .map(([field]) => field);

  if (!heightCm || !weightKg) return { missing };

  const bmi = computeBmi(heightCm, weightKg);

  if (!sex || !activityLevel || !dateOfBirth) return { bmi, missing };

  return {
    bmi,
    calories: computeCalories(
      sex,
      heightCm,
      weightKg,
      activityLevel,
      ageOn(birthDay(dateOfBirth), today),
    ),
    missing,
  };
};

const formatDecimal = (value: number, decimals: number, locale: string) =>
  value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** e.g. `22.4` */
export const formatBmi = (value: number, locale: string) =>
  formatDecimal(value, BMI_DISPLAY_DECIMALS, locale);

/** e.g. `< 16`, `18.5 – 25`, `≥ 40` */
export const formatBmiBand = ({ min, max }: IBmiBand, locale: string) => {
  const format = (value: number) => value.toLocaleString(locale);

  if (min === undefined) return `< ${format(max!)}`;
  if (max === undefined) return `≥ ${format(min)}`;
  return `${format(min)} – ${format(max)}`;
};

/** e.g. `59.9` */
export const formatWeight = (kg: number, locale: string) =>
  formatDecimal(kg, WEIGHT_DISPLAY_DECIMALS, locale);

/** Whole kcal, e.g. `2,520` */
export const formatCalories = (kcal: number, locale: string) =>
  formatDecimal(kcal, CALORIE_DISPLAY_DECIMALS, locale);

/** Whole percent, e.g. `90%` */
export const formatPercent = (percent: number, locale: string) =>
  (percent / PERCENT).toLocaleString(locale, { style: 'percent' });

/** Signed, e.g. `-0.25` or `+1` */
export const formatKgPerWeek = (kgPerWeek: number, locale: string) =>
  kgPerWeek.toLocaleString(locale, { signDisplay: 'always' });

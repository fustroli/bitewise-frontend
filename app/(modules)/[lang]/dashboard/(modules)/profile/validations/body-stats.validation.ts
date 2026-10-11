import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';

import { BODY_STATS_LIMITS } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/constants';
import { TDictionary } from '@/app/providers/dictionary-provider';
import { interpolate } from '@/app/utils/helpers';
import { z } from 'zod';

export const createBodyStatsSchema = ({ validation }: TDictionary) => {
  const { heightCm, weightKg } = BODY_STATS_LIMITS;
  const heightMessage = interpolate(validation.heightRange, heightCm);
  const weightMessage = interpolate(validation.weightRange, weightKg);

  return z.object({
    sex: z.enum(ESex).nullable(),
    heightCm: z
      .number()
      .multipleOf(heightCm.step, { message: validation.wholeNumber })
      .min(heightCm.min, { message: heightMessage })
      .max(heightCm.max, { message: heightMessage })
      .nullable(),
    weightKg: z
      .number()
      .min(weightKg.min, { message: weightMessage })
      .max(weightKg.max, { message: weightMessage })
      .multipleOf(weightKg.step, { message: validation.oneDecimal })
      .nullable(),
    activityLevel: z.enum(EActivityLevel).nullable(),
  });
};

export type TBodyStatsSchema = z.infer<
  ReturnType<typeof createBodyStatsSchema>
>;

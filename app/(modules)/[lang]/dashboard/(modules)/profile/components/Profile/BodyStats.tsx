'use client';

import {
  BODY_STATS_LIMITS,
  PROFILE_SECTION_IDS,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/constants';
import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';
import {
  TBodyStatsSchema,
  createBodyStatsSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import {
  toBodyStatsChange,
  toBodyStatsFormValues,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/helpers';

import ProfileSection from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/ProfileSection';
import { useDictionary } from '@/app/providers/dictionary-provider';

const BodyStats = () => {
  const { profile } = useDictionary();
  const labels = profile.bodyStats;

  return (
    <ProfileSection<TBodyStatsSchema>
      id={PROFILE_SECTION_IDS.bodyStats}
      title={labels.title}
      description={labels.description}
      createSchema={createBodyStatsSchema}
      toFormValues={toBodyStatsFormValues}
      toChange={toBodyStatsChange}
      fields={[
        {
          kind: 'select',
          name: 'sex',
          label: labels.sex,
          placeholder: labels.select,
          clearLabel: labels.notSet,
          options: Object.values(ESex).map((sex) => ({
            value: sex,
            label: labels.sexes[sex],
          })),
        },
        {
          kind: 'number',
          name: 'heightCm',
          label: labels.height,
          ...BODY_STATS_LIMITS.heightCm,
        },
        {
          kind: 'number',
          name: 'weightKg',
          label: labels.weight,
          ...BODY_STATS_LIMITS.weightKg,
        },
        {
          kind: 'select',
          name: 'activityLevel',
          label: labels.activityLevel,
          placeholder: labels.select,
          clearLabel: labels.notSet,
          options: Object.values(EActivityLevel).map((level) => ({
            value: level,
            label: labels.activityLevels[level],
          })),
        },
      ]}
    />
  );
};

export default BodyStats;

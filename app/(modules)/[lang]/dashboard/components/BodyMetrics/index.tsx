'use client';

import BmiCard from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics/BmiCard';
import CalorieCard from '@/app/(modules)/[lang]/dashboard/components/BodyMetrics/CalorieCard';
import { PROFILE_SECTION_IDS } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/constants';
import { bodyMetrics } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useParams } from 'next/navigation';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

/** BMI and calories, live from the User's Profile. */
const BodyMetrics = () => {
  const { user } = useUserContext();
  const { lang } = useParams<{ lang: string }>();
  const labels = useDictionary().dashboard.bodyMetrics;

  const { bmi, calories, missing } = bodyMetrics({
    bodyStats: user.bodyStats,
    dateOfBirth: user.personalInformation?.dateOfBirth,
    today: new Date(),
  });

  const profileHref = (sectionId: string) =>
    `/${lang}/dashboard/profile#${sectionId}`;
  const bodyStatsHref = profileHref(PROFILE_SECTION_IDS.bodyStats);
  const onlyDateOfBirthMissing =
    bmi && !calories && missing.every((field) => field === 'dateOfBirth');

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <BmiCard bmi={bmi} locale={lang} bodyStatsHref={bodyStatsHref} />
      <CalorieCard
        calories={calories}
        locale={lang}
        missing={
          onlyDateOfBirthMissing
            ? {
                message: labels.calories.dateOfBirthMissing,
                linkLabel: labels.addDateOfBirth,
                href: profileHref(PROFILE_SECTION_IDS.personalInformation),
              }
            : {
                message: labels.calories.empty,
                linkLabel: labels.addBodyStats,
                href: bodyStatsHref,
              }
        }
      />
    </section>
  );
};

export default BodyMetrics;

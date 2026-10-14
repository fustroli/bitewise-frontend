'use client';

import { BODY_FAT_FIELDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/constants';
import BmiCard from '@/app/(modules)/[lang]/dashboard/components/Overview/BmiCard';
import BodyFatCard from '@/app/(modules)/[lang]/dashboard/components/Overview/BodyFatCard';
import CaloriesByGoalCard from '@/app/(modules)/[lang]/dashboard/components/Overview/CaloriesByGoalCard';
import MacrosCard from '@/app/(modules)/[lang]/dashboard/components/Overview/MacrosCard';
import { PROFILE_SECTION_IDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/constants';
import Section from '@/app/components/layout/Section';
import SetupTargets from '@/app/(modules)/[lang]/dashboard/components/Overview/SetupTargets';
import SummaryTiles from '@/app/(modules)/[lang]/dashboard/components/Overview/SummaryTiles';
import { bodyMetrics } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useMacroPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_body-metrics/hooks';
import { useParams } from 'next/navigation';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

const PAIRED_GRID_CLASS =
  'grid items-start gap-4 md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))]';

/**
 * Today's summary, Nutrition and Body, live from the User's Profile. Until
 * there is a BMI (height and weight), the setup steps and empty tiles instead.
 */
const Overview = () => {
  const { user } = useUserContext();
  const { lang } = useParams<{ lang: string }>();
  const { dashboard } = useDictionary();
  const labels = dashboard.bodyMetrics;
  const [planName, setPlanName] = useMacroPlan();

  const dateOfBirth = user.personalInformation?.dateOfBirth;
  const metrics = bodyMetrics({
    bodyStats: user.bodyStats,
    dateOfBirth,
    today: new Date(),
  });
  const { bmi, bodyFat, calories, macros, missing } = metrics;
  const plan = macros?.plans.find((option) => option.plan === planName);

  const profileHref = (sectionId: string) =>
    `/${lang}/dashboard/profile#${sectionId}`;
  const bodyStatsHref = profileHref(PROFILE_SECTION_IDS.bodyStats);
  const personalInformationHref = profileHref(
    PROFILE_SECTION_IDS.personalInformation,
  );

  if (!bmi) {
    return (
      <>
        <SetupTargets
          bodyStats={user.bodyStats}
          dateOfBirth={dateOfBirth}
          bodyStatsHref={bodyStatsHref}
          personalInformationHref={personalInformationHref}
        />
        <Section
          id="summary"
          title={dashboard.summary.title}
          description={dashboard.summary.pending}
        >
          <SummaryTiles metrics={metrics} locale={lang} />
        </Section>
      </>
    );
  }

  const onlyDateOfBirthMissing =
    !calories &&
    !missing.some((field) => field === 'sex' || field === 'activityLevel');
  const caloriesMissing = (card: {
    empty: string;
    dateOfBirthMissing: string;
  }) =>
    onlyDateOfBirthMissing
      ? {
          message: card.dateOfBirthMissing,
          linkLabel: labels.addDateOfBirth,
          href: personalInformationHref,
        }
      : {
          message: card.empty,
          linkLabel: labels.addBodyStats,
          href: bodyStatsHref,
        };

  return (
    <>
      <Section
        id="summary"
        title={dashboard.summary.title}
        description={dashboard.summary.description}
      >
        <SummaryTiles metrics={metrics} plan={plan} locale={lang} />
      </Section>
      <Section
        id="nutrition"
        title={dashboard.nutrition.title}
        description={dashboard.nutrition.description}
      >
        <div className={PAIRED_GRID_CLASS}>
          <CaloriesByGoalCard
            calories={calories}
            missing={caloriesMissing(labels.calories)}
            locale={lang}
          />
          <MacrosCard
            macros={macros}
            plan={plan}
            onPlanChange={setPlanName}
            missing={caloriesMissing(labels.macros)}
            locale={lang}
          />
        </div>
      </Section>
      <Section
        id="body"
        title={dashboard.body.title}
        description={dashboard.body.description}
      >
        <div className={PAIRED_GRID_CLASS}>
          <BmiCard bmi={bmi} locale={lang} />
          <BodyFatCard
            bodyFat={bodyFat}
            sex={user.bodyStats?.sex}
            inputsMissing={missing.some((field) =>
              BODY_FAT_FIELDS.includes(field),
            )}
            locale={lang}
            bodyStatsHref={bodyStatsHref}
          />
        </div>
      </Section>
    </>
  );
};

export default Overview;

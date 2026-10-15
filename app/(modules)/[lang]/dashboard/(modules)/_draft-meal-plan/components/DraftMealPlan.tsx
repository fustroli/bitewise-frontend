'use client';

import { DRAFT_SECTION_ID } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/constants';
import DraftMealPlanEditor from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlanEditor';
import DraftMealPlanSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlanSkeleton';
import DraftStartCard from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftStartCard';
import { IDraftSources } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import { resolveDraft } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/helpers';
import { useDraftMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/context';
import { useHydrated } from '@/app/hooks/use-hydrated';
import { useMemo } from 'react';

interface IProps extends IDraftSources {
  /** Where to complete the Body stats that Maintenance calories need. */
  profileHref: string;
}

/**
 * The draft's editor once there is a draft. Without one the header's buttons
 * start it; at phone width a card repeats them here.
 */
const DraftMealPlan = ({ meals, ingredients, profileHref }: IProps) => {
  const { stored, loads, save, clear, openLoad } = useDraftMealPlan();

  const sources = useMemo(() => ({ meals, ingredients }), [meals, ingredients]);
  const resolved = useMemo(
    () => stored && resolveDraft(stored, sources),
    [stored, sources],
  );

  // This boundary can hydrate after the provider has read the store: until
  // it has, it shows what the server rendered.
  const isHydrated = useHydrated();

  if (stored === undefined || !isHydrated) return <DraftMealPlanSkeleton />;

  if (!resolved) return <DraftStartCard />;

  return (
    <section id={DRAFT_SECTION_ID} className="scroll-mt-20">
      {/* The editor reads its draft once on mount, so a load remounts it. */}
      <DraftMealPlanEditor
        key={loads}
        initial={resolved}
        sources={sources}
        profileHref={profileHref}
        onSave={save}
        onClear={clear}
        onOpenLoad={() => openLoad()}
      />
    </section>
  );
};

export default DraftMealPlan;

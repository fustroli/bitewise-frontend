'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  EMPTY_DRAFT,
  draftStorageKey,
  parseDraft,
  resolveDraft,
  serializeDraft,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/helpers';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import DraftMealPlanEditor from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlanEditor';
import DraftMealPlanSkeleton from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlanSkeleton';
import { IDraftSources } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import LoadMealPlanDialog from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/LoadMealPlanDialog';
import { TStoredDraft } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/validations';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useLocalStorage } from '@/app/hooks/use-local-storage';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

interface IProps extends IDraftSources {
  /** Where to complete the Body stats that Maintenance calories need. */
  profileHref: string;
  mealPlansHref: string;
}

/** The User's one Draft meal plan, kept in this browser only. */
const DraftMealPlan = ({
  meals,
  ingredients,
  profileHref,
  mealPlansHref,
}: IProps) => {
  const labels = useDictionary().draftMealPlan;
  const { user } = useUserContext();
  const [raw, setRaw] = useLocalStorage(draftStorageKey(user.id));

  const sources = useMemo(() => ({ meals, ingredients }), [meals, ingredients]);
  const resolved = useMemo(() => {
    if (raw === undefined) return undefined;
    const stored = parseDraft(raw);
    return stored && resolveDraft(stored, sources);
  }, [raw, sources]);

  const save = useCallback(
    (draft: TStoredDraft) => setRaw(serializeDraft(draft)),
    [setRaw],
  );
  const clear = useCallback(() => setRaw(null), [setRaw]);

  // The editor reads its draft once on mount, so a loaded Meal plan remounts it.
  const [loads, setLoads] = useState(0);
  const load = useCallback(
    (draft: TStoredDraft) => {
      save(draft);
      setLoads((count) => count + 1);
    },
    [save],
  );

  // Not read until the client has hydrated.
  if (resolved === undefined) {
    return <DraftMealPlanSkeleton />;
  }

  if (!resolved) {
    return (
      <Card className="w-full border-none shadow-soft">
        <CardHeader>
          <CardTitle>{labels.title}</CardTitle>
          <CardDescription>{labels.startDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => save(EMPTY_DRAFT)}>{labels.start}</Button>
          <LoadMealPlanDialog
            lineCount={0}
            mealPlansHref={mealPlansHref}
            onLoad={load}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <DraftMealPlanEditor
      key={loads}
      initial={resolved}
      sources={sources}
      profileHref={profileHref}
      mealPlansHref={mealPlansHref}
      onSave={save}
      onClear={clear}
      onLoad={load}
    />
  );
};

export default DraftMealPlan;

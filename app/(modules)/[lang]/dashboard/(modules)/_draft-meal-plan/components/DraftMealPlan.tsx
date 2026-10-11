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
import { useCallback, useMemo } from 'react';

import { Button } from '@/app/components/ui/button';
import DraftMealPlanEditor from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMealPlanEditor';
import { IDraftSources } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import { Skeleton } from '@/app/components/ui/skeleton';
import { TStoredDraft } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/validations';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useLocalStorage } from '@/app/hooks/use-local-storage';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

interface IProps extends IDraftSources {
  /** Where to complete the Body stats that Maintenance calories need. */
  profileHref: string;
}

/** The User's one Draft meal plan, kept in this browser only. */
const DraftMealPlan = ({ meals, ingredients, profileHref }: IProps) => {
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

  // Not read until the client has hydrated.
  if (resolved === undefined) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  if (!resolved) {
    return (
      <Card className="w-full border-none shadow-soft">
        <CardHeader>
          <CardTitle>{labels.title}</CardTitle>
          <CardDescription>{labels.startDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => save(EMPTY_DRAFT)}>{labels.start}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <DraftMealPlanEditor
      initial={resolved}
      sources={sources}
      profileHref={profileHref}
      onSave={save}
      onClear={clear}
    />
  );
};

export default DraftMealPlan;

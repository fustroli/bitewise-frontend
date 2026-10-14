'use client';

import { Download, Plus } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { DRAFT_SECTION_ID } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/constants';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useDraftMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/context';

/** The dashboard header's Load meal plan and Start draft day buttons. */
const DraftActions = () => {
  const labels = useDictionary().draftMealPlan;
  const { stored, start, openLoad } = useDraftMealPlan();

  return (
    <>
      <Button type="button" variant="outline" onClick={() => openLoad()}>
        <Download aria-hidden />
        {labels.load.button}
      </Button>
      {stored ? (
        <Button asChild>
          <a href={`#${DRAFT_SECTION_ID}`}>{labels.header.openDraft}</a>
        </Button>
      ) : (
        <Button type="button" onClick={start}>
          <Plus aria-hidden />
          {labels.header.startDay}
        </Button>
      )}
    </>
  );
};

export default DraftActions;

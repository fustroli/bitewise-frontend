'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  TLoadMealPlanSchema,
  TStoredDraft,
  createLoadMealPlanSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/validations';
import { convertToOptions, interpolate } from '@/app/utils/helpers';
import { useMemo, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import ComboboxField from '@/app/components/form/ComboboxField';
import { Download } from 'lucide-react';
import { Form } from '@/app/components/ui/form';
import FormDialogFooter from '@/app/components/dialogs/FormDialogFooter';
import { IDraftMealPlanOption } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import Link from 'next/link';
import { fetchDraftMealPlans } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/actions';
import { mealPlanDraft } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/helpers';
import { toast } from '@/app/hooks/use-toast';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface IProps {
  /** Lines the load would replace; 0 for no warning. */
  lineCount: number;
  mealPlansHref: string;
  onLoad: (draft: TStoredDraft) => void;
}

/** `undefined` while loading, `null` when the fetch failed. */
type TMealPlans = IDraftMealPlanOption[] | null | undefined;

/** Replaces the draft with a copy of a Meal plan; nothing is saved on the backend. */
const LoadMealPlanDialog = ({ lineCount, mealPlansHref, onLoad }: IProps) => {
  const dictionary = useDictionary();
  const { draftMealPlan, resourceTable } = dictionary;
  const labels = draftMealPlan.load;

  const [isOpen, setIsOpen] = useState(false);
  const [mealPlans, setMealPlans] = useState<TMealPlans>();

  const schema = useMemo(
    () => createLoadMealPlanSchema(dictionary),
    [dictionary],
  );
  const form = useForm<TLoadMealPlanSchema>({
    resolver: zodResolver(schema),
    defaultValues: { mealPlanId: 0 },
  });

  // Fresh plans on every open.
  const load = async () => {
    setMealPlans(undefined);
    const result = await fetchDraftMealPlans();
    setMealPlans(result.ok ? result.data : null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      form.reset();
      void load();
    }
  };

  const onSubmit = ({ mealPlanId }: TLoadMealPlanSchema) => {
    const mealPlan = mealPlans?.find(({ id }) => id === mealPlanId);
    if (!mealPlan) return;

    onLoad(mealPlanDraft(mealPlan.mealIds));
    setIsOpen(false);
    toast({
      variant: 'success',
      description: interpolate(labels.loaded, { name: mealPlan.name }),
    });
  };

  const renderBody = () => {
    if (mealPlans === undefined) {
      return <p className="py-4 text-muted-foreground">{labels.loading}</p>;
    }

    if (mealPlans === null) {
      return (
        <div className="flex flex-col items-start gap-3 py-4">
          <p className="text-destructive">{labels.error}</p>
          <Button type="button" variant="outline" onClick={() => void load()}>
            {labels.retry}
          </Button>
        </div>
      );
    }

    if (!mealPlans.length) {
      return (
        <div className="flex flex-col items-start gap-3 py-4">
          <p className="text-muted-foreground">{labels.empty}</p>
          <Button asChild variant="outline">
            <Link href={mealPlansHref}>{labels.goToMealPlans}</Link>
          </Button>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ComboboxField
            control={form.control}
            name="mealPlanId"
            label={labels.mealPlan}
            options={convertToOptions(mealPlans)}
            placeholder={labels.placeholder}
            searchPlaceholder={resourceTable.search}
            emptyText={resourceTable.notFound}
            className="w-full"
          />
          {lineCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {interpolate(labels.replaceWarning, { count: lineCount })}
            </p>
          )}
          <FormDialogFooter
            form={form}
            onClose={() => setIsOpen(false)}
            submitLabel={labels.submit}
            closeLabel={resourceTable.cancel}
          />
        </form>
      </Form>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Download />
          <span className="sr-only sm:not-sr-only">{labels.button}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        {renderBody()}
      </DialogContent>
    </Dialog>
  );
};

export default LoadMealPlanDialog;

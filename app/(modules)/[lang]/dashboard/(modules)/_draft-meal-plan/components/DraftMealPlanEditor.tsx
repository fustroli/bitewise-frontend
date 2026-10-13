'use client';

import { Button, buttonVariants } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import {
  DEFAULT_MEAL_MULTIPLIER,
  DRAFT_STORAGE_VERSION,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/constants';
import {
  IDraftSources,
  IResolvedDraft,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/interfaces';
import {
  TDraftSchema,
  TStoredDraft,
  createDraftSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/validations';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { convertToOptions, interpolate } from '@/app/utils/helpers';
import {
  draftLineNutrition,
  draftNutrition,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/helpers';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import DeleteDialog from '@/app/components/DeleteDialog';
import DraftLineRow from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftLineRow';
import DraftMaintenance from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/DraftMaintenance';
import { EDraftLineKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/enums';
import { Form } from '@/app/components/ui/form';
import LoadMealPlanDialog from '@/app/(modules)/[lang]/dashboard/(modules)/_draft-meal-plan/components/LoadMealPlanDialog';
import { NUTRITION_COLUMNS } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import { formatNutrition } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { zodResolver } from '@hookform/resolvers/zod';

interface IProps {
  /** Read once, when the editor mounts; from then on the editor owns the draft. */
  initial: IResolvedDraft;
  sources: IDraftSources;
  profileHref: string;
  mealPlansHref: string;
  onSave: (draft: TStoredDraft) => void;
  onClear: () => void;
  onLoad: (draft: TStoredDraft) => void;
}

const DraftMealPlanEditor = ({
  initial,
  sources,
  profileHref,
  mealPlansHref,
  onSave,
  onClear,
  onLoad,
}: IProps) => {
  const dictionary = useDictionary();
  const { draftMealPlan: labels, resourceTable } = dictionary;

  const [removed] = useState(initial.removed);
  const [collapsed, setCollapsed] = useState(initial.draft.collapsed);

  const schema = useMemo(() => createDraftSchema(dictionary), [dictionary]);
  const form = useForm<TDraftSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { lines: initial.draft.lines },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  });
  const lines = useWatch({ control: form.control, name: 'lines' });

  // Flag what a stored draft left incomplete.
  useEffect(() => {
    void form.trigger();
  }, [form]);

  // Every change is saved as is. The first run also writes back a draft
  // whose missing items were just dropped.
  useEffect(() => {
    onSave({ version: DRAFT_STORAGE_VERSION, collapsed, lines });
  }, [collapsed, lines, onSave]);

  const options = useMemo(
    () => ({
      [EDraftLineKind.MEAL]: convertToOptions(sources.meals),
      [EDraftLineKind.INGREDIENT]: convertToOptions(sources.ingredients),
    }),
    [sources],
  );

  // An item appears on one line only: each line offers what no other line
  // of its kind picked.
  const optionsFor = (index: number, kind: EDraftLineKind) =>
    options[kind].filter(
      ({ value }) =>
        !lines.some(
          (line, other) =>
            other !== index && line.kind === kind && line.itemId === value,
        ),
    );

  const total = draftNutrition(lines, sources);
  const columnLabel = (nutrient: string) =>
    labels.columns[nutrient as keyof typeof labels.columns];

  return (
    <Card className="w-full border-none shadow-soft">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>{labels.title}</CardTitle>
          <CardDescription>{labels.description}</CardDescription>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LoadMealPlanDialog
            lineCount={lines.length}
            mealPlansHref={mealPlansHref}
            onLoad={onLoad}
          />
          <DeleteDialog
            title={labels.clear}
            subtitle={labels.clearConfirm}
            triggerLabel={
              <>
                <Trash2 />
                <span className="sr-only sm:not-sr-only">{labels.clear}</span>
              </>
            }
            triggerClassName={buttonVariants({ variant: 'outline' })}
            cancelLabel={resourceTable.cancel}
            confirmLabel={labels.clear}
            onConfirm={onClear}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={!collapsed}
            aria-label={collapsed ? labels.expand : labels.collapse}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-6">
          {removed > 0 && (
            <p className="text-sm text-muted-foreground">
              {interpolate(labels.removed, { count: removed })}
            </p>
          )}

          {fields.length > 0 ? (
            <Form {...form}>
              <Table aria-label={labels.title}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{labels.columns.item}</TableHead>
                    <TableHead>{labels.columns.quantity}</TableHead>
                    {NUTRITION_COLUMNS.map(({ nutrient }) => (
                      <TableHead key={nutrient} className="whitespace-nowrap">
                        {columnLabel(nutrient)}
                      </TableHead>
                    ))}
                    <TableHead>
                      <span className="sr-only">{resourceTable.actions}</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    // Right after an append, the watched values can be a
                    // render behind the rows.
                    const line = lines[index] ?? field;
                    return (
                      <DraftLineRow
                        key={field.id}
                        index={index}
                        line={line}
                        control={form.control}
                        options={optionsFor(index, line.kind)}
                        sources={sources}
                        nutrition={draftLineNutrition(line, sources)}
                        onRemove={() => remove(index)}
                      />
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold">
                      {labels.total}
                    </TableCell>
                    {NUTRITION_COLUMNS.map((column) => (
                      <TableCell
                        key={column.nutrient}
                        className="whitespace-nowrap font-semibold"
                      >
                        {formatNutrition(total, column)}
                      </TableCell>
                    ))}
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </Form>
          ) : (
            <p className="text-sm text-muted-foreground">{labels.empty}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="tinted"
              onClick={() =>
                append({
                  kind: EDraftLineKind.MEAL,
                  itemId: 0,
                  quantity: DEFAULT_MEAL_MULTIPLIER,
                })
              }
            >
              {labels.addMeal}
            </Button>
            <Button
              type="button"
              variant="tinted"
              onClick={() =>
                append({
                  kind: EDraftLineKind.INGREDIENT,
                  itemId: 0,
                  quantity: null,
                })
              }
            >
              {labels.addIngredient}
            </Button>
          </div>

          <DraftMaintenance kcal={total.calories} profileHref={profileHref} />
        </CardContent>
      )}
    </Card>
  );
};

export default DraftMealPlanEditor;

'use client';

import {
  IComparisonOption,
  SLOT_DOT_CLASSES,
} from '@/app/(modules)/[lang]/dashboard/compare/components/compare.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import { cn } from '@/app/lib';
import { interpolate } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useMemo } from 'react';

/** The Select's value for an empty optional slot. */
const NONE = 'none';

interface IProps {
  items: IComparisonOption[];
  ids: (number | null)[];
  onPick: (slot: number, id: number | null) => void;
}

/** One labelled picker per slot; the first (the baseline) can't be emptied. */
const SlotPickers = ({ items, ids, onPick }: IProps) => {
  const labels = useDictionary().comparison;
  const options = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );

  return (
    <div className="grid overflow-hidden rounded-lg border bg-card md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:gap-4 md:overflow-visible md:border-0 md:bg-transparent">
      {ids.map((id, slot) => {
        const selectId = `compare-slot-${slot}`;
        const isBaseline = slot === 0;
        const isKnown = items.some((item) => item.id === id);

        return (
          <div
            key={slot}
            className="flex items-center gap-3 border-t px-4 py-3 first:border-t-0 md:flex-col md:items-stretch md:gap-2 md:rounded-lg md:border md:bg-card md:p-4 md:first:border-t"
          >
            <label
              htmlFor={selectId}
              className="flex w-24 shrink-0 items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-secondary-foreground md:w-auto"
            >
              <span
                aria-hidden
                className={cn('size-2.5 rounded-full', SLOT_DOT_CLASSES[slot])}
              />
              {isBaseline
                ? labels.baseline
                : interpolate(labels.item, { n: slot + 1 })}
            </label>
            <Select
              value={isKnown ? String(id) : isBaseline ? '' : NONE}
              onValueChange={(value) =>
                onPick(slot, value === NONE ? null : Number(value))
              }
            >
              <SelectTrigger
                id={selectId}
                className="min-w-0 flex-1 text-[15px] font-bold"
              >
                <SelectValue placeholder={labels.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {!isBaseline && (
                  <SelectItem value={NONE}>{labels.none}</SelectItem>
                )}
                {options.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
};

export default SlotPickers;

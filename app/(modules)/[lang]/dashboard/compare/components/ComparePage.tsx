'use client';

import {
  COMPARISON_KINDS,
  COMPARISON_MAX_ITEMS,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/constants';
import {
  IChosenItem,
  TComparisonItems,
} from '@/app/(modules)/[lang]/dashboard/compare/components/compare.types';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { Button } from '@/app/components/ui/button';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import EmptyState from '@/app/components/EmptyState';
import { IComparisonQuery } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import Link from 'next/link';
import NutrientTable from '@/app/(modules)/[lang]/dashboard/compare/components/NutrientTable';
import OverviewCards from '@/app/(modules)/[lang]/dashboard/compare/components/OverviewCards';
import PageHeader from '@/app/components/layout/PageHeader';
import { Scale } from 'lucide-react';
import Section from '@/app/components/layout/Section';
import SegmentedControl from '@/app/components/SegmentedControl';
import SlotPickers from '@/app/(modules)/[lang]/dashboard/compare/components/SlotPickers';
import { comparisonSearch } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useState } from 'react';

const LIST_ROUTES: Record<EComparisonKind, string> = {
  [EComparisonKind.INGREDIENTS]: '/ingredients',
  [EComparisonKind.MEALS]: '/meals',
  [EComparisonKind.MEAL_PLANS]: '/meal-plans',
};

const EMPTY_SLOTS = Array<number | null>(COMPARISON_MAX_ITEMS).fill(null);

interface IProps {
  initial: IComparisonQuery;
  items: TComparisonItems;
}

/** The kind switch, the three slots, the overview and the nutrient table. */
const ComparePage = ({ initial, items }: IProps) => {
  const labels = useDictionary().comparison;
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const [kind, setKind] = useState(initial.kind);
  const [picks, setPicks] = useState<
    Record<EComparisonKind, (number | null)[]>
  >(() => {
    const empty = Object.fromEntries(
      COMPARISON_KINDS.map((option) => [option, EMPTY_SLOTS]),
    ) as Record<EComparisonKind, (number | null)[]>;
    return {
      ...empty,
      [initial.kind]: EMPTY_SLOTS.map((_, slot) => initial.ids[slot] ?? null),
    };
  });

  const show = (nextKind: EComparisonKind, ids: (number | null)[]) =>
    router.replace(`${pathname}${comparisonSearch({ kind: nextKind, ids })}`, {
      scroll: false,
    });

  const switchKind = (nextKind: EComparisonKind) => {
    setKind(nextKind);
    show(nextKind, picks[nextKind]);
  };

  const pick = (slot: number, id: number | null) => {
    const ids = picks[kind].map((current, index) =>
      index === slot ? id : current,
    );
    setPicks({ ...picks, [kind]: ids });
    show(kind, ids);
  };

  const kindItems = items[kind];
  // An id the backend no longer returns is an empty slot.
  const chosen: IChosenItem[] = picks[kind].flatMap((id, slot) => {
    const item = kindItems.find((option) => option.id === id);
    return item ? [{ slot, item }] : [];
  });
  const baseline = chosen.find(({ slot }) => slot === 0);

  const kindSwitch = (className?: string) => (
    <SegmentedControl
      label={labels.kindLabel}
      value={kind}
      onChange={switchKind}
      options={COMPARISON_KINDS.map((option) => ({
        value: option,
        label: labels.kinds[option],
      }))}
      className={className}
    />
  );

  const renderBody = () => {
    if (kindItems.length < 2) {
      return (
        <div className="rounded-lg border bg-card">
          <EmptyState
            icon={Scale}
            title={labels.empty[kind]}
            action={
              <Button asChild>
                <Link href={`/${lang}/dashboard${LIST_ROUTES[kind]}`}>
                  {labels.empty.action[kind]}
                </Link>
              </Button>
            }
          />
        </div>
      );
    }

    return (
      <>
        <Section id="choose" title={labels.chooseTitle[kind]}>
          <SlotPickers items={kindItems} ids={picks[kind]} onPick={pick} />
        </Section>
        {baseline ? (
          <>
            <Section
              id="overview"
              title={labels.overview.title}
              description={labels.overview.description[kind]}
            >
              <OverviewCards kind={kind} chosen={chosen} lang={lang} />
            </Section>
            <NutrientTable chosen={chosen} lang={lang} />
          </>
        ) : (
          <div className="rounded-lg border bg-card">
            <EmptyState icon={Scale} title={labels.pickPrompt} />
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <PageHeader
        title={labels.page.title}
        description={labels.page.description}
        actions={kindSwitch()}
        mobileActions={null}
      />
      <div className="-mb-2 md:hidden">
        {kindSwitch('grid w-full grid-cols-3 [&>*]:px-1')}
      </div>
      {renderBody()}
    </>
  );
};

export default ComparePage;

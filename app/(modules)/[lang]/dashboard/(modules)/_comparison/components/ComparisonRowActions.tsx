'use client';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { GitCompareArrows } from 'lucide-react';
import { MenubarItem } from '@/app/components/ui/menubar';
import { ROW_ACTION_ITEM_CLASS } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/constants';
import { useComparisonContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/context';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  kind: EComparisonKind;
  id: number;
}

/** The row-actions menu entry that adds a record to its comparison or takes it out. */
const ComparisonRowAction = ({ kind, id }: IProps) => {
  const t = useDictionary().comparison;
  const { has, isFull, toggle } = useComparisonContext();
  const isCompared = has(kind, id);
  const isBlocked = !isCompared && isFull(kind);

  return (
    <MenubarItem
      className={ROW_ACTION_ITEM_CLASS}
      disabled={isBlocked}
      onSelect={() => toggle(kind, id)}
    >
      <GitCompareArrows />
      {isCompared ? t.remove : t.add}
      {isBlocked && (
        <span className="text-xs text-muted-foreground">{t.full}</span>
      )}
    </MenubarItem>
  );
};

export default ComparisonRowAction;

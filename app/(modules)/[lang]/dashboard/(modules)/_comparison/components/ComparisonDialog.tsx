'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import ComparisonTable from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/components/ComparisonTable';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IComparisonRow } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import { LucideIcon } from 'lucide-react';
import { fetchComparison } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/actions';
import { toastResult } from '@/app/utils/helpers/client';
import { useComparisonContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/context';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useState } from 'react';

interface IProps {
  kind: EComparisonKind;
  icon: LucideIcon;
  triggerClassName?: string;
}

const ComparisonDialog = ({ kind, icon, triggerClassName }: IProps) => {
  const TriggerIcon = icon;
  const t = useDictionary().comparison;
  const { ids, retain, remove, clear } = useComparisonContext();
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<IComparisonRow[]>();
  const kindIds = ids[kind];

  // Fresh data on every open; ids the backend no longer has are dropped.
  const load = async () => {
    setRows(undefined);
    const result = await fetchComparison(kind, kindIds);
    if (!result.ok) {
      toastResult(result, '');
      return;
    }
    setRows(result.data);
    retain(
      kind,
      result.data.map(({ id }) => id),
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && kindIds.length) void load();
  };

  const visibleRows = kindIds.flatMap((id) => {
    const row = rows?.find((item) => item.id === id);
    return row ? [row] : [];
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={triggerClassName}
          aria-label={t.title[kind]}
          title={t.title[kind]}
        >
          <TriggerIcon />
          {kindIds.length > 0 && (
            <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-xs">
              {kindIds.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t.title[kind]}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        {kindIds.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">{t.empty}</p>
        ) : rows === undefined ? (
          <p className="py-8 text-center text-muted-foreground">{t.loading}</p>
        ) : (
          <>
            {kindIds.length === 1 && (
              <p className="text-sm text-muted-foreground">{t.addMore}</p>
            )}
            <ComparisonTable
              rows={visibleRows}
              onRemove={(id) => remove(kind, id)}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => clear(kind)}
              >
                {t.clearAll}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonDialog;

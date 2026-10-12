'use client';

import { PropsWithChildren, useCallback, useMemo } from 'react';
import {
  comparisonStorageKey,
  parseComparison,
  serializeComparison,
  toggleId,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/helpers';

import { COMPARISON_MAX_ITEMS } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/constants';
import { ComparisonContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/context';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IComparisonContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import { useLocalStorage } from '@/app/hooks/use-local-storage';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';

/** The User's compared ids, kept in this browser only. */
export const ComparisonProvider = ({ children }: PropsWithChildren) => {
  const { user } = useUserContext();
  const [raw, setRaw] = useLocalStorage(comparisonStorageKey(user.id));
  const ids = useMemo(() => parseComparison(raw), [raw]);

  const update = useCallback(
    (kind: EComparisonKind, change: (current: number[]) => number[]) =>
      setRaw(serializeComparison({ ...ids, [kind]: change(ids[kind]) })),
    [ids, setRaw],
  );

  const value = useMemo<IComparisonContext>(
    () => ({
      ids,
      has: (kind, id) => ids[kind].includes(id),
      isFull: (kind) => ids[kind].length >= COMPARISON_MAX_ITEMS,
      toggle: (kind, id) => update(kind, (current) => toggleId(current, id)),
      remove: (kind, id) =>
        update(kind, (current) => current.filter((item) => item !== id)),
      retain: (kind, keep) =>
        update(kind, (current) => current.filter((id) => keep.includes(id))),
      clear: (kind) => update(kind, () => []),
    }),
    [ids, update],
  );

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

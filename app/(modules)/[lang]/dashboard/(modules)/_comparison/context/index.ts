import React, { useCallback, useContext } from 'react';

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IComparisonContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';

export const ComparisonContext = React.createContext<IComparisonContext | null>(
  null,
);

export const useComparisonContext = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error(
      'useComparisonContext must be used within a ComparisonProvider',
    );
  }
  return context;
};

/** Takes a deleted record out of its kind's comparison. */
export const useComparisonRemoval = (kind: EComparisonKind) => {
  const { remove } = useComparisonContext();
  return useCallback((id: number) => remove(kind, id), [remove, kind]);
};

import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { INutrition } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/interfaces';

/** What the comparison table needs of a compared item. */
export interface IComparisonRow extends INutrition {
  id: number;
  name: string;
  /** Ingredients only. */
  unit?: string;
}

export interface IComparisonContext {
  ids: Record<EComparisonKind, number[]>;
  has: (kind: EComparisonKind, id: number) => boolean;
  isFull: (kind: EComparisonKind) => boolean;
  /** Adds the id, or removes it when present; adding to a full list does nothing. */
  toggle: (kind: EComparisonKind, id: number) => void;
  remove: (kind: EComparisonKind, id: number) => void;
  /** Keeps only the ids in `keep`. */
  retain: (kind: EComparisonKind, keep: number[]) => void;
  clear: (kind: EComparisonKind) => void;
}

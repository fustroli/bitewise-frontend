'use client';

import ComparisonRowAction from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/components/ComparisonRowActions';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';

const MealComparisonAction = ({ record }: { record: IMeal }) => (
  <ComparisonRowAction kind={EComparisonKind.MEALS} id={record.id} />
);

export default MealComparisonAction;

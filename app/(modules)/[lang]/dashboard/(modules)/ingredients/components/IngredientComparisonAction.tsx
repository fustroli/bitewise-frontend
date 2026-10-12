'use client';

import ComparisonRowAction from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/components/ComparisonRowActions';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';

const IngredientComparisonAction = ({ record }: { record: IIngredient }) => (
  <ComparisonRowAction kind={EComparisonKind.INGREDIENTS} id={record.id} />
);

export default IngredientComparisonAction;

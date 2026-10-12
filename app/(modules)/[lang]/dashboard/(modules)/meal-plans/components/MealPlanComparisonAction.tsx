'use client';

import ComparisonRowAction from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/components/ComparisonRowActions';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IMealPlan } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/interfaces';

const MealPlanComparisonAction = ({ record }: { record: IMealPlan }) => (
  <ComparisonRowAction kind={EComparisonKind.MEAL_PLANS} id={record.id} />
);

export default MealPlanComparisonAction;

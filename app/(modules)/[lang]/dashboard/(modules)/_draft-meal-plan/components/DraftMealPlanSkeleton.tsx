import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Stands in for the Draft meal plan while its sources load and until the
 * client has read the stored draft, so both waits look the same.
 */
const DraftMealPlanSkeleton = () => (
  <Skeleton className="h-40 w-full rounded-xl" />
);

export default DraftMealPlanSkeleton;

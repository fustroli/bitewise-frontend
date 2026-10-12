'use client';

import { COMPARISON_KINDS } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/constants';
import ComparisonDialog from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/components/ComparisonDialog';

const ComparisonButtons = ({
  triggerClassName,
}: {
  triggerClassName?: string;
}) => (
  <>
    {COMPARISON_KINDS.map(({ kind, icon }) => (
      <ComparisonDialog
        key={kind}
        kind={kind}
        icon={icon}
        triggerClassName={triggerClassName}
      />
    ))}
  </>
);

export default ComparisonButtons;

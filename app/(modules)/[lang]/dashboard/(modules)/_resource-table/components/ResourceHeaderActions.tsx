import {
  IResourceList,
  IResourceRecord,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { Plus, Scale } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

interface IProps<TRecord extends IResourceRecord, TFormData> {
  resource: IResourceList<TRecord, TFormData>;
  formData: Promise<TFormData>;
  compareLabel: string;
  addLabel: string;
  lang: string;
  /** `icon`: the phone app bar's icon buttons. */
  variant: 'buttons' | 'icon';
}

async function AddDialog<TRecord extends IResourceRecord, TFormData>({
  resource,
  formData,
  variant,
}: Pick<IProps<TRecord, TFormData>, 'resource' | 'formData' | 'variant'>) {
  const Dialog = resource.dialog;

  return (
    <Dialog
      formData={await formData}
      trigger={variant === 'icon' ? 'icon' : 'button'}
    />
  );
}

/** "Compare …" and "Add …"; the Add dialog waits for its form data. */
function ResourceHeaderActions<TRecord extends IResourceRecord, TFormData>({
  resource,
  formData,
  compareLabel,
  addLabel,
  lang,
  variant,
}: IProps<TRecord, TFormData>) {
  const compareHref = `/${lang}/dashboard/compare?type=${resource.compareType}`;
  const isIcon = variant === 'icon';

  return (
    <>
      {isIcon ? (
        <Button asChild variant="ghost" size="icon" className="size-11">
          <Link href={compareHref} aria-label={compareLabel}>
            <Scale aria-hidden className="!size-5" />
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline">
          <Link href={compareHref}>
            <Scale aria-hidden />
            {compareLabel}
          </Link>
        </Button>
      )}
      <Suspense
        fallback={
          isIcon ? (
            <Button
              size="icon"
              className="size-11"
              disabled
              aria-label={addLabel}
            >
              <Plus aria-hidden className="!size-5" />
            </Button>
          ) : (
            <Button disabled>
              <Plus aria-hidden />
              {addLabel}
            </Button>
          )
        }
      >
        <AddDialog resource={resource} formData={formData} variant={variant} />
      </Suspense>
    </>
  );
}

export default ResourceHeaderActions;

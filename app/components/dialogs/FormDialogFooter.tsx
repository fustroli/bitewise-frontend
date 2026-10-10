import { DialogClose, DialogFooter } from '@/app/components/ui/dialog';

import { Button } from '@/app/components/ui/button';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import { UseFormReturn } from 'react-hook-form';

interface IProps {
  form: UseFormReturn<any>;
  onClose: () => void;
  submitLabel: string;
  closeLabel: string;
}
const FormDialogFooter = ({
  form,
  onClose,
  submitLabel,
  closeLabel,
}: IProps) => {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="secondary" onClick={onClose}>
          {closeLabel}
        </Button>
      </DialogClose>

      <LoadingButton
        loading={form.formState.isSubmitting}
        type="submit"
        variant="default"
      >
        {submitLabel}
      </LoadingButton>
    </DialogFooter>
  );
};

export default FormDialogFooter;

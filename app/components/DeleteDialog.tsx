import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';

import { ReactNode } from 'react';

interface IProps {
  onConfirm: () => void;
  title: string;
  subtitle: string;
  triggerLabel: ReactNode;
  triggerClassName?: string;
  cancelLabel: string;
  confirmLabel: string;
}

const DeleteDialog = (props: IProps) => {
  const {
    onConfirm,
    title,
    subtitle,
    triggerLabel,
    triggerClassName,
    cancelLabel,
    confirmLabel,
  } = props;
  const handleConfirm = () => onConfirm();

  return (
    <AlertDialog>
      <AlertDialogTrigger className={triggerClassName}>
        {triggerLabel}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{subtitle}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;

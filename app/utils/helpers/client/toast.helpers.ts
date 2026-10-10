import 'client-only';

import { TApiResult, TApiSuccess } from '@/app/utils/interfaces';
import { toast } from '@/app/hooks/use-toast';

/** Shows the backend's message on failure, `successMessage` on success. */
export const toastResult = <T>(
  result: TApiResult<T>,
  successMessage: string,
): result is TApiSuccess<T> => {
  if (result.ok) {
    toast({ variant: 'success', description: successMessage });
  } else {
    toast({ variant: 'error', description: result.message });
  }

  return result.ok;
};

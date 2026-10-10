import FieldFrame, {
  FieldControl,
  IFieldProps,
} from '@/app/components/form/FieldFrame';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';

import { Button } from '@/app/components/ui/button';
import { Calendar } from '@/app/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { FROM_YEAR } from '@/app/utils/constants';
import { FieldValues } from 'react-hook-form';
import { cn } from '@/app/lib';
import { format } from 'date-fns';

interface IProps<T extends FieldValues> extends IFieldProps<T> {
  label?: string;
}
const DatePicker = <T extends FieldValues>({
  control,
  name,
  label,
}: IProps<T>) => (
  <FieldFrame
    control={control}
    name={name}
    label={label}
    className="flex flex-col"
  >
    {(field) => (
      <Popover>
        <PopoverTrigger asChild>
          <FieldControl>
            <Button
              variant={'outline'}
              className={cn(
                'w-[200px] pl-3 text-left font-normal',
                !field.value && 'text-muted-foreground',
              )}
            >
              {field.value ? (
                format(field.value, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto size-4 opacity-50" />
            </Button>
          </FieldControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            weekStartsOn={1}
            selected={new Date(field.value as string)}
            onSelect={field.onChange}
            disabled={(date) =>
              date > new Date() || date < new Date('1900-01-01')
            }
            initialFocus
            fromYear={FROM_YEAR}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    )}
  </FieldFrame>
);

export default DatePicker;

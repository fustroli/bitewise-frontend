import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';

import { Button } from '@/app/components/ui/button';
import { Calendar } from '@/app/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { FROM_YEAR } from '@/app/utils/constants';
import { TPersonalInfoSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations/personal-information.validation';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/app/lib';
import { format } from 'date-fns';

interface IProps {
  form: UseFormReturn<TPersonalInfoSchema>;
  name: string;
}
const DatePicker = ({ form, name }: IProps) => {
  return (
    <FormField
      control={form.control}
      name={name as keyof TPersonalInfoSchema}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
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
              </FormControl>
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePicker;

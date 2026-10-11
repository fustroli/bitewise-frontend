'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command';
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
import { FieldValues } from 'react-hook-form';
import { IOption } from '@/app/utils/interfaces';
import { cn } from '@/app/lib';

interface IProps<T extends FieldValues> extends IFieldProps<T> {
  label: string;
  hideLabel?: boolean;
  options: IOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  /** Overrides the trigger's default 200px width. */
  className?: string;
}

/** Picks one option; the field value is its `value`. */
const ComboboxField = <T extends FieldValues>({
  control,
  name,
  label,
  hideLabel,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  className,
}: IProps<T>) => (
  <FieldFrame control={control} name={name} label={label} hideLabel={hideLabel}>
    {(field) => {
      const selectedLabel = options.find(
        (option) => option.value === field.value,
      )?.label;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <FieldControl>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                title={selectedLabel}
                className={cn('w-[200px] justify-between', className)}
              >
                <span className="truncate">{selectedLabel ?? placeholder}</span>
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </FieldControl>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[200px] p-0">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => field.onChange(option.value)}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          field.value === option.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }}
  </FieldFrame>
);

export default ComboboxField;

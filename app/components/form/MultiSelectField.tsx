'use client';

import { Check, ChevronsUpDown, XIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { IOption } from '@/app/utils/interfaces';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/app/lib';

interface IProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: IOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  removeLabel: (option: IOption) => string;
}

/** Picks a set of distinct options; the field value is their `value`s. */
const MultiSelectField = ({
  form,
  name,
  label,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  removeLabel,
}: IProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selected: number[] = field.value ?? [];

        const toggle = (value: number) =>
          field.onChange(
            selected.includes(value)
              ? selected.filter((item) => item !== value)
              : [...selected, value],
          );

        const selectedOptions = options.filter((option) =>
          selected.includes(option.value),
        );

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {placeholder}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder={searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={`${option.label}-${option.value}`}
                          onSelect={() => toggle(option.value)}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              selected.includes(option.value)
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
            {!!selectedOptions.length && (
              <div className="flex flex-wrap gap-2">
                {selectedOptions.map((option) => (
                  <Badge key={option.value} variant="secondary">
                    {option.label}
                    <button
                      type="button"
                      aria-label={removeLabel(option)}
                      className="ml-2 w-3"
                      onClick={() => toggle(option.value)}
                    >
                      <XIcon className="w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default MultiSelectField;

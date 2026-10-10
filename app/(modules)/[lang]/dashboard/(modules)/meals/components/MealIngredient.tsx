'use client';

import { Button } from '@/app/components/ui/button';
import { Combobox } from '@/app/components/Combobox';
import { Delete } from 'lucide-react';
import { IOption } from '@/app/utils/interfaces';
import InputField from '@/app/components/form/InputField';
import { Label } from '@/app/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  index: number;
  options: IOption[];
  form: UseFormReturn<any>;
  onRemove: () => void;
}

const MealIngredient = ({ index, options, form, onRemove }: IProps) => {
  const {
    resourceTable,
    resources: {
      meals: { fields },
    },
  } = useDictionary();

  return (
    <div className="flex items-center gap-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={`mealIngredients.${index}.ingredientId`}>
          {fields.ingredient}
        </Label>
        <Combobox
          form={form}
          name={`mealIngredients.${index}.ingredientId`}
          options={options}
          placeholder={fields.ingredientPlaceholder}
          searchPlaceholder={resourceTable.search}
          emptyText={resourceTable.notFound}
        />
      </div>

      <InputField
        id={`mealIngredients.${index}.quantity`}
        form={form}
        label={fields.quantity}
        name={`mealIngredients.${index}.quantity`}
        type="number"
      />

      <Button
        type="button"
        aria-label={fields.removeIngredient}
        variant="destructive"
        onClick={() => onRemove()}
      >
        <Delete />
      </Button>
    </div>
  );
};

export default MealIngredient;

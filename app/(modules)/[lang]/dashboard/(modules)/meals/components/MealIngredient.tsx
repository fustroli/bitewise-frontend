'use client';

import { Button } from '@/app/components/ui/button';
import { Combobox } from '@/app/components/Combobox';
import { Delete } from 'lucide-react';
import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IOption } from '@/app/utils/interfaces';
import InputField from '@/app/components/form/InputField';
import { Label } from '@/app/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  index: number;
  options: IOption[];
  ingredients: IIngredient[];
  form: UseFormReturn<any>;
  onRemove: () => void;
}

const MealIngredient = ({
  index,
  options,
  ingredients,
  form,
  onRemove,
}: IProps) => {
  const {
    resourceTable,
    resources: {
      meals: { fields },
    },
  } = useDictionary();

  const ingredientId = form.watch(`mealIngredients.${index}.ingredientId`);
  const unit = ingredients.find(({ id }) => id === ingredientId)?.unit;

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
        endAdornment={
          unit && (
            <span className="pr-3 text-sm text-muted-foreground">
              {unit === EUnit.PIECE ? fields.pieces : fields.grams}
            </span>
          )
        }
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

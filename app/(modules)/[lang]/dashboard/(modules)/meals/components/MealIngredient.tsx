'use client';

import { Control, useWatch } from 'react-hook-form';

import { Button } from '@/app/components/ui/button';
import ComboboxField from '@/app/components/form/ComboboxField';
import { Delete } from 'lucide-react';
import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IOption } from '@/app/utils/interfaces';
import InputField from '@/app/components/form/InputField';
import { TMealSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/validations';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  index: number;
  options: IOption[];
  ingredients: IIngredient[];
  control: Control<TMealSchema>;
  onRemove: () => void;
}

const MealIngredient = ({
  index,
  options,
  ingredients,
  control,
  onRemove,
}: IProps) => {
  const {
    resourceTable,
    resources: {
      meals: { fields },
    },
  } = useDictionary();

  const ingredientId = useWatch({
    control,
    name: `mealIngredients.${index}.ingredientId`,
  });
  const unit = ingredients.find(({ id }) => id === ingredientId)?.unit;

  return (
    <div className="flex items-start gap-4">
      <ComboboxField
        control={control}
        name={`mealIngredients.${index}.ingredientId`}
        label={fields.ingredient}
        options={options}
        placeholder={fields.ingredientPlaceholder}
        searchPlaceholder={resourceTable.search}
        emptyText={resourceTable.notFound}
      />

      <InputField
        control={control}
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
        className="mt-8"
        onClick={() => onRemove()}
      >
        <Delete />
      </Button>
    </div>
  );
};

export default MealIngredient;

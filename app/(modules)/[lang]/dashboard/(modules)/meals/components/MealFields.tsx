'use client';

import { Button } from '@/app/components/ui/button';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IResourceFieldsProps } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import InputField from '@/app/components/form/InputField';
import MealIngredient from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/MealIngredient';
import { TMealSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/validations';
import { convertToOptions } from '@/app/utils/helpers';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useFieldArray } from 'react-hook-form';
import { useMemo } from 'react';

const MealFields = ({
  form,
  formData: ingredients,
}: IResourceFieldsProps<TMealSchema, IIngredient[]>) => {
  const { fields: labels } = useDictionary().resources.meals;

  const options = useMemo(() => convertToOptions(ingredients), [ingredients]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'mealIngredients',
  });

  const addIngredient = () => {
    append({ ingredientId: 0, quantity: 0 });
  };

  return (
    <>
      <InputField form={form} label={labels.name} name="name" type="text" />

      {fields.map((ingredient, index) => (
        <MealIngredient
          key={ingredient.id}
          index={index}
          form={form}
          options={options}
          ingredients={ingredients}
          onRemove={() => remove(index)}
        />
      ))}
      <Button type="button" onClick={addIngredient} variant="default">
        {labels.addIngredient}
      </Button>
    </>
  );
};

export default MealFields;

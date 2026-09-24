'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  ICreateMeal,
  IMeal,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import React, { useState } from 'react';
import {
  TMealSchema,
  mealSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/validations';
import {
  createMeal,
  updateMeal,
} from '@/app/(modules)/[lang]/dashboard/(modules)/meals/actions';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/app/components/ui/button';
import { DEFAULT_MEAL } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/constants';
import { EActionType } from '@/app/utils/enums';
import { Form } from '@/app/components/ui/form';
import FormDialogFooter from '@/app/components/dialogs/FormDialogFooter';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import InputField from '@/app/components/form/InputField';
import MealIngredient from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/MealIngredient';
import { Plus } from 'lucide-react';
import { createOrUpdateToasts } from '@/app/utils/helpers';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { zodResolver } from '@hookform/resolvers/zod';

interface IProps {
  ingredients: IIngredient[];
  mealEditValues?: IMeal | null;
}

const AddMealDialog = (props: IProps) => {
  const { mealEditValues, ingredients } = props;
  const [isOpen, setIsOpen] = useState(false);

  const initialFormData = mealEditValues || DEFAULT_MEAL;

  const form = useForm<TMealSchema>({
    resolver: zodResolver(mealSchema),
    defaultValues: initialFormData,
  });

  const { user } = useUserContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'mealIngredients',
  });

  const addIngredient = () => {
    append({ ingredientId: 0, quantity: 0 });
  };

  const onSubmit = async (values: TMealSchema) => {
    let result;

    if (mealEditValues) {
      result = await updateMeal(values as ICreateMeal, mealEditValues.id);
    } else {
      result = await createMeal({
        ...values,
        userId: user?.id,
      });
    }

    createOrUpdateToasts(
      mealEditValues ? EActionType.UPDATE : EActionType.CREATE,
      result,
    );

    if (!result.error) {
      form.reset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {mealEditValues ? (
        <DialogTrigger onClick={() => setIsOpen(true)}>Edit</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className="shadow-primary" onClick={() => setIsOpen(true)}>
            <Plus />
            Add
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2 px-4 pb-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>{mealEditValues ? 'Edit' : 'Add'} Meal</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <InputField form={form} label="Meal Name" name="name" type="text" />

            {fields.map((ingredient, index) => (
              <MealIngredient
                key={ingredient.id}
                index={index}
                form={form}
                allIngredients={ingredients}
                onRemove={remove}
              />
            ))}
            <Button onClick={addIngredient} variant="default">
              Add Ingredient
            </Button>
            <FormDialogFooter
              form={form}
              submitLabel={mealEditValues ? 'Edit' : 'Add'}
              onClose={() => setIsOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealDialog;

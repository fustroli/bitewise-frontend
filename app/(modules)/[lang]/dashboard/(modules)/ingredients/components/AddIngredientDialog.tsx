'use client';

import {
  ADD_INGRENDIENT_FIELDS,
  DEFAULT_INGREDIENT_VALUES,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  ICreateIngredient,
  IIngredient,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import React, { useState } from 'react';
import {
  TIngredientSchema,
  ingredientSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/validations';
import {
  createIngredient,
  updateIngredient,
} from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/actions';

import { Button } from '@/app/components/ui/button';
import { EActionType } from '@/app/utils/enums';
import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';
import { Form } from '@/app/components/ui/form';
import FormDialogFooter from '@/app/components/dialogs/FormDialogFooter';
import InputField from '@/app/components/form/InputField';
import { Plus } from 'lucide-react';
import SelectField from '@/app/components/form/Select';
import { SelectItem } from '@/app/components/ui/select';
import { createOrUpdateToasts } from '@/app/utils/helpers';
import { useForm } from 'react-hook-form';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { zodResolver } from '@hookform/resolvers/zod';

interface IProps {
  ingredientEditValues?: IIngredient | null;
}

const AddIngredientDialog: React.FC<IProps> = ({ ingredientEditValues }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TIngredientSchema>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: ingredientEditValues
      ? ingredientEditValues
      : DEFAULT_INGREDIENT_VALUES,
  });

  const { user } = useUserContext();

  async function onSubmit(values: TIngredientSchema) {
    let result;

    if (ingredientEditValues) {
      result = await updateIngredient(
        values as ICreateIngredient,
        ingredientEditValues.id,
      );
    } else {
      result = await createIngredient({
        ...values,
        price: 0, //TODO: implement later on
        userId: user?.id,
      } as ICreateIngredient);
    }

    createOrUpdateToasts(
      ingredientEditValues ? EActionType.UPDATE : EActionType.CREATE,
      result,
    );

    if (!result.error) {
      form.reset();
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {ingredientEditValues ? (
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
              <DialogTitle>
                {ingredientEditValues ? 'Edit' : 'Add'} Ingredient
              </DialogTitle>
              <DialogDescription />
            </DialogHeader>
            {ADD_INGRENDIENT_FIELDS.map((input) => (
              <InputField
                key={input.label}
                form={form}
                label={input.label}
                name={input.label as keyof TIngredientSchema}
                type={input.type}
              />
            ))}
            <SelectField
              name="unit"
              form={form}
              label="Unit"
              placeholder="Select unit..."
            >
              {Object.values(EUnit).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectField>
            <FormDialogFooter
              form={form}
              submitLabel={ingredientEditValues ? 'Edit' : 'Add'}
              onClose={() => setIsOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIngredientDialog;

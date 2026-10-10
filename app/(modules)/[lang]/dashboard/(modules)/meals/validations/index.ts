import { TDictionary } from '@/app/providers/dictionary-provider';
import { z } from 'zod';

export const createMealSchema = ({ resources: { meals } }: TDictionary) => {
  const mealIngredientSchema = z.object({
    ingredientId: z
      .number()
      .int()
      .positive({ message: meals.validation.ingredientRequired }),
    quantity: z
      .number({ error: meals.validation.quantityPositive })
      .positive({ message: meals.validation.quantityPositive }),
  });

  return z.object({
    name: z.string().min(1, meals.validation.nameRequired),
    mealIngredients: z
      .array(mealIngredientSchema)
      .min(1, meals.validation.ingredientsRequired),
  });
};

export type TMealSchema = z.infer<ReturnType<typeof createMealSchema>>;

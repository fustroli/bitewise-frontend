import { ICreateMealIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';

export interface IMealIngredient extends ICreateMealIngredient, IIngredient {
  id: number;
  ingredientName: string;
  ingredientId: number;
  quantity: number;
}

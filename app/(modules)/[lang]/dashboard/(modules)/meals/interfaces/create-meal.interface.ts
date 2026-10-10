import { ICreateMealIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';

export interface ICreateMeal {
  name: string;
  mealIngredients: ICreateMealIngredient[];
}

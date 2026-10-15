import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';

/** What a picker needs to offer an Ingredient. */
export interface IIngredientOption {
  id: number;
  name: string;
  unit: EUnit;
}

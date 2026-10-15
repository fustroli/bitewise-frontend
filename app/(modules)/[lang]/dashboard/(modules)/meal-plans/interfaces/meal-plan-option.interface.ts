/** What a picker needs to offer a Meal plan, and to load its Meals. */
export interface IMealPlanOption {
  id: number;
  name: string;
  /** The Meal plan's Meals, in its order. */
  mealIds: number[];
}

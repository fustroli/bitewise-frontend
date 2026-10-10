# BiteWise

Web app where a User records Ingredients, composes Meals from them, and groups Meals into Meal plans, with nutrition totals at each level.

## Language

### Food

**Ingredient**:
A food a User has recorded, with its nutrition values per Unit (calories, protein, fat, saturated fat, carbohydrates, sugar, fiber).
_Avoid_: Food item, product

**Unit**:
The amount an Ingredient's nutrition values refer to: either 100 g or one piece.
_Avoid_: Serving, portion

**Meal**:
A named combination of Meal ingredients. Its nutrition is the sum over its Meal ingredients.
_Avoid_: Dish

**Meal ingredient**:
An Ingredient used in a Meal, together with a quantity: grams for Ingredients measured per 100 g, a count for Ingredients measured per piece.
_Avoid_: Line item, component

**Meal plan**:
A named set of distinct Meals; the same Meal cannot appear twice. Its nutrition is the sum over its Meals.
_Avoid_: Diet, schedule

**Nutrition**:
The calories, protein, fat, saturated fat, carbohydrates, sugar and fiber of an Ingredient amount, Meal or Meal plan.
_Avoid_: Macros, nutrients

### Account

**User**:
A person with a BiteWise account, identified by their sign-in email. Owns their Ingredients, Meals and Meal plans.
_Avoid_: Account (for the person), member

**Profile**:
What a User says about themselves: personal information, social profiles, avatar, and Notification settings.
_Avoid_: Settings (for the whole page)

**Notification settings**:
Which kinds of email a User receives, and the default email address they are sent to (the sign-in email unless changed).

**Session**:
The period during which a User is signed in on a device. It starts at sign-in and ends at sign-out, account deletion, or when the backend rejects the User's token.
_Avoid_: Login (as a noun), auth

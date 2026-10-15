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

**Draft meal plan**:
A User's single scratchpad day outside their Meal plans (e.g. a cheat day): Meals with a multiplier and Ingredients with a quantity, each distinct. Kept only in the User's browser, never on the backend; its nutrition is compared with their Calorie target. It can be filled from a Meal plan, as a copy.
_Avoid_: Test plan, cheat plan

**Week plan**:
A User's single scratchpad week, Monday to Sunday, each day holding Meals with a multiplier and Ingredients with a quantity, each distinct within its day, like a Draft meal plan. Kept only in the User's browser, never on the backend; it has no dates. Days can be filled from a Meal plan or another day, as a copy.
_Avoid_: Calendar, weekly schedule

**Comparison**:
Up to 3 Ingredients, Meals or Meal plans of one kind a User puts side by side to compare their Nutrition, the first being the baseline the others are measured against. Kept only in the page's URL.
_Avoid_: Compare list, basket

**Nutrition**:
The calories, protein, fat, saturated fat, carbohydrates, sugar and fiber of an Ingredient amount, Meal or Meal plan.
_Avoid_: Macros, nutrients

### Account

**User**:
A person with a BiteWise account, identified by their sign-in email. Owns their Ingredients, Meals and Meal plans.
_Avoid_: Account (for the person), member

**Profile**:
What a User says about themselves: personal information, social profiles, avatar and Body stats.
_Avoid_: Settings (for the whole page)

**Email verification**:
Proof that a User controls their sign-in email: opening a single-use link mailed to it (valid 24 hours), or signing in with Google when Google has verified that email. Requesting a new link invalidates earlier ones. Unverified Users can still sign in and use BiteWise.
_Avoid_: Confirmation, activation

**Session**:
The period during which a User is signed in on a device. It starts at sign-in and ends at sign-out, account deletion, or when the backend rejects the User's token.
_Avoid_: Login (as a noun), auth

### Body

**Body stats**:
A User's sex, height, weight, neck, waist and hip circumference, and Activity level as currently recorded (metric, no history). Part of their Profile.
_Avoid_: Body metrics, biometrics, health data

**Activity level**:
How physically active a User is day to day: one of six steps from Sedentary to Extra active.
_Avoid_: Exercise level, lifestyle

**BMI category**:
The adult WHO band a User's BMI falls in, from Severe thinness to Obese class III.
_Avoid_: Weight class

**Body fat percentage**:
The share of a User's weight that is fat, estimated with the US Navy method from their sex, height, neck, waist and (for women) hip.
_Avoid_: Body composition, BF%

**Body fat category**:
The ACE band a User's Body fat percentage falls in for their sex, from Essential fat to Obese.
_Avoid_: Fat class

**Maintenance calories**:
The daily calories that keep a User's weight stable, given their Body stats, age and Activity level.
_Avoid_: TDEE, BMR

**Calorie target**:
Maintenance calories shifted for a weekly weight change: lose or gain 0.25, 0.5 or 1 kg, or Maintenance itself (no offset). A User picks one; it is stored on the backend and defaults to Maintenance. Meal plans, the Draft meal plan, each day of the Week plan and the dashboard compare a day's calories with it.
_Avoid_: Calorie goal, calorie budget, benchmark

**Macro plan**:
A named split of the User's Calorie target into protein, carbs and fat: Balanced, Low fat, Low carb or High protein. A target, not a measurement (unlike Nutrition). Shown as grams per day, kcal and share of calories, each with a range. A User picks one; it is stored on the backend and defaults to Balanced.
_Avoid_: Macro calculator, diet

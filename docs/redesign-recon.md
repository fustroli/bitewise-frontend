# Redesign recon

Where the pieces the green redesign touches live, before any change.

## Stack

- Next.js 16 App Router, no `src/`. Dashboard routes under
  `app/(modules)/[lang]/dashboard/`.
- Root layout `app/layout.tsx` (font: Poppins via `next/font/google`, theme via
  `next-themes`, so dark mode exists and is a Preference).
- Dashboard shell `app/(modules)/[lang]/dashboard/layout.tsx`: shadcn
  `SidebarProvider` + `components/AppSidebar.tsx` (menu from
  `constants/menu-items.constant.ts`, items `components/MenuItem.tsx`) and the
  top bar `components/AppBar.tsx` (sidebar trigger, `CustomBreadCrumbs`, the
  three comparison dialogs, `UserProfile` email + avatar, sign-out form).
- Tailwind v3: `tailwind.config.ts`, shadcn CSS variables (HSL, classic
  format) in `app/globals.css`, `:root` and `.dark`.
- shadcn components in `app/components/ui/`: alert, alert-dialog, avatar,
  badge, breadcrumb, button, calendar, card, command, dialog, form, input,
  label, menubar, pagination, popover, scroll-area, select, separator, sheet,
  sidebar, skeleton, slider, switch, table, tabs, textarea, toast, toaster,
  tooltip.

## Pages

| Page | Files |
| --- | --- |
| Dashboard | `dashboard/page.tsx`; `components/Statistics/*` (counts from `GET users/me/statistics`), `components/DraftMealPlan/index.tsx`, `components/BodyMetrics/*` (BMI, body fat, calories, macros cards) |
| Ingredients | `(modules)/ingredients/page.tsx` → `_resource-table` `ResourcePage` with `ingredients/resource/{list.tsx,form.ts}`, row `components/Table/IngredientTableRow.tsx`, unit badge `components/Unit.tsx` |
| Meals | `(modules)/meals/page.tsx`, `meals/resource/*`, `components/Table/MealTableRow.tsx` |
| Meal plans | `(modules)/meal-plans/page.tsx`, `meal-plans/resource/*`, `components/Table/*` (row + Maintenance line), `hooks/use-maintenance-targets.ts` |
| Profile | `(modules)/profile/page.tsx` (shadcn `Tabs`: My profile / Security / Preferences), `components/Profile/*`, `components/ProfileSection/*` (edit → save card), `components/Security/*`, `components/Appearance/*` |
| Draft meal plan | `(modules)/_draft-meal-plan/components/*` (editor kept in localStorage, `LoadMealPlanDialog`), mounted on the dashboard |

## Compare (the three unlabeled top-bar icons)

`(modules)/_comparison`: `ComparisonProvider` keeps up to 3 ids per kind
(ingredients, meals, meal plans) in localStorage; row menus add/remove via
`ComparisonRowActions`; `ComparisonButtons` → `ComparisonDialog` →
`ComparisonTable`; data from the `fetchComparison(kind, ids)` server action
(backend `ids` filter, nutrition via `_nutrition`). Already supports 3 items.

## Calculations

- `(modules)/_body-metrics/helpers/body-metrics.helpers.ts` `bodyMetrics()`:
  BMI + WHO category + healthy weight, US Navy body fat + ACE category + fat /
  lean mass, Mifflin-St Jeor maintenance, ±250/500/1000 kcal targets with the
  safe minimum, the four Macro plans with sugar and saturated fat caps.
  Constants (bands, plans, energy per gram) in `constants/`.
- `(modules)/_nutrition/helpers/nutrition.helpers.ts`: Meal ingredient, Meal
  and Meal plan Nutrition at full precision; `formatNutrition()` for display.
- `(modules)/meal-plans/helpers/maintenance.helpers.ts`: daily targets for the
  Meal plans list (Balanced plan).

## Data shapes

- Ingredient (`ingredients/interfaces`): `unit` `'100g' | 'piece'`, calories,
  protein, totalFat, saturatedFat, totalCarbohydrates, sugar, dietaryFiber.
- Meal: `mealIngredients` (Ingredient + `quantity`, grams or count).
- Meal plan: `meals` (full Meals).
- Body stats (`_user/interfaces`): sex, height, weight, neck, waist, hip,
  `activityLevel` (enum). No "last updated" date.

## Tests and checks

`bun run test` (Vitest), `bun run lint` (ESLint with boundaries, tailwind
class order), `npx tsc --noEmit`. Only `en` and `hu` dictionaries are loaded;
`de`, `es`, `fr` are disabled.

## Decisions

- Compare: state lives only in the URL (`/compare?type=&ids=`); the
  localStorage comparison list and its dialogs go.
- Draft meal plan stays a dashboard section.
- No unit filter on Ingredients (the backend can't filter by unit).
- Fixed desktop sidebar, no collapse.
- Dark mode is kept with equivalent green tokens.

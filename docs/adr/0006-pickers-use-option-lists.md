# Pickers use option lists; full records are fetched by id

A picker (the Meal form's Ingredients, the Meal plan form's Meals, Load meal plan, the Draft meal plan and Week plan lines, the compare slots) gets an **option list** from the backend: `GET /<kind>/options`, every record the User owns, sorted by name, uncapped, with only what the picker shows or needs (`id`, `name`, plus `unit` for an Ingredient and `mealIds` for a Meal plan). The full record, with Nutrition, is fetched only for what is actually used, by id (`GET /<kind>?ids=…`, at most 100, unknown ids omitted).

Before, every picker loaded the whole paginated list with `limit=100`, so a User with more than 100 records silently lost the rest. It also sent every record's Nutrition just to show names.

## Considered Options

- **Raise or remove the page cap** on the list routes: one change, but pickers keep loading full records they don't show, and the cap exists to bound those responses.
- **Async search combobox** (query as you type): scales to any size, but needs new combobox plumbing and a request per keystroke, for a User's own records that number in the hundreds at most. Revisit if that changes.
- **Sparse fieldsets** (`?fields=id,name`) on the list routes: generic machinery for three uses, and the shape of each response is no longer a fixed contract.
- **Dedicated option routes plus fetch by id** (chosen): a narrow, fixed contract per picker; payloads grow with what is used, not with what exists.

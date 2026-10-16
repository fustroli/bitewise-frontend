// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

import ComparePage from '@/app/(modules)/[lang]/dashboard/compare/components/ComparePage';
import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { EMPTY_NUTRITION } from '@/app/(modules)/[lang]/dashboard/(modules)/_nutrition/constants';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { UserProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/provider';
import en from '@/app/i18n/locales/en.json';
import userEvent from '@testing-library/user-event';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useParams: () => ({ lang: 'en' }),
  usePathname: () => '/en/dashboard/compare',
  useRouter: () => ({ replace }),
}));
vi.mock('@/app/(modules)/[lang]/dashboard/(modules)/_user/actions', () => ({}));
const fetchIngredientsByIds = vi.fn();
vi.mock(
  '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/actions',
  () => ({
    fetchIngredientsByIds: (ids: number[]) => fetchIngredientsByIds(ids),
  }),
);
vi.mock('@/app/(modules)/[lang]/dashboard/(modules)/meals/actions', () => ({
  fetchMealsByIds: vi.fn(),
}));
vi.mock(
  '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/actions',
  () => ({
    fetchMealPlansByIds: vi.fn(),
  }),
);

const labels = en.comparison;

const item = (id: number, name: string, calories: number, protein = 10) => ({
  ...EMPTY_NUTRITION,
  id,
  name,
  unit: '100g',
  calories,
  protein,
});

const ITEMS = {
  [EComparisonKind.INGREDIENTS]: [
    item(1, 'Oats', 379, 13.2),
    item(2, 'Rice', 130, 2.7),
    item(3, 'Egg', 72, 6.3),
  ],
  [EComparisonKind.MEALS]: [
    { ...item(9, 'Bowl', 630), unit: undefined, parts: 4 },
  ],
  [EComparisonKind.MEAL_PLANS]: [],
};

const OPTIONS = {
  [EComparisonKind.INGREDIENTS]: ITEMS[EComparisonKind.INGREDIENTS],
  [EComparisonKind.MEALS]: ITEMS[EComparisonKind.MEALS],
  [EComparisonKind.MEAL_PLANS]: [],
};

const USER: IUser = { id: 1, email: 'user@example.com' };

const renderPage = (
  ids: (number | null)[],
  items: Partial<typeof ITEMS> = ITEMS,
) =>
  render(
    <DictionaryProvider dictionary={en}>
      <UserProvider
        authUser={USER}
        actions={{
          updateUser: vi.fn(),
          updateAvatar: vi.fn(),
          requestEmailChange: vi.fn(),
          cancelEmailChange: vi.fn(),
        }}
      >
        <ComparePage
          initial={{ kind: EComparisonKind.INGREDIENTS, ids }}
          options={OPTIONS}
          items={items}
        />
      </UserProvider>
    </DictionaryProvider>,
  );

/** The nutrient table, once its section shows. */
const shownNutrientTable = async () => {
  await screen.findByRole('heading', { name: labels.nutrients.title });
  return nutrientTable();
};

const nutrientTable = () =>
  within(
    screen
      .getByRole('heading', { name: labels.nutrients.title })
      .closest('section')!,
  );

beforeAll(() => {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.scrollIntoView = () => {};
  // cmdk (the slot pickers' search list) observes its size.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

describe('ComparePage', () => {
  afterEach(() => {
    cleanup();
    replace.mockClear();
    fetchIngredientsByIds.mockReset();
  });

  it('asks for a baseline until one is picked', () => {
    renderPage([]);

    expect(screen.getByText(labels.pickPrompt)).toBeTruthy();
  });

  it('shows differences from the baseline', () => {
    renderPage([1, 2]);
    const table = nutrientTable();

    expect(table.getAllByText('−249 kcal').length).toBeGreaterThan(0);
    expect(table.getAllByText('−10.5 g').length).toBeGreaterThan(0);
  });

  it('says "same" for the same item twice', () => {
    renderPage([1, 1]);

    expect(nutrientTable().getAllByText(labels.nutrients.same).length).toBe(
      // 7 rows, desktop table and phone list.
      14,
    );
  });

  it('hides the differences on request', async () => {
    const user = userEvent.setup();
    renderPage([1, 2]);

    await user.click(
      screen.getByRole('checkbox', { name: labels.nutrients.showDifferences }),
    );

    expect(nutrientTable().queryByText('−249 kcal')).toBeNull();
  });

  it('puts a picked item in the URL', async () => {
    const user = userEvent.setup();
    renderPage([1]);

    await user.click(screen.getByRole('combobox', { name: /Item 2/ }));
    await user.click(screen.getByRole('option', { name: 'Egg' }));

    expect(replace).toHaveBeenLastCalledWith(
      '/en/dashboard/compare?type=ingredients&ids=1%2C3',
      { scroll: false },
    );
  });

  it('keeps each kind its own picks', async () => {
    const user = userEvent.setup();
    renderPage([1, 2]);

    const [kindSwitch] = screen.getAllByRole('radiogroup', {
      name: labels.kindLabel,
    });
    await user.click(
      within(kindSwitch).getByRole('radio', { name: labels.kinds.meals }),
    );
    expect(screen.getByText(labels.empty.meals)).toBeTruthy();

    await user.click(
      within(kindSwitch).getByRole('radio', { name: labels.kinds.ingredients }),
    );
    expect(replace).toHaveBeenLastCalledWith(
      '/en/dashboard/compare?type=ingredients&ids=1%2C2',
      { scroll: false },
    );
  });

  it('fetches a picked item it has not loaded yet', async () => {
    const [oats, , egg] = ITEMS[EComparisonKind.INGREDIENTS];
    fetchIngredientsByIds.mockResolvedValue({ ok: true, data: [egg] });
    const user = userEvent.setup();
    renderPage([1], { [EComparisonKind.INGREDIENTS]: [oats] });

    await user.click(screen.getByRole('combobox', { name: /Item 2/ }));
    await user.click(screen.getByRole('option', { name: 'Egg' }));

    expect(
      (await shownNutrientTable()).getAllByText('−307 kcal').length,
    ).toBeGreaterThan(0);
    expect(fetchIngredientsByIds).toHaveBeenCalledWith([3]);
  });

  it('leaves a slot empty when its item is gone', async () => {
    fetchIngredientsByIds.mockResolvedValue({ ok: true, data: [] });
    renderPage([2], { [EComparisonKind.INGREDIENTS]: [] });

    expect(await screen.findByText(labels.pickPrompt)).toBeTruthy();
  });
});

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ComparisonProvider } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/provider';
import { EComparisonKind } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/enums';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import { UserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { useComparisonContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/context';
import userEvent from '@testing-library/user-event';

const KIND = EComparisonKind.INGREDIENTS;
const STORAGE_KEY = 'bitewise:comparison:v1:1';

const Probe = () => {
  const { ids, toggle, remove, clear, isFull } = useComparisonContext();
  return (
    <>
      <output aria-label="ids">{ids[KIND].join(',')}</output>
      <output aria-label="full">{String(isFull(KIND))}</output>
      {[1, 2, 3, 4].map((id) => (
        <button key={id} onClick={() => toggle(KIND, id)}>
          toggle {id}
        </button>
      ))}
      <button onClick={() => remove(KIND, 1)}>remove 1</button>
      <button onClick={() => clear(KIND)}>clear</button>
    </>
  );
};

const renderProvider = () =>
  render(
    <UserContext.Provider value={{ user: { id: 1 } as IUser } as any}>
      <ComparisonProvider>
        <Probe />
      </ComparisonProvider>
    </UserContext.Provider>,
  );

const ids = () => screen.getByLabelText('ids').textContent;
const click = (name: string) =>
  userEvent.click(screen.getByRole('button', { name }));

describe('ComparisonProvider', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('adds, caps at 3, removes and clears', async () => {
    renderProvider();

    for (const id of [1, 2, 3, 4]) await click(`toggle ${id}`);
    expect(ids()).toBe('1,2,3');
    expect(screen.getByLabelText('full').textContent).toBe('true');

    await click('remove 1');
    expect(ids()).toBe('2,3');

    await click('clear');
    expect(ids()).toBe('');
  });

  it('keeps the ids in localStorage per User', async () => {
    renderProvider();
    await click('toggle 2');

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toMatchObject(
      {
        ingredients: [2],
      },
    );
  });

  it('starts from what is stored and treats unreadable data as empty', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      '{"ingredients":[5],"meals":[],"mealPlans":[]}',
    );
    renderProvider();
    expect(ids()).toBe('5');
    cleanup();

    window.localStorage.setItem(STORAGE_KEY, 'garbage');
    renderProvider();
    expect(ids()).toBe('');
  });
});

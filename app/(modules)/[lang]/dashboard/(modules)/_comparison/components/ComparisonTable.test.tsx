// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ComparisonTable from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/components/ComparisonTable';
import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import { IComparisonRow } from '@/app/(modules)/[lang]/dashboard/(modules)/_comparison/interfaces';
import en from '@/app/i18n/locales/en.json';
import userEvent from '@testing-library/user-event';

const ROW: IComparisonRow = {
  id: 4,
  name: 'Oats',
  unit: '100g',
  calories: 389,
  protein: 16.9,
  totalFat: 6.9,
  saturatedFat: 1.2,
  totalCarbohydrates: 66.3,
  sugar: 0,
  dietaryFiber: 10.6,
};

const renderTable = (rows: IComparisonRow[], onRemove = vi.fn()) => {
  render(
    <DictionaryProvider dictionary={en}>
      <ComparisonTable rows={rows} onRemove={onRemove} />
    </DictionaryProvider>,
  );
  return onRemove;
};

describe('ComparisonTable', () => {
  afterEach(cleanup);

  it('shows the name, the 7 Nutrition values and the Unit', () => {
    renderTable([ROW]);

    expect(screen.getAllByRole('columnheader')).toHaveLength(10);
    for (const text of [
      'Oats',
      '389 kcal',
      '16.9 g',
      '1.2 g',
      '10.6 g',
      '100g',
    ]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
  });

  it('leaves the Unit column out for rows without one', () => {
    renderTable([{ ...ROW, unit: undefined }]);
    expect(screen.queryByText(en.comparison.columns.unit)).toBeNull();
  });

  it('removes a row by its id', async () => {
    const onRemove = renderTable([ROW]);

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Oats from comparison' }),
    );
    expect(onRemove).toHaveBeenCalledWith(4);
  });
});

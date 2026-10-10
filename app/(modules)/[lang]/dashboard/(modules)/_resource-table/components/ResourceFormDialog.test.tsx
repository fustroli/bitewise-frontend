// @vitest-environment jsdom
import {
  IResourceForm,
  IResourceRecord,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { DictionaryProvider } from '@/app/providers/dictionary-provider';
import InputField from '@/app/components/form/InputField';
import ResourceFormDialog from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/components/ResourceFormDialog';
import { TApiResult } from '@/app/utils/interfaces';
import { UserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import en from '@/app/i18n/locales/en.json';
import { toast } from '@/app/hooks/use-toast';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';

vi.mock('@/app/hooks/use-toast', () => ({ toast: vi.fn() }));

type TValues = { name: string };

const USER_ID = 7;
const OK: TApiResult<unknown> = { ok: true, data: undefined };
const FAILED: TApiResult<unknown> = {
  ok: false,
  status: 400,
  message: 'Name taken',
};

const create = vi.fn<IResourceForm<IResourceRecord, TValues>['create']>();
const update = vi.fn<IResourceForm<IResourceRecord, TValues>['update']>();

const config: IResourceForm<IResourceRecord, TValues> = {
  resourceKey: 'ingredients',
  schema: () => z.object({ name: z.string().min(1) }),
  defaultValues: { name: '' },
  toFormValues: (record) => ({ name: record.name }),
  fields: ({ form }) => (
    <InputField control={form.control} label="Name" name="name" type="text" />
  ),
  create,
  update,
  remove: vi.fn(),
};

const renderDialog = (record?: IResourceRecord) =>
  render(
    <DictionaryProvider dictionary={en}>
      <UserContext.Provider
        value={{
          user: { id: USER_ID, email: '' },
          updateUser: vi.fn(),
          updateAvatar: vi.fn(),
        }}
      >
        <ResourceFormDialog
          config={config}
          record={record}
          formData={undefined}
        />
      </UserContext.Provider>
    </DictionaryProvider>,
  );

const nameInput = () => screen.getByRole<HTMLInputElement>('textbox');

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(cleanup);

describe('ResourceFormDialog', () => {
  it('creates, closes, and resets the form on success', async () => {
    const user = userEvent.setup();
    create.mockResolvedValue(OK);
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.type(nameInput(), 'Oats');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(create).toHaveBeenCalledWith({ name: 'Oats' }, USER_ID);
    expect(toast).toHaveBeenCalledWith({
      variant: 'success',
      description: en.resourceTable.created,
    });
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(nameInput().value).toBe('');
  });

  it('opens Edit pre-filled with the record', async () => {
    const user = userEvent.setup();
    renderDialog({ id: 3, name: 'Oats' });

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(nameInput().value).toBe('Oats');
  });

  it('updates and closes on success', async () => {
    const user = userEvent.setup();
    update.mockResolvedValue(OK);
    renderDialog({ id: 3, name: 'Oats' });

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(nameInput());
    await user.type(nameInput(), 'Rolled oats');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(update).toHaveBeenCalledWith({ name: 'Rolled oats' }, 3);
    expect(create).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('stays open and shows the message on failure', async () => {
    const user = userEvent.setup();
    create.mockResolvedValue(FAILED);
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.type(nameInput(), 'Oats');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(toast).toHaveBeenCalledWith({
      variant: 'error',
      description: 'Name taken',
    });
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(nameInput().value).toBe('Oats');
  });
});

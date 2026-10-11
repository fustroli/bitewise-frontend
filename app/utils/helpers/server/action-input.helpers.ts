import 'server-only';

import { TApiResult } from '@/app/utils/interfaces';
import { defaultLocale } from '@/app/i18n/settings';
import { getDictionary } from '@/app/i18n/dictionaries';
import { z } from 'zod';

const HTTP_BAD_REQUEST = 400;

/** A backend resource id: interpolated into paths, so never a free string. */
export const idSchema = z.number().int().positive();

/**
 * Server actions are public endpoints: their arguments are whatever the caller
 * sent, not what the types say. Parses them before anything reaches the
 * backend; unknown object keys are stripped. Messages are not shown, so the
 * dictionary-built schemas use the default locale.
 */
export const parseActionInput = <TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): TApiResult<z.output<TSchema>> => {
  const parsed = schema.safeParse(input);

  if (parsed.success) return { ok: true, data: parsed.data };

  return { ok: false, status: HTTP_BAD_REQUEST, message: 'Invalid input' };
};

/** The dictionary for building a module's form schema on the server. */
export const actionDictionary = () => getDictionary(defaultLocale);

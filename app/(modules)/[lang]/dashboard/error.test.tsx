// @vitest-environment jsdom
import {
  DictionaryProvider,
  TDictionary,
} from '@/app/providers/dictionary-provider';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import DashboardError from '@/app/(modules)/[lang]/dashboard/error';
import hu from '@/app/i18n/locales/hu.json';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('dashboard error boundary', () => {
  it('shows the localized generic text and digest in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    render(
      <DictionaryProvider dictionary={hu as TDictionary}>
        <DashboardError
          error={Object.assign(new Error('raw backend detail'), {
            digest: 'xyz',
          })}
          reset={() => {}}
        />
      </DictionaryProvider>,
    );

    expect(screen.queryByText('raw backend detail')).toBeNull();
    expect(screen.getByText(hu.errorBoundary.title)).toBeTruthy();
    expect(screen.getByText(hu.errorBoundary.description)).toBeTruthy();
    expect(screen.getByText(`${hu.errorBoundary.errorCode}: xyz`)).toBeTruthy();
  });
});

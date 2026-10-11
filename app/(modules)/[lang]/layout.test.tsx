import { describe, expect, it, vi } from 'vitest';

import LangLayout from '@/app/(modules)/[lang]/layout';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

const render = (lang: string) =>
  LangLayout({ children: 'page', params: Promise.resolve({ lang }) });

describe('[lang] layout', () => {
  it.each(['en', 'hu'])('renders the page for %s', async (lang) => {
    await expect(render(lang)).resolves.toBe('page');
  });

  it.each(['constructor', '__proto__', 'toString', 'xx'])(
    'is a 404 for %s',
    async (lang) => {
      await expect(render(lang)).rejects.toThrow('NEXT_NOT_FOUND');
    },
  );
});

import { describe, expect, it } from 'vitest';

import { MAX_FILE_SIZE } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/constants';
import { createRequire } from 'node:module';
import nextConfig from './next.config.mjs';

// The parser Next applies to `bodySizeLimit` (untyped).
const bytes = createRequire(import.meta.url)('next/dist/compiled/bytes');

// Multipart boundary and part headers around the file.
const MULTIPART_OVERHEAD = 64 * 1024;

describe('next.config', () => {
  it('lets a server action carry an avatar of MAX_FILE_SIZE', () => {
    const limit = bytes.parse(
      nextConfig.experimental?.serverActions?.bodySizeLimit,
    );

    expect(limit).toBeGreaterThanOrEqual(MAX_FILE_SIZE + MULTIPART_OVERHEAD);
  });
});

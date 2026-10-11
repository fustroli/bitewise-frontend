import { z } from 'zod';

// Zod's JIT probes `new Function`, which the CSP forbids (see
// `app/utils/security/csp.ts`); skip it so the browser logs no violation.
z.config({ jitless: true });

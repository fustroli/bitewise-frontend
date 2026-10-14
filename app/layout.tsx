import './globals.css';

import { Manrope } from 'next/font/google';
import type { Metadata } from 'next';
import { NONCE_HEADER } from '@/app/utils/security/csp';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Toaster } from '@/app/components/ui/toaster';
import { headers } from 'next/headers';

// Self-hosted by Next at build time (so `font-src 'self'` holds), preloaded,
// with a size-adjusted fallback. latin-ext covers hu/de/es/fr (ő, ű, ...).
const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'BiteWise - The Meal Planner',
  description:
    'BiteWise is a meal planner that helps you plan your meals and track your nutrition.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // next-themes' inline anti-flash script needs the proxy's CSP nonce.
  const nonce = (await headers()).get(NONCE_HEADER) ?? undefined;

  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

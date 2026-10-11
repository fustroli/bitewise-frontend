import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './globals.css';

import type { Metadata } from 'next';
import { NONCE_HEADER } from '@/app/utils/security/csp';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Toaster } from '@/app/components/ui/toaster';
import { headers } from 'next/headers';

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
    <html lang="en" suppressHydrationWarning>
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

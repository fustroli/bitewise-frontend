'use client';

import { Button } from '@/app/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md rounded-lg bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-2xl font-semibold text-destructive">
            Something went wrong!
          </h2>
          <p className="mb-6 text-foreground">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {error.digest && (
            <p className="mb-6 text-sm text-muted-foreground">
              Error Code: {error.digest}
            </p>
          )}
          <Button onClick={() => reset()} className="w-full">
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6">
        <AlertTriangle className="w-24 h-24 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground mb-4">
        Oops! Something went wrong
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} size="lg">
          Try Again
        </Button>
        <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-muted rounded-lg max-w-2xl">
          <p className="text-sm text-left font-mono text-destructive">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}


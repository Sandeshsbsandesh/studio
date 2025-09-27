
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-4">
        <Frown className="w-24 h-24 text-muted-foreground" />
      </div>
      <h1 className="text-6xl font-extrabold font-headline tracking-tighter text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-semibold font-headline">Page Not Found</h2>
      <p className="mt-2 text-lg text-muted-foreground">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go Back to Homepage</Link>
      </Button>
    </div>
  );
}

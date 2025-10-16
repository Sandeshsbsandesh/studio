
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500">
      <div className="mb-6 animate-bounce">
        <Frown className="w-24 h-24 text-primary/60" />
      </div>
      <h1 className="text-7xl font-extrabold font-headline tracking-tighter text-primary mb-2">404</h1>
      <h2 className="mt-2 text-3xl font-bold font-headline text-foreground">Page Not Found</h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-md">
        Oops! The page you're looking for doesn't seem to exist. It might have been moved or deleted.
      </p>
      <div className="flex gap-4 mt-8">
        <Button asChild size="lg">
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/services">Browse Services</Link>
        </Button>
      </div>
    </div>
  );
}

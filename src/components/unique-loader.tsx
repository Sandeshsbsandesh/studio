
'use client';

import { Icons } from './icons';

export default function UniqueLoader() {
  return (
    <div className="relative w-48 h-12 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2">
        <div className="absolute h-full bg-primary animate-loader-progress" />
      </div>
      <Icons.truck className="absolute top-0 h-12 w-12 text-primary animate-truck-move" />
    </div>
  );
}

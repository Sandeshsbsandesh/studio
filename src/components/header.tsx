
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
             <Link href="/" className="hidden md:flex items-center space-x-2 font-bold">
                <Image src="/logo.png" alt="UrbanEzii Logo" width={32} height={32} />
                <span className="text-lg">UrbanEzii</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

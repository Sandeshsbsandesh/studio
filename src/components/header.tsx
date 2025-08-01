
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, UserCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/ai-assistant', label: 'AI Assistant' },
  { href: '/bookings', label: 'My Bookings' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const updateUserName = () => {
      const name = localStorage.getItem('userName');
      setUserName(name);
    };

    updateUserName();

    window.addEventListener('storage', updateUserName);

    return () => {
      window.removeEventListener('storage', updateUserName);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName(null);
    window.dispatchEvent(new Event('storage')); // Notify other tabs
    toast({
        title: 'Logged Out',
        description: 'We hope to see you back soon!',
    })
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">UrbanEase</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  (pathname === link.href || (link.href.startsWith('/#') && pathname === '/') || (link.href !== '/' && !link.href.startsWith('/#') && pathname.startsWith(link.href)))
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 p-4">
                  <Link href="/" className="flex items-center space-x-2">
                     <span className="font-bold text-xl">UrbanEase</span>
                  </Link>
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
                           (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)))
                            ? 'bg-muted'
                            : ''
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="md:hidden">
             <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl">UrbanEase</span>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">User Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userName ? `Welcome, ${userName}` : 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userName ? (
                <>
                  <DropdownMenuItem asChild><Link href="/login">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/bookings">Bookings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/login">Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild><Link href="/login">Login / Sign Up</Link></DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}


'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <SidebarTrigger />
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

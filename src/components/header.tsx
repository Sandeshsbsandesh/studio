
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle, ChevronLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
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
  
  const showBackButton = pathname !== '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Back</span>
              </Button>
            ) : (
               <SidebarTrigger className="md:hidden" />
            )}
             <Link href="/" className="flex items-center space-x-2 md:hidden">
                <Image 
                  src="/logo final done@3x (1).png" 
                  alt="UrbanEzii Logo" 
                  width={120} 
                  height={30}
                  priority 
                />
            </Link>
          </div>

          <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}

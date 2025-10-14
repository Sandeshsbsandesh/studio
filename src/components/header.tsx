
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setIsLoggedIn(true);
        setUserName(storedName);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Link href="/" className="flex items-center space-x-2 font-bold md:hidden">
              <Image src="/logo.png" alt="UrbanEzii Logo" width={32} height={32} />
              <span className="sm:inline">UrbanEzii</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span>Welcome, {userName}</span>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

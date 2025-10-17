'use client';

import { ReactNode, useEffect } from 'react';
import { Home, Grid3X3, Calendar, User, Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

interface MobileAppLayoutProps {
  children: ReactNode;
}

export default function MobileAppLayout({ children }: MobileAppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    // Redirect to login if not logged in and not already on login page
    if (isLoggedIn === false && pathname !== '/mobile-login') {
      router.push('/mobile-login');
    }
  }, [isLoggedIn, pathname, router]);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/services', icon: Grid3X3, label: 'Services' },
    { href: '/bookings', icon: Calendar, label: 'Bookings' },
    { href: user ? '/profile' : '/login', icon: User, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 pb-20">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo.png" 
                  alt="UrbanEzii" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">UrbanEzii</h1>
                <p className="text-[10px] text-gray-600">Your City, Simplified</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-140px)]">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200/60 shadow-lg z-50">
        <div className="flex items-center justify-around px-2 py-2 safe-bottom">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 min-w-[70px]",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
                <span className={cn(
                  "text-[11px] font-medium",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}


'use client';

import { ReactNode, useEffect } from 'react';
import { Home, Grid3X3, Calendar, User, Bell, Search, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

interface NativeMobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function NativeMobileLayout({ children, title, showBack }: NativeMobileLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    // Prevent default back button behavior
    const handleBackButton = (e: PopStateEvent) => {
      if (pathname === '/') {
        // Exit app if on home
        if ((window as any).Capacitor) {
          (window as any).Capacitor.Plugins.App.exitApp();
        }
      }
    };
    
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [pathname]);

  useEffect(() => {
    if (isLoggedIn === false && pathname !== '/mobile-login') {
      router.push('/mobile-login');
    }
  }, [isLoggedIn, pathname, router]);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/services', icon: Grid3X3, label: 'Services' },
    { href: '/bookings', icon: Calendar, label: 'Bookings' },
    { href: user ? '/profile' : '/mobile-login', icon: User, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar Spacer */}
      <div className="h-safe-top bg-white" />

      {/* Native Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image 
                  src="/logo.png" 
                  alt="UrbanEzii" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-gray-900">UrbanEzii</span>
            </Link>
          )}

          {title && (
            <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-gray-900 text-lg">
              {title}
            </h1>
          )}

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Native Scrolling */}
      <main className="pb-safe-bottom mb-20 overflow-y-auto overscroll-contain">
        {children}
      </main>

      {/* Native Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg pb-safe-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-6 rounded-2xl transition-all duration-200 active:scale-95",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full transition-all",
                  isActive && "bg-blue-50"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 transition-all",
                    isActive && "scale-110"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-all",
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


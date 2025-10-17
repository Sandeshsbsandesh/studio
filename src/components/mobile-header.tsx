'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Bell, 
  MapPin, 
  Menu,
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MobileHeaderProps {
  className?: string;
}

export default function MobileHeader({ className }: MobileHeaderProps) {
  const pathname = usePathname();
  const [location, setLocation] = useState('Bangalore');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/#services', label: 'Services', icon: '🛠️' },
    { href: '/ai-assistant', label: 'AI Assistant', icon: '🤖' },
    { href: '/bookings', label: 'Bookings', icon: '📅' },
  ];

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm ${className}`}>
      {/* Main Header */}
      <div className="px-4 py-3">
        {/* Top Row - Logo and Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UZ</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">UrbanEzii</h1>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">{location}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="w-5 h-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search services, providers..."
            className="pl-10 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around bg-white border-t border-gray-100 px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center space-y-1 px-3 py-2 h-auto ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

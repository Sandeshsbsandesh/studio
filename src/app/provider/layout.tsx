
'use client';

import { Toaster } from '@/components/ui/toaster';
import { Poppins, PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import { LayoutDashboard, User, Briefcase, Book, DollarSign, Star, FileText, Settings, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/context/auth-context';


const fontHeadline = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: ['400', '700'],
});

const fontBody = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700'],
});

const providerNavLinks = [
  { href: '/provider/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/provider/profile', label: 'My Profile', icon: <User /> },
  { href: '/provider/services', label: 'My Services', icon: <Briefcase /> },
  { href: '/provider/bookings', label: 'My Bookings', icon: <Book /> },
  { href: '/provider/earnings', label: 'Earnings', icon: <DollarSign /> },
  { href: '/provider/reviews', label: 'Reviews', icon: <Star /> },
  { href: '/provider/documents', label: 'Documents', icon: <FileText /> },
  { href: '/provider/settings', label: 'Settings', icon: <Settings /> },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userType, logout, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace('/login');
    } else if (userType && userType !== 'provider') {
      router.replace('/');
    }
  }, [userType, isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoggedIn === null || (isLoggedIn && userType !== 'provider')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar side="left" variant="sidebar" collapsible="icon" className="bg-sidebar text-sidebar-foreground">
          <SidebarRail />
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Link href="/provider/dashboard" className="flex items-center gap-2 font-bold">
                <Image src="/logo.png" alt="UrbanEzii Logo" width={32} height={32} />
                <span className="font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  UrbanEzii
                </span>
              </Link>
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-1 flex flex-col">
            <SidebarMenu className="flex-1">
              {providerNavLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <Link href={link.href} className="w-full">
                    <SidebarMenuButton
                      tooltip={link.label}
                      isActive={pathname === link.href}
                      className="w-full"
                    >
                      {link.icon}
                      <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarMenu>
               <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton className="w-full" onClick={handleLogout}>
                        <LogOut />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">Logout</TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className={cn(
            "relative flex min-h-svh flex-1 flex-col bg-slate-50 peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=sidebar]:ml-[var(--sidebar-width-icon)] md:peer-data-[state=expanded]:peer-data-[variant=sidebar]:ml-[var(--sidebar-width)] transition-[margin-left] duration-300 ease-in-out",
            fontHeadline.variable,
            fontBody.variable
        )}>
          {children}
        </main>
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  );
}

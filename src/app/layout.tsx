'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, LayoutGrid, Info, Star, DollarSign, HelpCircle, FileText, Phone, UserPlus } from 'lucide-react';
import Footer from '@/components/footer';

const navLinks = [
  { href: '/', label: 'Home', icon: <Home /> },
  { href: '/services', label: 'Services', icon: <LayoutGrid /> },
  { href: '/about', label: 'About Us', icon: <Info /> },
  { href: '/features', label: 'Features', icon: <Star /> },
  { href: '/pricing', label: 'Pricing', icon: <DollarSign /> },
  { href: '/faqs', label: 'FAQs', icon: <HelpCircle /> },
  { href: '/blog', label: 'Blog', icon: <FileText /> },
  { href: '/contact', label: 'Contact Us', icon: <Phone /> },
  { href: '/bookings', label: 'My Bookings', icon: <UserPlus /> },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarRail />
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2 font-bold text-sidebar-foreground p-2">
                <Image src="/logo.png" alt="UrbanEzii Logo" width={32} height={32} />
                <span className="text-lg group-data-[collapsible=icon]:hidden">UrbanEzii</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navLinks.map((link) => (
                  <SidebarMenuItem key={link.href}>
                    <Link href={link.href} className="w-full">
                      <SidebarMenuButton
                        tooltip={link.label}
                        isActive={pathname === link.href}
                        className="w-full"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
             <SidebarFooter>
               {/* Footer content can go here if needed */}
             </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 md:p-6">{children}</main>
            <Footer />
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}

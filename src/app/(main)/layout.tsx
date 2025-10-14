
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
  SidebarRail,
} from '@/components/ui/sidebar';
import { House, LayoutGrid, Info, Sparkles, DollarSign, CircleHelp, Newspaper, Phone, BookUser } from 'lucide-react';
import Footer from '@/components/footer';

const navLinks = [
  { href: '/', label: 'Home', icon: <House /> },
  { href: '/#services', label: 'Services', icon: <LayoutGrid /> },
  { href: '/about', label: 'About Us', icon: <Info /> },
  { href: '/features', label: 'Features', icon: <Sparkles /> },
  { href: '/pricing', label: 'Pricing', icon: <DollarSign /> },
  { href: '/faq', label: 'FAQs', icon: <CircleHelp /> },
  { href: '/blog', label: 'Blog', icon: <Newspaper /> },
  { href: '/contact', label: 'Contact Us', icon: <Phone /> },
  { href: '/bookings', label: 'My Bookings', icon: <BookUser /> },
];

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        <SidebarRail />
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="UrbanEzii Logo" width={32} height={32} className="text-sidebar-foreground"/>
            <span className="font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              UrbanEzii
            </span>
            <SidebarTrigger className="md:hidden ml-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} className="w-full">
                  <SidebarMenuButton
                    tooltip={link.label}
                    isActive={pathname === link.href || (link.href.includes('/#') && pathname ==='/')}
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
      </Sidebar>
      <main className="relative flex min-h-svh flex-1 flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </main>
    </SidebarProvider>
  );
}

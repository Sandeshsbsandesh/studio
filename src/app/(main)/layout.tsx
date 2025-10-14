
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
import { House, LayoutGrid, Info, Sparkles, DollarSign, CircleHelp, Newspaper, Phone, BookUser, Bot } from 'lucide-react';
import Footer from '@/components/footer';

const navLinks = [
  { href: '/', label: 'Home', icon: <House /> },
  { href: '/services', label: 'Services', icon: <LayoutGrid /> },
  { href: '/about', label: 'About Us', icon: <Info /> },
  { href: '/features', label: 'Features', icon: <Sparkles /> },
  { href: '/pricing', label: 'Pricing', icon: <DollarSign /> },
  { href: '/faq', label: 'FAQs', icon: <CircleHelp /> },
  { href: '/blog', label: 'Blog', icon: <Newspaper /> },
  { href: '/contact', label: 'Contact Us', icon: <Phone /> },
  { href: '/bookings', label: 'My Bookings', icon: <BookUser /> },
  { href: '/ai-assistant', label: 'AI Assistant', icon: <Bot /> },
];

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarRail />
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Image src="/logo.png" alt="UrbanEzii Logo" width={32} height={32} />
              <span className="font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                UrbanEzii
              </span>
            </Link>
            <SidebarTrigger className="ml-auto" />
          </div>
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
                    <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="relative flex min-h-svh flex-1 flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=sidebar]:ml-[var(--sidebar-width-icon)] md:peer-data-[state=expanded]:peer-data-[variant=sidebar]:ml-[var(--sidebar-width)] transition-[margin-left] duration-300 ease-in-out">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}

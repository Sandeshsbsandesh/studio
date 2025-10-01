
'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Poppins, PT_Sans } from 'next/font/google';
import {
  Bot,
  Home,
  LayoutGrid,
  CalendarCheck2,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const poppins = Poppins({ 
  subsets: ['latin'], 
  variable: '--font-poppins',
  weight: ['400', '600', '700'] 
});

const ptSans = PT_Sans({ 
  subsets: ['latin'], 
  variable: '--font-pt-sans',
  weight: ['400', '700'] 
});

// export const metadata: Metadata = {
//   title: 'Urbanezii',
//   description: 'Discover, book, and manage essential local services in your city.',
// };

const navLinks = [
  { href: '/', label: 'Home', icon: <Home /> },
  { href: '/#services', label: 'Services', icon: <LayoutGrid /> },
  { href: '/ai-assistant', label: 'AI Assistant', icon: <Bot /> },
  { href: '/bookings', label: 'My Bookings', icon: <CalendarCheck2 /> },
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
      <body className={cn('min-h-screen bg-background font-body antialiased', poppins.variable, ptSans.variable)}>
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="icon">
             <SidebarRail />
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hidden md:flex" />
                <Image 
                  src="/logo final done@3x (1).png" 
                  alt="Urbanezii Logo" 
                  width={120} 
                  height={30}
                  priority 
                />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navLinks.map((link) => (
                  <SidebarMenuItem key={link.href}>
                    <Link href={link.href} className="w-full">
                       <SidebarMenuButton 
                        tooltip={link.label}
                        isActive={
                          pathname === link.href || 
                          (link.href.startsWith('/#') && pathname === '/') || 
                          (link.href !== '/' && !link.href.startsWith('/#') && pathname.startsWith(link.href))
                        }
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
               <Footer />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

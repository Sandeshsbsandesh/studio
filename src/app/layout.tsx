
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
import { House, LayoutGrid, Info, Sparkles, IndianRupee, CircleHelp, Newspaper, Phone, BookUser } from 'lucide-react';
import Footer from '@/components/footer';
import { AuthProvider } from '@/context/auth-context';
import PermissionGuard from '@/components/PermissionGuard';

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

const navLinks = [
  { href: '/', label: 'Home', icon: <House /> },
  { href: '/services', label: 'Services', icon: <LayoutGrid /> },
  { href: '/about', label: 'About Us', icon: <Info /> },
  { href: '/features', label: 'Features', icon: <Sparkles /> },
  { href: '/pricing', label: 'Pricing', icon: <IndianRupee /> },
  { href: '/faq', label: 'FAQs', icon: <CircleHelp /> },
  { href: '/blog', label: 'Blog', icon: <Newspaper /> },
  { href: '/contact', label: 'Contact Us', icon: <Phone /> },
  { href: '/bookings', label: 'My Bookings', icon: <BookUser /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Exclude main website layout for these routes
  if (pathname === '/login' || pathname.startsWith('/provider') || pathname.startsWith('/admin')) {
    let pageTitle = 'UrbanEzii';
    if (pathname === '/login') pageTitle = 'UrbanEzii - Login';
    else if (pathname.startsWith('/admin')) pageTitle = 'UrbanEzii - Admin Panel';
    else if (pathname.startsWith('/provider')) pageTitle = 'UrbanEzii - Provider Dashboard';
    
    return (
       <html lang="en" suppressHydrationWarning>
        <head>
          <title>{pageTitle}</title>
          <meta name="description" content="Discover, book, and manage verified professionals for every home need." />
          <link rel="icon" href="/logo.png" type="image/png" />
          <link rel="apple-touch-icon" href="/logo.png" />
        </head>
        <body className={cn('min-h-screen bg-background font-body antialiased', fontHeadline.variable, fontBody.variable)}>
          <AuthProvider>
            {children}
          </AuthProvider>
            <Toaster />
            <SpeedInsights />
        </body>
      </html>
    )
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>UrbanEzii - Find Local Services Near Me | Electrician, Plumber, Cleaning Services Nearby</title>
        <meta name="description" content="UrbanEzii - Find verified electricians, plumbers, cleaning services & more near you in Bangalore. Book trusted local professionals instantly. Same-day service | 500+ verified pros | Rated 4.8+ | Available 24/7 | urbanezii.com" />
        <meta name="keywords" content="UrbanEzii, urbanezii.com, urban ezii, services near me, electrician near me, plumber near me, cleaning services near me, local services, service providers nearby, home services in bangalore, verified professionals, book services online, same day service, emergency electrician, nearby plumber, local handyman, ac repair near me, appliance repair, pest control, carpenter, painter, home maintenance" />
        <meta name="author" content="UrbanEzii Technologies" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="nositelinkssearchbox" />
        <meta name="google-site-verification" content="ADD_YOUR_VERIFICATION_CODE_HERE" />
        <link rel="canonical" href="https://urbanezii.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://urbanezii.com" />
        <meta property="og:title" content="UrbanEzii - Local Home Services Near You | Best Electrician, Plumber & More Nearby" />
        <meta property="og:description" content="Find verified electricians, plumbers, cleaning services & home professionals near you. Book instantly! ⭐ 4.8+ Rated | Same-day service | 500+ verified pros" />
        <meta property="og:image" content="https://urbanezii.com/logo.png" />
        <meta property="og:site_name" content="UrbanEzii - Local Services Platform" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@UrbanEzii" />
        <meta name="twitter:creator" content="@UrbanEzii" />
        <meta name="twitter:title" content="UrbanEzii - Find Services Near Me | Electrician, Plumber Nearby" />
        <meta name="twitter:description" content="Book verified local professionals instantly. Electricians, plumbers, cleaning & more near you in Bangalore." />
        <meta name="twitter:image" content="https://urbanezii.com/logo.png" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', fontHeadline.variable, fontBody.variable)}>
        <AuthProvider>
          <PermissionGuard>
      <SidebarProvider>
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas" className="border-r">
          <SidebarRail />
          <SidebarHeader className="border-b border-sidebar-border py-4 px-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="UrbanEzii Logo" width={32} height={32} className="flex-shrink-0" priority />
              <span className="font-bold text-xl text-sidebar-foreground tracking-tight">
                UrbanEzii
              </span>
            </Link>
          </SidebarHeader>
              <SidebarContent className="px-3 py-4">
                <SidebarMenu className="space-y-1">
                  {navLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <Link href={link.href} className="w-full">
                        <SidebarMenuButton
                          tooltip={link.label}
                          isActive={pathname === link.href}
                          className="w-full justify-start gap-3 px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
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
            <main className="relative flex min-h-svh flex-1 flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=sidebar]:ml-[var(--sidebar-width-icon)] md:peer-data-[state=expanded]:peer-data-[variant=sidebar]:ml-[var(--sidebar-width)] transition-[margin-left] duration-300 ease-in-out">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </main>
          </SidebarProvider>
          </PermissionGuard>
        </AuthProvider>
          <Toaster />
          <SpeedInsights />
      </body>
    </html>
  );
}

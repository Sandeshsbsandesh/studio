
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/components/firebase-client-provider';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

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

export const metadata: Metadata = {
  title: 'UrbanEzii - Your City, Simplified. Find Trusted Local Services.',
  description:
    'UrbanEzii connects skilled professionals with customers. Discover, book, and manage essential local services like plumbers, electricians, and maids. Find trusted professionals for every need in your city.',
  keywords:
    'Urbanezii,urbanezii,UrbanEzii,Urban,urban,new place,local services,near by,near me,Near by,Near me,water can,Electrician,plumber,Plumber,Water,home services,urban services,Bangalore,India,water can delivery,water can delivery near me,best water can delivery,local water can delivery,hire water can delivery,house maids,house maids near me,best house maids,local house maids,hire house maids,electricians,electricians near me,best electricians,local electricians,hire electricians,plumbers,plumbers near me,best plumbers,local plumbers,hire plumbers,doctor on call,doctor on call near me,best doctor on call,local doctor on call,hire doctor on call,cylinder delivery,cylinder delivery near me,best cylinder delivery,local cylinder delivery,hire cylinder delivery,cleaners,cleaners near me,best cleaners,local cleaners,hire cleaners,personal cooks,personal cooks near me,best personal cooks,local personal cooks,hire personal cooks,local buddy,local buddy near me,best local buddy,local local buddy,hire local buddy,shifters & movers,shifters & movers near me,best shifters & movers,local shifters & movers,hire shifters & movers,painters,painters near me,best painters,local painters,hire painters',
  metadataBase: new URL('https://www.urbanezii.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'UrbanEzii - Your City, Simplified. Find Trusted Local Services.',
    description:
      'UrbanEzii connects skilled professionals with customers. Discover, book, and manage essential local services like plumbers, electricians, and maids. Find trusted professionals for every need in your city.',
    siteName: 'UrbanEzii',
    url: 'https://www.urbanezii.com',
    logo: '/logo.png',
  },
  twitter: {
    card: 'summary',
    title: 'UrbanEzii - Your City, Simplified. Find Trusted Local Services.',
    description:
      'UrbanEzii connects skilled professionals with customers. Discover, book, and manage essential local services like plumbers, electricians, and maids. Find trusted professionals for every need in your city.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UrbanEzii',
  alternateName: 'urbanezii.com',
  url: 'https://www.urbanezii.com',
  logo: 'https://www.urbanezii.com/logo.png',
  sameAs: ['https://www.facebook.com/urbanezii', 'https://www.instagram.com/urbanezii'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-7676615394',
    contactType: 'Customer Service',
    areaServed: 'IN',
    availableLanguage: 'en',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', fontHeadline.variable, fontBody.variable)}>
        <FirebaseClientProvider>
            {children}
            <Toaster />
            <SpeedInsights />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

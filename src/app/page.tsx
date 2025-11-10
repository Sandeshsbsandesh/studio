
'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CircleCheckBig, Smartphone } from 'lucide-react';
import ServiceCard from '@/components/service-card';
import { services } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import NativeMobileLayout from '@/components/native-mobile-layout';
import NativeMobileHome from '@/components/native-mobile-home';
import { Capacitor } from '@capacitor/core';

// Helper to safely check if Capacitor is available and running natively
function isCapacitorNative(): boolean {
  try {
    return typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export default function Home() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') {
      setIsLoaded(true);
      hasLoadedRef.current = true;
      return;
    }

    const checkMobile = () => {
      try {
        // Check if running in Capacitor native app - ONLY show mobile UI in native app
        // Use Capacitor.isNativePlatform() instead of window.Capacitor for reliable detection
        const isCapacitor = isCapacitorNative();
        
        // Only treat as mobile if it's actually Capacitor native app
        // Don't use window width or user agent for web browsers
        setIsMobile(isCapacitor);
        setIsLoaded(true);
        hasLoadedRef.current = true;
        
        // Clear timeout if check succeeded
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } catch (error) {
        console.error('Error checking mobile status:', error);
        // Always set loaded even if there's an error
        setIsMobile(false); // Default to web UI on error
        setIsLoaded(true);
        hasLoadedRef.current = true;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    // Fallback timeout - force load after 2 seconds
    timeoutRef.current = setTimeout(() => {
      if (!hasLoadedRef.current) {
        console.warn('Loading timeout - forcing page load');
        setIsLoaded(true);
        hasLoadedRef.current = true;
      }
    }, 2000);

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      checkMobile();
    });
    
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <NativeMobileLayout title="Home">
        <NativeMobileHome />
      </NativeMobileLayout>
    );
  }

  const handleBecomeProvider = () => {
    router.push('/login?as=provider');
  };

  return (
    <div className="flex flex-col flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold leading-tight">
                Find Trusted Local Services. <span className="text-primary">Instantly.</span>
              </h1>
              <p className="mt-4 text-muted-foreground font-body text-lg max-w-lg">
                Welcome to UrbanEzii, your local service bridge. Discover, book, and manage verified professionals for every home need, all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg">
                  <Link href="/services">
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={handleBecomeProvider}>
                   Become a Provider
                </Button>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl aspect-video">
               <Image
                src="/Gemini_Generated_Image_x7q69hx7q69hx7q6.png"
                alt="A collage of various home services like plumbing, cleaning, and electrical work."
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Services</h2>
            <p className="mt-4 text-muted-foreground font-body max-w-2xl mx-auto">From daily necessities to emergency repairs, find trusted professionals for every need.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map(service => (
              <ServiceCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
                href={service.href}
              />
            ))}
          </div>
           <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <p className="font-semibold text-primary font-body">HOW IT WORKS</p>
                <h2 className="text-3xl md:text-4xl font-headline font-bold mt-2">Get Help in 3 Easy Steps</h2>
                <p className="mt-4 text-muted-foreground font-body max-w-2xl mx-auto">Your convenience is our priority. We've simplified the process of finding and booking local experts.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">1</div>
                    <h3 className="text-xl font-headline font-semibold">Search for a Service</h3>
                    <p className="text-muted-foreground mt-2">Browse categories or search for the specific professional you need.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">2</div>
                    <h3 className="text-xl font-headline font-semibold">Book &amp; Schedule</h3>
                    <p className="text-muted-foreground mt-2">Choose a provider, select a service, and pick a convenient time.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">3</div>
                    <h3 className="text-xl font-headline font-semibold">Relax &amp; Get It Done</h3>
                    <p className="text-muted-foreground mt-2">Your verified professional arrives and completes the job. Pay upon completion.</p>
                </div>
            </div>
        </div>
      </section>

       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-card p-8 md:p-12 rounded-lg shadow-lg grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-primary/10 p-3 rounded-full text-primary">
                <Smartphone className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Your City, Simplified. In Your Pocket.</h2>
              <p className="text-muted-foreground font-body text-lg">Get the full UrbanEzii experience on the go. Book services, manage appointments, and connect with professionals faster than ever with our mobile app.</p>
              <Button size="lg" asChild>
                <Link href="#">
                  Download The App
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <Image
                  src={placeholderImages.qrCode.src}
                  alt={placeholderImages.qrCode.alt}
                  width={200}
                  height={200}
                  data-ai-hint={placeholderImages.qrCode['data-ai-hint']}
                  className="rounded-md"
                />
              </div>
              <p className="text-muted-foreground mt-4 text-sm font-body text-center">Scan to download</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg relative aspect-[4/3]">
                <Image
                    src="/skills.png"
                    alt="A group of diverse service professionals smiling and looking at their phones."
                    fill
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Where Skills Meet Opportunity</h2>
              <p className="text-muted-foreground font-body text-lg">Are you a skilled professional looking to grow your business? Join UrbanEzii to connect with thousands of customers in your city, manage bookings seamlessly, and build your online reputation.</p>
              <ul className="space-y-3 font-body">
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-5 w-5 text-primary" />
                  Reach More Customers
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-5 w-5 text-primary" />
                  Easy Booking Management
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-5 w-5 text-primary" />
                  Secure &amp; Timely Payments
                </li>
              </ul>
              <Button size="lg" onClick={handleBecomeProvider}>
                Join as a Provider
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

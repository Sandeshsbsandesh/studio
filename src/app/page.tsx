'use client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ServiceCard from '@/components/service-card';
import { services } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Smartphone, CircleCheckBig } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';

export default function Home() {
  return (
    <div className="flex flex-col">
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="mt-8">
                  <Link href="/#services">
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="mt-8">
                   <Link href="/provider/dashboard">Become a Provider</Link>
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
                data-ai-hint="city services collage"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Services</h2>
            <p className="mt-4 text-muted-foreground font-body max-w-2xl mx-auto">
              From daily necessities to emergency repairs, find trusted professionals for every need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
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
              <Button variant="outline" asChild>
                <Link href="/#services">View All Services</Link>
              </Button>
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="font-semibold text-primary font-body">HOW IT WORKS</p>
            <h2 className="text-3xl md:text-4xl font-headline font-bold mt-2">Get Help in 3 Easy Steps</h2>
            <p className="mt-4 text-muted-foreground font-body max-w-2xl mx-auto">
              Your convenience is our priority. We&#39;ve simplified the process of finding and booking local experts.
            </p>
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
              <p className="text-muted-foreground font-body text-lg">
                Get the full UrbanEzii experience on the go. Book services, manage appointments, and connect with professionals faster than ever with our mobile app.
              </p>
              <Button asChild size="lg">
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
                  className="rounded-md"
                  data-ai-hint={placeholderImages.qrCode['data-ai-hint']}
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
            <div className="space-y-6">
               <Badge>For Service Providers</Badge>
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Where Skills Meet Opportunity</h2>
              <p className="text-muted-foreground font-body text-lg">
                Are you a skilled professional looking to grow your business? Join UrbanEzii to connect with thousands of customers in your city, manage bookings seamlessly, and build your online reputation.
              </p>
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
              <Button asChild size="lg" className="mt-8">
                <Link href="/provider/dashboard">Join as a Provider</Link>
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/provider.png"
                alt="A skilled professional smiling and ready for work."
                width={600}
                height={450}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                data-ai-hint="skilled professional"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

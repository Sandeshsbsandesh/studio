
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/service-card';
import {
  ArrowRight,
  ChevronRight,
  Bot,
} from 'lucide-react';
import { services } from '@/lib/data';
import { generateHeroImage } from '@/ai/flows/generate-hero-image';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    async function getHeroImage() {
      try {
        const result = await generateHeroImage('A vibrant collage of urban services: a friendly plumber fixing a sink, a painter adding a splash of color to a wall, a delivery person with a water can, and a moving truck, all united under a modern city skyline. The overall style should be clean, and inviting, with a soft color palette that matches a professional web application.');
        setHeroImage(result);
      } catch (error) {
        console.error('Error generating hero image:', error);
        // Fallback to a placeholder if image generation fails
        setHeroImage('https://placehold.co/600x400.png');
      }
    }
    getHeroImage();
  }, []);

  return (
    <div className="flex flex-col">
       <section className="w-full py-12 md:py-20 lg:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
           <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold">Your City, Simplified.</h1>
              <p className="mt-4 text-muted-foreground font-body text-lg">
               Welcome to UrbanEase. Discover, book, and manage essential local services all in one place. Your new city life just got a whole lot easier.
              </p>
               <Button asChild size="lg" className="mt-8">
                <Link href="/#services">
                  Browse All Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
             <div className="rounded-lg overflow-hidden shadow-lg">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt="City skyline"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Skeleton className="w-[600px] h-[400px]" />
                )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Friendly service provider"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  data-ai-hint="friendly handyman"
                />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Not Happy With Your Provider?</h2>
              <p className="mt-4 text-muted-foreground font-body text-lg">
                Our smart AI assistant helps you find better alternatives. Based on your location and service ratings, we'll suggest top-rated professionals nearby to ensure you always get the best service.
              </p>
              <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/ai-assistant">
                  Find Alternatives Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

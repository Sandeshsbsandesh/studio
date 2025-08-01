import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/service-card';
import {
  ArrowRight,
  ChevronRight,
  ConciergeBell,
  SprayCan,
  GlassWater,
  Zap,
  Wrench,
  Stethoscope,
  Flame,
  ChefHat,
  Bot,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight text-foreground">
              Your City, Simplified.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground font-body">
              Welcome to UrbanEase. Discover, book, and manage essential local services all in one place. Your new city life just got a whole lot easier.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="#services">
                  Browse Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/ai-assistant">
                  AI Assistant
                  <Bot className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Services</h2>
            <p className="mt-4 text-muted-foreground font-body max-w-2xl mx-auto">
              From daily necessities to emergency repairs, find trusted professionals for every need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="AI Assistant"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-ai-hint="friendly robot assistant"
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

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

const services = [
  {
    icon: <GlassWater className="h-8 w-8" />,
    title: 'Water Can Delivery',
    description: 'Fresh and clean water at your doorstep.',
    href: '#',
  },
  {
    icon: <ConciergeBell className="h-8 w-8" />,
    title: 'House Maids',
    description: 'Reliable help for your daily chores.',
    href: '#',
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Electricians',
    description: 'Certified professionals for any electrical job.',
    href: '#',
  },
  {
    icon: <Wrench className="h-8 w-8" />,
    title: 'Plumbers',
    description: 'Quick solutions for all plumbing issues.',
    href: '#',
  },
  {
    icon: <Stethoscope className="h-8 w-8" />,
    title: 'Doctor on Call',
    description: 'Consult with experienced doctors online.',
    href: '#',
  },
  {
    icon: <Flame className="h-8 w-8" />,
    title: 'Cylinder Delivery',
    description: 'Fast and safe gas cylinder refills.',
    href: '#',
  },
  {
    icon: <SprayCan className="h-8 w-8" />,
    title: 'Cleaners',
    description: 'Professional cleaning for a spotless home.',
    href: '#',
  },
  {
    icon: <ChefHat className="h-8 w-8" />,
    title: 'Personal Cooks',
    description: 'Enjoy delicious, home-cooked meals.',
    href: '#',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-primary/10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight text-foreground">
              Your City, Simplified.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground font-body">
              Welcome to CityAssist. Discover, book, and manage essential local services all in one place. Your new city life just got a whole lot easier.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
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

      <section id="services" className="py-16 md:py-24 bg-background">
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
      
      <section className="py-16 md:py-24 bg-primary/10">
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
              <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
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

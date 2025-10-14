import ServiceCard from '@/components/service-card';
import { services } from '@/lib/data';
import { Bot } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Our Services</h1>
        <p className="mt-4 text-lg text-muted-foreground font-body">
          From daily chores to urgent needs, we've got you covered. Browse our wide range of services designed to make your life easier.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      
       <div className="mt-20 text-center max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-lg">
        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-6">
          <Bot className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold font-headline tracking-tight">Can't Find Your Provider?</h2>
        <p className="mt-4 text-lg text-muted-foreground font-body">
          Let our AI assistant help you find the best alternative service providers in your area based on ratings, distance, and more.
        </p>
        <Link href="/ai-assistant" className="mt-6 inline-block bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors">
          Try the AI Assistant
        </Link>
      </div>
    </div>
  );
}

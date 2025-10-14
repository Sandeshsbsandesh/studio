
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-20 lg:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
             <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                For Service Providers
              </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Where Skills Meet Opportunity</h1>
              <p className="mt-4 text-muted-foreground text-lg">
                Are you a skilled professional looking to grow your business? Join UrbanEzii to connect with thousands of customers in your city, manage bookings seamlessly, and build your online reputation.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Reach More Customers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Easy Booking Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Secure & Timely Payments</span>
                </li>
              </ul>
              <Button asChild size="lg" className="mt-8">
                <Link href="#">Join as a Provider</Link>
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://picsum.photos/seed/provider/600/400"
                alt="Service providers using UrbanEzii"
                width={600}
                height={400}
                className="w-full h-full object-cover"
                data-ai-hint="service providers"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

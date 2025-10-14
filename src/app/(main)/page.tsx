
'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <section className="w-full flex-1 flex items-center">
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
                <Button asChild variant="outline" size="lg">
                   <Link href="/provider/dashboard">Become a Provider</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl p-4 bg-white/50 backdrop-blur-sm border">
              <Image
                src="/Gemini_Generated_Image_x7q69hx7q69hx7q6.png"
                alt="A collage of various home services like plumbing, cleaning, and electrical work."
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-md"
                data-ai-hint="city services collage"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

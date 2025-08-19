
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
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <div className="flex flex-col">
       <section className="w-full py-12 md:py-20 lg:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <Carousel
            opts={{
              loop: true,
            }}
             plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              <CarouselItem>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Your Personal Local Buddy</h2>
                    <p className="mt-4 text-muted-foreground font-body text-lg">
                      Need a helping hand? Our Local Buddy service is here for you. From grocery shopping to picking up food orders, get reliable help whenever you're in need or feeling under the weather.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                      <Link href="/service/local-buddy">
                        Book a Buddy
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                   <div className="rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="https://placehold.co/600x400.png"
                        alt="Local Buddy helping with groceries"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        data-ai-hint="friendly person groceries"
                      />
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                   <div>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Seamless Shifting & Moving</h2>
                    <p className="mt-4 text-muted-foreground font-body text-lg">
                      Relocating? Our professional shifters and movers ensure a safe and hassle-free transition to your new home. From packing to transport, we've got you covered.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                      <Link href="/service/shifters">
                        Get a Quote
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="https://placehold.co/600x400.png"
                        alt="Movers carrying a box"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        data-ai-hint="movers carrying box"
                      />
                  </div>
                </div>
              </CarouselItem>
               <CarouselItem>
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                   <div>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Your City, Simplified.</h2>
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
                      <Image
                        src="https://placehold.co/600x400.png"
                        alt="City skyline"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        data-ai-hint="city skyline"
                      />
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" />
          </Carousel>
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

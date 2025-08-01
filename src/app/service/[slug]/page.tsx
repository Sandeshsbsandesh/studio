import { notFound } from 'next/navigation';
import { services, providers } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar, Clock } from 'lucide-react';

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find(s => s.href === `/service/${params.slug}`);

  if (!service) {
    notFound();
  }

  const serviceProviders = providers[params.slug] || [];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
            <div className="inline-block bg-primary/10 p-4 rounded-full text-primary mb-4">
                {service.icon}
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">{service.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{service.description}</p>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Available Providers</h2>
            {serviceProviders.length > 0 ? (
                serviceProviders.map(provider => (
                    <Card key={provider.id}>
                        <CardHeader>
                            <CardTitle>{provider.name}</CardTitle>
                            <CardDescription className="flex items-center pt-1">
                                <MapPin className="h-4 w-4 mr-2" /> {provider.address}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-400" />
                                <span className="font-semibold text-lg">{provider.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground">({provider.reviews} reviews)</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline">
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule
                            </Button>
                            <Button>Book Now</Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <p>No providers found for this service.</p>
            )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return services.map(service => ({
    slug: service.href.split('/').pop(),
  }));
}

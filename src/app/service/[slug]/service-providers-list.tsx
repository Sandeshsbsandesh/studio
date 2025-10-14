
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar } from 'lucide-react';
import { useState } from 'react';
import BookingModal from '@/components/booking-modal';

interface ServiceProvider {
  id: string; // Changed to string to match Firestore doc id
  name: string;
  address: string;
  rating: number;
  reviews: number;
}

interface ServiceProvidersListProps {
  serviceSlug: string;
  serviceProviders: ServiceProvider[];
}

export default function ServiceProvidersList({ serviceSlug, serviceProviders }: ServiceProvidersListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const handleBooking = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  return (
    <>
      <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Available Providers</h2>
          {serviceProviders.length > 0 ? (
              serviceProviders.map(provider => (
                  <Card key={provider.id} className="transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
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
                          <Button variant="outline" onClick={() => handleBooking(provider)}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule
                          </Button>
                          <Button onClick={() => handleBooking(provider)}>Book Now</Button>
                      </CardFooter>
                  </Card>
              ))
          ) : (
              <Card>
                <CardContent className='pt-6'>
                    <p className='text-center text-muted-foreground'>No providers found for this service at the moment. Please check back later.</p>
                </CardContent>
              </Card>
          )}
      </div>
      {selectedProvider && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          serviceSlug={serviceSlug}
          provider={selectedProvider}
        />
      )}
    </>
  );
}

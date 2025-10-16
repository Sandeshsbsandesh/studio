
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar } from 'lucide-react';
import { useState } from 'react';
import BookingModal from '@/components/booking-modal';

interface ServiceProvider {
  id: string; 
  businessName: string;
  address: string;
  rating: number;
  reviews: number;
  services?: Record<string, Record<string, string>>;
  [key: string]: any; // Allow additional properties
}

interface ServiceProvidersListProps {
  serviceSlug: string;
  serviceProviders: any[]; // Use any[] to preserve all fields from server
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
      <div className="space-y-4">
          {serviceProviders.length > 0 ? (
              serviceProviders.map(provider => (
                  <Card key={provider.id} className="transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary">
                      <CardHeader className="pb-3">
                          <CardTitle className="text-xl font-headline">{provider.businessName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-4 w-4" /> {provider.address}
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                          <div className="flex items-center gap-2">
                              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold text-lg">{provider.rating ? provider.rating.toFixed(1) : '0.0'}</span>
                              <span className="text-sm text-muted-foreground">({provider.reviews || 0} reviews)</span>
                          </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-3 pt-0">
                          <Button variant="outline" size="default" onClick={() => handleBooking(provider)}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule
                          </Button>
                          <Button size="default" onClick={() => handleBooking(provider)}>Book Now</Button>
                      </CardFooter>
                  </Card>
              ))
          ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                    <p className="text-muted-foreground">No providers found for this service at the moment. Please check back later.</p>
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

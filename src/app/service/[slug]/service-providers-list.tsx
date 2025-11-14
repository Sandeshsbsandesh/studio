
'use client';

import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Navigation, Star } from 'lucide-react';
import BookingModal from '@/components/booking-modal';
import { getDistanceMatrix, DistanceMatrixDestination, DistanceMatrixValue } from '@/lib/maps/distanceMatrix';

interface ServiceProvider {
  id: string;
  businessName: string;
  address: string;
  rating: number;
  reviews: number;
  latitude?: number | null;
  longitude?: number | null;
  services?: Record<string, Record<string, string>>;
  [key: string]: any;
}

interface ServiceProvidersListProps {
  serviceSlug: string;
  serviceProviders: ServiceProvider[];
}

type LocationStatus = 'idle' | 'prompting' | 'granted' | 'denied' | 'unavailable';

type DistanceMap = Record<string, DistanceMatrixValue>;

export default function ServiceProvidersList({ serviceSlug, serviceProviders }: ServiceProvidersListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [distanceMap, setDistanceMap] = useState<DistanceMap>({});
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [isLoadingDistances, setIsLoadingDistances] = useState(false);

  const providersWithCoordinates = useMemo(() => {
    return serviceProviders.filter((provider) =>
      typeof provider.latitude === 'number' && typeof provider.longitude === 'number'
    );
  }, [serviceProviders]);

  // Disabled location detection (not needed without distance feature)
  // useEffect(() => {
  //   if (locationStatus !== 'idle') {
  //     return;
  //   }

  //   if (typeof window === 'undefined' || !('geolocation' in navigator)) {
  //     setLocationStatus('unavailable');
  //     return;
  //   }

  //   setLocationStatus('prompting');

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
  //       setLocationStatus('granted');
  //     },
  //     (error) => {
  //       console.warn('User denied geolocation access:', error);
  //       setLocationStatus('denied');
  //     },
  //     {
  //       enableHighAccuracy: false,
  //       timeout: 10000,
  //       maximumAge: 5 * 60 * 1000,
  //     }
  //   );
  // }, [locationStatus]);

  // Disabled distance calculation to avoid CORS errors
  // useEffect(() => {
  //   if (!userLocation || providersWithCoordinates.length === 0) {
  //     return;
  //   }

  //   let cancelled = false;

  //   async function fetchDistances() {
  //     setIsLoadingDistances(true);
  //     setDistanceError(null);

  //     const destinations: DistanceMatrixDestination[] = providersWithCoordinates.map((provider) => ({
  //       id: provider.id,
  //       lat: provider.latitude as number,
  //       lng: provider.longitude as number,
  //     }));

  //     try {
  //       const results = await getDistanceMatrix(userLocation, destinations);

  //       if (!cancelled) {
  //         setDistanceMap(results);
  //       }
  //     } catch (error) {
  //       if (!cancelled) {
  //         const message = error instanceof Error ? error.message : 'Failed to calculate provider distances.';
  //         setDistanceError(message);
  //         setDistanceMap({});
  //       }
  //     } finally {
  //       if (!cancelled) {
  //         setIsLoadingDistances(false);
  //       }
  //     }
  //   }

  //   fetchDistances();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [userLocation, providersWithCoordinates]);

  const handleBooking = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  const renderLocationBanner = () => {
    // Distance feature disabled - no banner needed
    return null;
  };

  return (
    <>
      <div className="space-y-4">
        {renderLocationBanner()}

        {serviceProviders.length > 0 ? (
          serviceProviders.map((provider) => {
            const distance = distanceMap[provider.id];

            return (
              <Card key={provider.id} className="transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-headline">{provider.businessName}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {provider.address}
                  </CardDescription>
                  {isLoadingDistances && !distance && locationStatus === 'granted' && (
                    <p className="mt-2 text-sm text-muted-foreground">Calculating distance…</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-lg">{provider.rating ? provider.rating.toFixed(1) : '0.0'}</span>
                    <span className="text-sm text-muted-foreground">({provider.reviews || 0} reviews)</span>
                  </div>

                  {distance && (
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-4 w-4" />
                        <span>{distance.distanceText || `${(distance.distanceValue / 1000).toFixed(1)} km`} away</span>
                      </span>
                      {distance.durationText && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{distance.durationText}</span>
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-3 pt-0">
                  <Button variant="outline" size="default" onClick={() => handleBooking(provider)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button size="default" onClick={() => handleBooking(provider)}>Book Now</Button>
                </CardFooter>
              </Card>
            );
          })
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

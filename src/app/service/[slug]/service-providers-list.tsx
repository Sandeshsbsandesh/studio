
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Navigation, Star, LogIn, IndianRupee, Shield, CheckCircle2 } from 'lucide-react';
import BookingModal from '@/components/booking-modal';
import { getDistanceMatrix, DistanceMatrixDestination, DistanceMatrixValue } from '@/lib/maps/distanceMatrix';
import { useAuth } from '@/context/auth-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const router = useRouter();
  const { isLoggedIn, userType } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [distanceMap, setDistanceMap] = useState<DistanceMap>({});
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [isLoadingDistances, setIsLoadingDistances] = useState(false);

  // Helper function to format slug to category name
  const formatSlugToCategory = (slug: string) => {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get the service category from slug
  const serviceCategory = formatSlugToCategory(serviceSlug);

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
    // Check if user is logged in (isLoggedIn can be null, false, or true)
    if (isLoggedIn !== true) {
      setShowLoginAlert(true);
      return;
    }

    // Check if user is a customer (not a provider)
    if (userType === 'provider') {
      alert('Providers cannot book services. Please login as a customer.');
      return;
    }

    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  const handleLoginRedirect = () => {
    // Save current URL to redirect back after login
    const currentUrl = window.location.pathname;
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
    router.push('/login?as=customer');
  };

  const handleSignupRedirect = () => {
    // Save current URL to redirect back after signup
    const currentUrl = window.location.pathname;
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
    router.push('/login?as=customer');
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
                <CardContent className="space-y-4 pb-4">
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-lg">{provider.rating ? provider.rating.toFixed(1) : '0.0'}</span>
                    <span className="text-sm text-muted-foreground">({provider.reviews || 0} reviews)</span>
                    {provider.verified && (
                      <Badge variant="secondary" className="ml-2 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Distance Info */}
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

                  {/* Pricing Information - CRITICAL NEW FEATURE */}
                  {provider.services && provider.services[serviceCategory] && (
                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">Services & Pricing:</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(provider.services[serviceCategory])
                          .slice(0, 3) // Show first 3 services
                          .map(([serviceName, price]) => {
                            // Clean price: remove any existing currency symbols (₱, ₹, £, $, etc.)
                            const cleanPrice = String(price).replace(/[₱₹£$€¥]/g, '').trim();
                            return (
                              <div key={serviceName} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{serviceName}</span>
                                <span className="font-semibold text-primary">₹{cleanPrice}</span>
                              </div>
                            );
                          })}
                        {Object.keys(provider.services[serviceCategory]).length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{Object.keys(provider.services[serviceCategory]).length - 3} more services
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* If no pricing data available */}
                  {(!provider.services || !provider.services[serviceCategory]) && (
                    <div className="border-t pt-3">
                      <p className="text-sm text-muted-foreground">
                        <IndianRupee className="h-4 w-4 inline mr-1" />
                        Contact provider for pricing details
                      </p>
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
      
      {/* Login Alert Dialog */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Login Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You need to be logged in to book services. Please login or create a new account to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setShowLoginAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <Button 
              variant="outline" 
              onClick={handleSignupRedirect}
              className="w-full sm:w-auto"
            >
              Sign Up
            </Button>
            <AlertDialogAction onClick={handleLoginRedirect} className="w-full sm:w-auto">
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

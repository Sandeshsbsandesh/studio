'use client';

import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDirections } from '@/lib/maps/directions';
import { useJsApiLoader, GoogleMap, Marker, Polyline } from '@react-google-maps/api';

type LatLng = {
  lat: number;
  lng: number;
};

interface LiveMapProps {
  bookingId: string;
  customerLocation: LatLng | null;
  providerLocation: (LatLng & { updatedAt?: string | number | Date; isActive?: boolean }) | null;
  height?: number;
  showRoute?: boolean;
}

interface RouteSummary {
  polyline?: string;
  distanceText?: string;
  durationText?: string;
}

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
} as const;

const MAP_OPTIONS = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: true,
} as const;

function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let b;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += deltaLat;

    result = 0;
    shift = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += deltaLng;

    points.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }

  return points;
}

export default function LiveMap({
  bookingId,
  customerLocation,
  providerLocation,
  height = 260,
  showRoute = true,
}: LiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader(
    useMemo(
      () => ({
        googleMapsApiKey: apiKey ?? '',
      }),
      [apiKey]
    )
  );

  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);

  const center = useMemo<LatLng>(() => {
    if (providerLocation) {
      return { lat: providerLocation.lat, lng: providerLocation.lng };
    }

    if (customerLocation) {
      return { lat: customerLocation.lat, lng: customerLocation.lng };
    }

    return { lat: 0, lng: 0 };
  }, [customerLocation, providerLocation]);

  useEffect(() => {
    if (!showRoute || !customerLocation || !providerLocation || !isLoaded) {
      setRouteSummary(null);
      return;
    }

    let cancelled = false;

    async function fetchRoute() {
      try {
        const summary = await getDirections({
          origin: providerLocation,
          destination: customerLocation,
          mode: 'driving',
        });

        if (!cancelled) {
          setRouteSummary(summary);
        }
      } catch (error) {
        console.warn('Directions API unavailable (CORS), showing markers only:', error);
        if (!cancelled) {
          setRouteSummary(null);
        }
      }
    }

    fetchRoute();

    return () => {
      cancelled = true;
    };
  }, [customerLocation, providerLocation, showRoute, isLoaded]);

  if (!apiKey) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the live map preview.
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-destructive">
          We could not load the map right now. Please refresh to try again.
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="w-full" style={{ height }} />;
  }

  const providerUpdatedAt = providerLocation?.updatedAt
    ? new Date(providerLocation.updatedAt).toLocaleTimeString()
    : null;

  const polylinePath = routeSummary?.polyline ? decodePolyline(routeSummary.polyline) : null;

  return (
    <div className="space-y-0 overflow-hidden rounded-lg border">
      {/* Status Banner - Zomato/Swiggy style */}
      {providerLocation && providerLocation.isActive && routeSummary?.durationText && (
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold">{routeSummary.durationText}</div>
              <div className="text-sm opacity-90">• On the way</div>
            </div>
            <div className="text-sm opacity-90">{routeSummary.distanceText}</div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={{ height }}>
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={center}
          zoom={providerLocation ? 13 : 11}
          options={MAP_OPTIONS}
        >
          {customerLocation && (
            <Marker 
              position={customerLocation} 
              label={{ 
                text: '🏠',
                fontSize: '24px',
              }}
            />
          )}
          {providerLocation && (
            <Marker 
              position={providerLocation}
              label={{
                text: '🚗',
                fontSize: '24px',
              }}
            />
          )}
          {polylinePath && (
            <Polyline
              path={polylinePath}
              options={{
                strokeColor: '#3b82f6',
                strokeOpacity: 0.9,
                strokeWeight: 5,
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Status Footer */}
      <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        {providerLocation ? (
          <div className="flex items-center justify-between">
            <span>
              Provider last updated {providerUpdatedAt ? `at ${providerUpdatedAt}` : 'recently'}
            </span>
            {!providerLocation.isActive && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">Journey ended</span>
            )}
          </div>
        ) : (
          <div className="text-center py-1">Waiting for provider to start journey...</div>
        )}
      </div>
    </div>
  );
}



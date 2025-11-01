'use client';

import NavigateButton from '@/components/NavigateButton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useLiveLocation } from '@/hooks/useLiveLocation';
import { MapPin, Radio } from 'lucide-react';

interface LiveTrackingProps {
  bookingId: string;
  customerLocation: { lat: number; lng: number } | null;
  className?: string;
}

export default function LiveTracking({ bookingId, customerLocation, className }: LiveTrackingProps) {
  const { isTracking, permissionStatus, lastLocation, error, startTracking, stopTracking } = useLiveLocation(bookingId, {
    intervalMs: 20_000,
    enableHighAccuracy: true,
  });

  const renderStatusBadge = () => {
    switch (permissionStatus) {
      case 'granted':
        return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Sharing enabled</span>;
      case 'denied':
        return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">Location denied</span>;
      case 'unavailable':
        return <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">Not supported</span>;
      default:
        return <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Awaiting permission</span>;
    }
  };

  return (
    <div className={cn('rounded-lg border bg-background p-4 shadow-sm', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Radio className="h-4 w-4 text-primary" /> Live Journey Tracking
          </div>
          <p className="text-xs text-muted-foreground">Share your location every few seconds so the customer can follow your journey.</p>
        </div>
        <div className="flex items-center gap-2">
          {renderStatusBadge()}
          <Button
            size="sm"
            variant={isTracking ? 'destructive' : 'default'}
            onClick={isTracking ? stopTracking : startTracking}
          >
            {isTracking ? 'Stop Sharing' : 'Start Journey'}
          </Button>
        </div>
      </div>

      {lastLocation && (
        <div className="mt-3 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              Last update at {new Date(lastLocation.timestamp).toLocaleTimeString()} — {lastLocation.lat.toFixed(4)}, {lastLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertTitle>Location update issue</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          {customerLocation
            ? 'Tip: Keep your device unlocked and the app in the foreground for best accuracy.'
            : 'Customer location not available yet. We will enable navigation once coordinates are ready.'}
        </div>
        <NavigateButton
          destination={customerLocation}
          variant="outline"
          size="sm"
          label="Open in Google Maps"
          disabled={!customerLocation}
        />
      </div>
    </div>
  );
}



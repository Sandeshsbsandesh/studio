'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { db } from '@/lib/firebase';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';

export interface LiveLocationOptions {
  intervalMs?: number;
  enableHighAccuracy?: boolean;
}

export interface LiveLocationState {
  isTracking: boolean;
  permissionStatus: 'unknown' | 'granted' | 'denied' | 'unavailable';
  lastLocation: {
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp: number;
  } | null;
  error: string | null;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
}

function hasGeolocationSupport() {
  return typeof window !== 'undefined' && 'geolocation' in navigator;
}

export function useLiveLocation(bookingId: string | null, options: LiveLocationOptions = {}): LiveLocationState {
  const intervalMs = options.intervalMs ?? 15_000;
  const enableHighAccuracy = options.enableHighAccuracy ?? true;

  const [isTracking, setIsTracking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<LiveLocationState['permissionStatus']>('unknown');
  const [lastLocation, setLastLocation] = useState<LiveLocationState['lastLocation']>(null);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const lastSyncRef = useRef<number>(0);

  const syncLocationWithFirestore = useCallback(
    async (location: { lat: number; lng: number } | null, isActive: boolean) => {
      if (!bookingId) {
        return;
      }

      const bookingRef = doc(db, 'bookings', bookingId);

      if (location) {
        await updateDoc(bookingRef, {
          providerLiveLocation: {
            lat: location.lat,
            lng: location.lng,
            updatedAt: serverTimestamp(),
            isActive,
          },
        });
      } else {
        await updateDoc(bookingRef, {
          providerLiveLocation: null,
        });
      }
    },
    [bookingId]
  );

  const stopWatcher = useCallback(() => {
    if (watchIdRef.current !== null && hasGeolocationSupport()) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const stopTracking = useCallback(async () => {
    stopWatcher();
    setIsTracking(false);

    if (bookingId) {
      try {
        const locationPayload = lastLocation
          ? { lat: lastLocation.lat, lng: lastLocation.lng }
          : null;

        await syncLocationWithFirestore(locationPayload, false);
      } catch (syncError) {
        console.error('Failed to sync final location:', syncError);
      }
    }
  }, [bookingId, lastLocation, stopWatcher, syncLocationWithFirestore]);

  const startTracking = useCallback(async () => {
    if (!bookingId) {
      setError('No booking selected for live tracking.');
      return;
    }

    if (!hasGeolocationSupport()) {
      setPermissionStatus('unavailable');
      setError('Geolocation is not supported on this device.');
      return;
    }

    setError(null);

    const requestPosition = () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy,
          timeout: 15_000,
          maximumAge: 5_000,
        });
      });

    try {
      const initialPosition = await requestPosition();
      const { latitude, longitude, accuracy } = initialPosition.coords;

      setPermissionStatus('granted');
      setLastLocation({
        lat: latitude,
        lng: longitude,
        accuracy: accuracy ?? undefined,
        timestamp: Date.now(),
      });
      setIsTracking(true);
      await syncLocationWithFirestore({ lat: latitude, lng: longitude }, true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude: lat, longitude: lng, accuracy: acc } = position.coords;
          const timestamp = Date.now();

          setLastLocation({ lat, lng, accuracy: acc ?? undefined, timestamp });

          if (timestamp - lastSyncRef.current >= intervalMs) {
            lastSyncRef.current = timestamp;

            try {
              await syncLocationWithFirestore({ lat, lng }, true);
            } catch (syncError) {
              console.error('Failed to sync live location:', syncError);
              setError('We could not update your live location. Check your network connection.');
            }
          }
        },
        (geoError) => {
          console.error('Live location error:', geoError);
          setError(geoError.message ?? 'Unable to track location.');

          if (geoError.code === geoError.PERMISSION_DENIED) {
            setPermissionStatus('denied');
          }
        },
        {
          enableHighAccuracy,
          timeout: 20_000,
          maximumAge: 5_000,
        }
      );
    } catch (geoError: any) {
      console.error('Failed to obtain initial location:', geoError);
      setPermissionStatus('denied');
      setError(geoError?.message ?? 'Location permission denied.');
      setIsTracking(false);
    }
  }, [bookingId, enableHighAccuracy, intervalMs, syncLocationWithFirestore]);

  useEffect(() => {
    return () => {
      stopWatcher();
    };
  }, [stopWatcher]);

  return {
    isTracking,
    permissionStatus,
    lastLocation,
    error,
    startTracking,
    stopTracking,
  };
}



'use client';

import { useCallback } from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Navigation } from 'lucide-react';

interface NavigateButtonProps extends Pick<ButtonProps, 'variant' | 'size' | 'className'> {
  destination: {
    lat: number;
    lng: number;
  } | null;
  label?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    Capacitor?: {
      App?: {
        openUrl: (options: { url: string }) => Promise<void>;
      };
    };
  }
}

export function buildNavigationUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default function NavigateButton({
  destination,
  label = 'Navigate',
  variant = 'default',
  size = 'default',
  disabled,
  className,
}: NavigateButtonProps) {
  const handlePress = useCallback(async () => {
    if (!destination) {
      console.warn('Cannot open navigation without destination coordinates.');
      return;
    }

    const url = buildNavigationUrl(destination.lat, destination.lng);

    try {
      if (typeof window !== 'undefined') {
        if (window.Capacitor?.App?.openUrl) {
          await window.Capacitor.App.openUrl({ url });
          return;
        }

        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
    } catch (error) {
      console.error('Failed to open navigation URL', error);
    }

    // Server-side or unsupported environment: log the URL so it can be handled externally.
    console.log('Navigation URL:', url);
  }, [destination]);

  return (
    <Button
      onClick={handlePress}
      variant={variant}
      size={size}
      disabled={!destination || disabled}
      className={className}
    >
      <Navigation className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}



'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, MapPin, Shield } from 'lucide-react';
import { requestAllPermissions, hasNotificationPermission, hasLocationPermission } from '@/lib/permissions';

// Helper to safely check if Capacitor is available
function isCapacitorAvailable(): boolean {
  try {
    return typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

interface PermissionGuardProps {
  children: React.ReactNode;
}

export default function PermissionGuard({ children }: PermissionGuardProps) {
  const [loading, setLoading] = useState(true);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('Permission check timeout - forcing load');
      setLoading(false);
    }, 2000);

    try {
      // Check if Capacitor is available and if we're on native platform
      const isNative = isCapacitorAvailable();

      // Only check on native mobile, skip on web
      if (!isNative) {
        clearTimeout(timeoutId);
        setLoading(false);
        return;
      }

      // Set a shorter timeout for permission checks
      const permissionTimeout = setTimeout(() => {
        console.warn('Permission checks timed out');
        setLoading(false);
      }, 1500);

      const [notifications, location] = await Promise.all([
        hasNotificationPermission().catch(() => false),
        hasLocationPermission().catch(() => false),
      ]);

      clearTimeout(permissionTimeout);
      clearTimeout(timeoutId);

      setHasNotifications(notifications);
      setHasLocation(location);

      // Show prompt if any permission is missing
      if (!notifications || !location) {
        setShowPrompt(true);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking permissions:', error);
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  async function handleRequestPermissions() {
    const result = await requestAllPermissions();
    
    setHasNotifications(result.notifications);
    setHasLocation(result.location);

    // Hide prompt after requesting (user can re-enable in settings if denied)
    setShowPrompt(false);
  }

  function handleSkip() {
    setShowPrompt(false);
  }

  // Show loading while checking
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show permission prompt on mobile if needed
  if (showPrompt && isCapacitorAvailable()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Enable Permissions</CardTitle>
            <CardDescription>
              To provide the best experience, UrbanEzii needs access to:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${hasNotifications ? 'bg-green-100' : 'bg-amber-100'}`}>
                  <Bell className={`h-5 w-5 ${hasNotifications ? 'text-green-600' : 'text-amber-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Get updates about your bookings and provider arrival
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${hasLocation ? 'bg-green-100' : 'bg-amber-100'}`}>
                  <MapPin className={`h-5 w-5 ${hasLocation ? 'text-green-600' : 'text-amber-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Find nearby providers and enable live tracking
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleRequestPermissions} 
                className="w-full"
                size="lg"
              >
                Enable Permissions
              </Button>
              <Button 
                onClick={handleSkip} 
                variant="ghost" 
                className="w-full"
              >
                Skip for now
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              You can change these settings anytime in your device settings
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All good, render the app
  return <>{children}</>;
}


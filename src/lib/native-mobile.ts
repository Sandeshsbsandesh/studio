// Native mobile features for UrbanEzii app

import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { App } from '@capacitor/app';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export class NativeMobileService {
  private static instance: NativeMobileService;
  
  private constructor() {}
  
  static getInstance(): NativeMobileService {
    if (!NativeMobileService.instance) {
      NativeMobileService.instance = new NativeMobileService();
    }
    return NativeMobileService.instance;
  }

  // Check if running in native app
  isNativeApp(): boolean {
    return Capacitor.isNativePlatform();
  }

  // Request location permission and get current position
  async getCurrentLocation(): Promise<LocationData | null> {
    if (!this.isNativeApp()) {
      // Fallback to web geolocation for web browsers
      return this.getWebLocation();
    }

    try {
      // Check permissions first
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location !== 'granted') {
        // Request permission
        const requestResult = await Geolocation.requestPermissions();
        
        if (requestResult.location !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      // Get current position
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      });

      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  // Fallback for web browsers
  private async getWebLocation(): Promise<LocationData | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Web geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }

  // Handle back button press
  setupBackButtonHandler(): void {
    if (!this.isNativeApp()) return;

    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        // Navigate back in the web view
        window.history.back();
      } else {
        // If can't go back, exit app
        App.exitApp();
      }
    });
  }

  // Handle app state changes
  setupAppStateHandlers(): void {
    if (!this.isNativeApp()) return;

    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
      
      if (isActive) {
        // App became active - you can refresh data here
        document.body.classList.remove('app-background');
      } else {
        // App went to background
        document.body.classList.add('app-background');
      }
    });

    App.addListener('pause', () => {
      console.log('App paused');
      document.body.classList.add('app-paused');
    });

    App.addListener('resume', () => {
      console.log('App resumed');
      document.body.classList.remove('app-paused');
    });
  }

  // Initialize all native features
  initialize(): void {
    this.setupBackButtonHandler();
    this.setupAppStateHandlers();
  }
}

// Convenience function for getting location
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  const service = NativeMobileService.getInstance();
  return service.getCurrentLocation();
};

// Convenience function for checking if native app
export const isNativeApp = (): boolean => {
  const service = NativeMobileService.getInstance();
  return service.isNativeApp();
};

// Initialize native features
export const initializeNativeFeatures = (): void => {
  const service = NativeMobileService.getInstance();
  service.initialize();
};

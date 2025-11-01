'use client';

import { Capacitor } from '@capacitor/core';

/**
 * Request notification permission
 * - On web: uses browser Notification API
 * - On mobile: uses Capacitor Push Notifications plugin
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    // Mobile: Request via Capacitor
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');
      
      const result = await PushNotifications.requestPermissions();
      
      if (result.receive === 'granted') {
        await PushNotifications.register();
        console.log('✅ Push notifications enabled');
        return true;
      } else {
        console.warn('❌ Push notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to request push notifications:', error);
      return false;
    }
  } else {
    // Web: Use browser Notification API
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
}

/**
 * Request location permission
 * - On web: uses browser geolocation
 * - On mobile: uses Capacitor Geolocation plugin
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    // Mobile: Request via Capacitor
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      
      const permission = await Geolocation.requestPermissions();
      
      if (permission.location === 'granted' || permission.coarseLocation === 'granted') {
        console.log('✅ Location permission granted');
        return true;
      } else {
        console.warn('❌ Location permission denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return false;
    }
  } else {
    // Web: Use browser geolocation
    if (!('geolocation' in navigator)) {
      console.warn('Browser does not support geolocation');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000 }
      );
    });
  }
}

/**
 * Check if notification permission is granted
 */
export async function hasNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');
      const result = await PushNotifications.checkPermissions();
      return result.receive === 'granted';
    } catch {
      return false;
    }
  } else {
    return 'Notification' in window && Notification.permission === 'granted';
  }
}

/**
 * Check if location permission is granted
 */
export async function hasLocationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      const permission = await Geolocation.checkPermissions();
      return permission.location === 'granted' || permission.coarseLocation === 'granted';
    } catch {
      return false;
    }
  } else {
    return 'geolocation' in navigator;
  }
}

/**
 * Request all necessary permissions for the app
 */
export async function requestAllPermissions(): Promise<{
  notifications: boolean;
  location: boolean;
}> {
  const [notifications, location] = await Promise.all([
    requestNotificationPermission(),
    requestLocationPermission(),
  ]);

  return { notifications, location };
}


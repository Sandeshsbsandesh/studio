'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getGeocodeFromAddress } from '@/lib/maps/geocode';

export interface BookingData {
  providerId: string;
  providerName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  serviceType: string;
  date: Date;
  timeSlot: string;
  address: string;
  phone: string;
  notes?: string;
  amount?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customerLocation?: {
    lat: number;
    lng: number;
    formattedAddress?: string | null;
    placeId?: string | null;
  } | null;
}

export async function createBooking(data: BookingData) {
  try {
    let resolvedLocation = data.customerLocation ?? null;

    if (!resolvedLocation) {
      const geocodeResult = await getGeocodeFromAddress(data.address);

      if (geocodeResult) {
        resolvedLocation = {
          lat: geocodeResult.lat,
          lng: geocodeResult.lng,
          formattedAddress: geocodeResult.formattedAddress ?? data.address,
          placeId: geocodeResult.placeId ?? null,
        };
      }
    }

    const bookingPayload = {
      ...data,
      customerLocation: resolvedLocation
        ? {
            lat: resolvedLocation.lat,
            lng: resolvedLocation.lng,
            formattedAddress: resolvedLocation.formattedAddress ?? data.address,
            placeId: resolvedLocation.placeId ?? null,
          }
        : null,
      providerLiveLocation: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const bookingRef = await addDoc(collection(db, 'bookings'), bookingPayload);

    return {
      success: true,
      bookingId: bookingRef.id,
      message: 'Booking created successfully!',
    };
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      error: error.message || 'Failed to create booking',
    };
  }
}

export async function updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') {
  try {
    const { updateDoc, doc } = await import('firebase/firestore');
    const bookingRef = doc(db, 'bookings', bookingId);
    
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Booking ${status} successfully!`,
    };
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return {
      success: false,
      error: error.message || 'Failed to update booking',
    };
  }
}


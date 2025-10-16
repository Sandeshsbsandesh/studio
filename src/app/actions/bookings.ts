'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
}

export async function createBooking(data: BookingData) {
  try {
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

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


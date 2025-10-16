'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// Get provider services
export async function getProviderServices(providerId: string) {
  try {
    const providerDoc = await getDoc(doc(db, 'providers', providerId));
    if (providerDoc.exists()) {
      const data = providerDoc.data();
      return { success: true, services: data.services || [] };
    }
    return { success: true, services: [] };
  } catch (error: any) {
    console.error('Error loading services:', error);
    return { success: false, error: error.message };
  }
}

// Update provider services
export async function updateProviderServices(providerId: string, services: any[]) {
  try {
    const serviceCategories = services.map(s => s.category);
    await updateDoc(doc(db, 'providers', providerId), {
      services: services,
      serviceCategories: serviceCategories,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error saving services:', error);
    return { success: false, error: error.message };
  }
}

// Get provider profile
export async function getProviderProfile(providerId: string) {
  try {
    const providerDoc = await getDoc(doc(db, 'providers', providerId));
    if (providerDoc.exists()) {
      const data = providerDoc.data();
      return { 
        success: true, 
        profile: {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          businessName: data.businessName || '',
          businessType: data.businessType || '',
          city: data.city || '',
          address: data.address || '',
          businessDescription: data.businessDescription || '',
          experience: data.experience || '',
          specialization: data.specialization || '',
          availability: data.availability || [],
          workingHours: data.workingHours || { start: '', end: '' },
          priceRange: data.priceRange || '',
          rating: data.rating || 0,
          totalRatings: data.totalRatings || 0,
          reviews: data.reviews || 0,
          totalBookings: data.totalBookings || 0,
          completedJobs: data.completedJobs || 0,
          monthlyEarnings: data.monthlyEarnings || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
        }
      };
    }
    return { success: false, error: 'Profile not found' };
  } catch (error: any) {
    console.error('Error loading profile:', error);
    return { success: false, error: error.message };
  }
}

// Update provider profile
export async function updateProviderProfile(providerId: string, updates: any) {
  try {
    await updateDoc(doc(db, 'providers', providerId), updates);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
}

// Get provider bookings
export async function getProviderBookings(providerId: string) {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        customerName: data.customerName || 'Customer',
        customerPhone: data.customerPhone,
        serviceType: data.serviceType,
        date: data.date?.toDate() || new Date(),
        timeSlot: data.timeSlot,
        address: data.address,
        phone: data.phone,
        notes: data.notes,
        amount: data.amount || 0,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    
    return { success: true, bookings };
  } catch (error: any) {
    console.error('Error loading bookings:', error);
    return { success: false, error: error.message, bookings: [] };
  }
}

// Update booking status
export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: status,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return { success: false, error: error.message };
  }
}


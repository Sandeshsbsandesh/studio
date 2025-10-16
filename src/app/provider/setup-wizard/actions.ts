'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ProviderProfileData {
  // Step 1: Business Information
  companyLogo?: string;
  companyName: string;
  businessType: 'individual' | 'firm' | 'company';
  city: string;
  address?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  businessDescription: string;
  
  // Step 2: Service Details
  services: Array<{
    category: string;
    subcategories: Array<{
      name: string;
      price: number;
    }>;
  }>;
  experience: string;
  specialization?: string;
  
  // Step 3: Availability & Pricing
  availability: string[];
  workingHours: {
    start: string;
    end: string;
  };
  priceRange: string;
  
  // Step 4: Documents
  idProof?: string;
  addressProof?: string;
  certifications?: string;
  bankDetails?: string;
  termsAccepted: boolean;
}

interface ActionResult {
  success: boolean;
  error?: string;
  providerId?: string;
}

export async function saveProviderProfile(
  userId: string,
  email: string,
  name: string,
  phone: string,
  profileData: ProviderProfileData
): Promise<ActionResult> {
  try {
    // Create provider document in Firestore
    const providerDocRef = doc(db, 'providers', userId);
    
    // Extract service categories for easy querying
    const serviceCategories = profileData.services.map(s => s.category);
    
    const providerData = {
      // User info
      uid: userId,
      email,
      name,
      phone,
      role: 'provider',
      userType: 'provider',
      
      // Business Information (Step 1)
      businessName: profileData.companyName,
      businessType: profileData.businessType,
      city: profileData.city,
      address: profileData.address || '',
      location: profileData.location || null,
      businessDescription: profileData.businessDescription,
      companyLogo: profileData.companyLogo || '',
      
      // Services & Pricing (Step 2)
      services: profileData.services,
      serviceCategories: serviceCategories, // Array of category names for querying
      experience: profileData.experience,
      specialization: profileData.specialization || '',
      
      // Availability (Step 3)
      availability: profileData.availability,
      workingHours: profileData.workingHours,
      priceRange: profileData.priceRange,
      
      // Documents (Step 4)
      documents: {
        idProof: profileData.idProof || null,
        addressProof: profileData.addressProof || null,
        certifications: profileData.certifications || null,
        bankDetails: profileData.bankDetails || null,
      },
      termsAccepted: profileData.termsAccepted,
      
      // Additional fields
      verified: false, // Admin needs to verify
      active: true,
      rating: 0,
      totalRatings: 0,
      reviews: 0,
      totalBookings: 0,
      completedJobs: 0,
      monthlyEarnings: 0,
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      setupCompletedAt: serverTimestamp(),
    };
    
    await setDoc(providerDocRef, providerData);
    
    return { 
      success: true, 
      providerId: userId 
    };
  } catch (error: any) {
    console.error('Error saving provider profile:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to save provider profile.' 
    };
  }
}


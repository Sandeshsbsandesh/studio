
'use server';

import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


interface FormValues {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  role?: 'customer' | 'provider';
  location?: {
    latitude: number;
    longitude: number;
  } | null;
}

interface ActionResult {
  success: boolean;
  error?: string;
  user?: {
    uid: string;
    email: string;
    name: string;
    userType: string;
    phone?: string;
  }
}

export async function signUpUser(data: FormValues): Promise<ActionResult> {
  const { email, password, name, phone, role, location } = data;

  if (!password || !name || !phone || !role) {
    return { success: false, error: 'Missing required fields for sign up.' };
  }

  // Location is only required for providers
  if (role === 'provider' && !location) {
    return { success: false, error: 'Location is required for service providers.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Choose the correct collection based on role
    const collectionName = role === 'provider' ? 'providers' : 'customers';
    const userDocRef = doc(db, collectionName, user.uid);
    
    const userData: any = {
      name,
      email,
      phone,
      role: role,
      createdAt: new Date(),
    };

    // Add location only if provided (for providers)
    if (location) {
      userData.location = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }

    await setDoc(userDocRef, userData);

    return { 
      success: true,
      user: { uid: user.uid, email: user.email!, name, userType: role, phone }
    };
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred during sign up.';
    if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
      errorMessage = 'This email address is already in use by another account.';
    } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
      errorMessage = 'The password is too weak. Please use at least 6 characters.';
    }
    console.error('Sign up error:', error);
    return { success: false, error: errorMessage };
  }
}

export async function signInUser(data: FormValues): Promise<ActionResult> {
  const { email, password } = data;
  
  if (!password) {
      return { success: false, error: 'Password is required.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Try to find user in customers collection first
    let userDocRef = doc(db, 'customers', user.uid);
    let userDoc = await getDoc(userDocRef);
    let userType = 'customer';

    // If not found in customers, try providers collection
    if (!userDoc.exists()) {
      userDocRef = doc(db, 'providers', user.uid);
      userDoc = await getDoc(userDocRef);
      userType = 'provider';
    }

    // If still not found, create a basic customer profile
    if (!userDoc.exists()) {
      const basicUserData = {
        email: user.email!,
        name: user.email!.split('@')[0], // Use email prefix as name
        role: 'customer',
        createdAt: new Date(),
      };
      
      userDocRef = doc(db, 'customers', user.uid);
      await setDoc(userDocRef, basicUserData);
      
      return { 
        success: true,
        user: {
          uid: user.uid,
          email: user.email!,
          name: basicUserData.name,
          userType: 'customer'
        }
      };
    }

    const userData = userDoc.data();
    
    // Handle different role field formats
    if (userData.role === 'provider' || userData.role === 'service_provider') {
      userType = 'provider';
    }

    return { 
      success: true,
      user: {
        uid: user.uid,
        email: user.email!,
        name: userData.name || user.email!.split('@')[0],
        userType: userType,
        phone: userData.phone || ''
      }
    };
  } catch (error: any) {
    let errorMessage = 'Invalid email or password. Please try again.';
    
    if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS || error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please sign up first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later.';
    }
    
    console.error('Sign in error:', error);
    return { success: false, error: errorMessage };
  }
}

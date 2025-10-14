
'use server';

import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface FormValues {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  userType?: 'customer' | 'provider';
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
  }
}

export async function signUpUser(data: FormValues): Promise<ActionResult> {
  const { email, password, name, phone, userType, location } = data;

  if (!password || !name || !phone || !userType || !location) {
    return { success: false, error: 'Missing required fields for sign up.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore in the 'customers' collection
    const userDocRef = doc(db, 'customers', user.uid);
    await setDoc(userDocRef, {
      name,
      email,
      phone,
      userType,
      locationLatitude: location.latitude,
      locationLongitude: location.longitude,
      createdAt: new Date(),
    });

    return { 
      success: true,
      user: { uid: user.uid, email: user.email!, name, userType }
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
    
    // Retrieve user type from Firestore from the 'customers' collection
    const userDocRef = doc(db, 'customers', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { success: false, error: 'User data not found in database.' };
    }

    const userData = userDoc.data();

    return { 
      success: true,
      user: {
        uid: user.uid,
        email: user.email!,
        name: userData.name,
        userType: userData.userType
      }
    };
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred during sign in.';
    if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS || error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please try again.';
    }
    console.error('Sign in error:', error);
    return { success: false, error: errorMessage };
  }
}

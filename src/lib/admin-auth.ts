// Admin authentication utilities
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Admin email - change this to your admin email
const ADMIN_EMAIL = 'sandeshsb0219@gmail.com';

export interface AdminUser {
  email: string;
  uid: string;
  isAdmin: boolean;
}

/**
 * Check if the current user is an admin
 */
export function isAdmin(email: string | null): boolean {
  if (!email) return false;
  return email === ADMIN_EMAIL;
}

/**
 * Sign in as admin
 */
export async function signInAsAdmin(email: string, password: string): Promise<AdminUser> {
  if (email !== ADMIN_EMAIL) {
    throw new Error('Unauthorized: Not an admin account');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  return {
    email: userCredential.user.email!,
    uid: userCredential.user.uid,
    isAdmin: true,
  };
}

/**
 * Sign out admin
 */
export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Get current admin user
 */
export function getCurrentAdmin(): Promise<AdminUser | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user && isAdmin(user.email)) {
        resolve({
          email: user.email!,
          uid: user.uid,
          isAdmin: true,
        });
      } else {
        resolve(null);
      }
    });
  });
}


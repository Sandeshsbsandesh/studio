
'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp;
// Initialize Firebase
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}


const FirebaseAppContext = createContext<FirebaseApp | undefined>(undefined);

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FirebaseAppContext.Provider value={firebaseApp}>
      {children}
    </FirebaseAppContext.Provider>
  );
};

export const useFirebaseApp = () => {
  const app = useContext(FirebaseAppContext);
  if (app === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseClientProvider');
  }
  return app;
};

export { firebaseApp };

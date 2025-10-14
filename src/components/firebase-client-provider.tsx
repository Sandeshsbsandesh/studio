
'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { app } from '@/lib/firebase'; // Import the initialized app

const FirebaseAppContext = createContext<FirebaseApp | undefined>(undefined);

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FirebaseAppContext.Provider value={app}>
      {children}
    </FirebaseAppContext.Provider>
  );
};

export const useFirebaseApp = () => {
  const firebaseApp = useContext(FirebaseAppContext);
  if (firebaseApp === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseClientProvider');
  }
  return firebaseApp;
};

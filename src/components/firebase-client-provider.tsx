
'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDqs-1uj2iaE8e5HHrF6nR9Kcrohf8b60A",
    authDomain: "studio-9158883051-f75ec.firebaseapp.com",
    projectId: "studio-9158883051-f75ec",
    storageBucket: "studio-9158883051-f75ec.appspot.com",
    messagingSenderId: "857576805556",
    appId: "1:857576805556:web:4f0a07df658fa40df973e1"
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

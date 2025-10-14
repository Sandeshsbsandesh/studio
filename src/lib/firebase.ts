
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDqs-1uj2iaE8e5HHrF6nR9Kcrohf8b60A",
    authDomain: "studio-9158883051-f75ec.firebaseapp.com",
    projectId: "studio-9158883051-f75ec",
    storageBucket: "studio-9158883051-f75ec.appspot.com",
    messagingSenderId: "857576805556",
    appId: "1:857576805556:web:4f0a07df658fa40df973e1"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };

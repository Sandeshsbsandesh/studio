import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-9158883051-f75ec",
  "appId": "1:857576-f75ec.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "857576805556"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db, firebaseConfig };

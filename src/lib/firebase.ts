
import { firebaseApp } from '@/components/firebase-client-provider';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

export { db };

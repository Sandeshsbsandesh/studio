// Script to check the structure of existing providers
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-9158883051-f75ec",
  "appId": "1:857576805556:web:4f0a07df658fa40df973e1",
  "apiKey": "AIzaSyDqs-1uj2iaE8e5HHrF6nR9Kcrohf8b60A",
  "authDomain": "studio-9158883051-f75ec.firebaseapp.com",
  "messagingSenderId": "857576805556"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkProviders() {
  const providersRef = collection(db, 'providers');
  const querySnapshot = await getDocs(providersRef);
  
  console.log('📊 Checking provider structures...\n');
  
  querySnapshot.docs.forEach((docSnap, index) => {
    const provider = docSnap.data();
    console.log(`\n--- Provider ${index + 1}: ${provider.name || provider.businessName || docSnap.id} ---`);
    console.log('Fields present:');
    console.log('  - businessName:', !!provider.businessName);
    console.log('  - name:', !!provider.name);
    console.log('  - services:', provider.services ? JSON.stringify(provider.services).substring(0, 100) : 'null');
    console.log('  - category:', provider.category);
    console.log('  - serviceCategories:', provider.serviceCategories);
    console.log('  - isProfileComplete:', provider.isProfileComplete);
    console.log('  - termsAccepted:', provider.termsAccepted);
  });
}

checkProviders();


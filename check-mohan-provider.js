// Script to check Mohan's provider data structure
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-9158883051-f75ec",
  "appId": "1:857576805556:web:4f0a07df658fa40df973e1",
  "apiKey": "AIzaSyDqs-1uj2iaE8e5HHrF6nR9Kcrohf8b60A",
  "authDomain": "studio-9158883051-f75ec.firebaseapp.com",
  "messagingSenderId": "857576805556"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkMohanProvider() {
  try {
    console.log('🔍 Checking Mohan\'s provider data...\n');
    
    const providersRef = collection(db, 'providers');
    const q = query(providersRef, where('businessName', '==', 'Mohan Rao services'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ Mohan provider not found');
      return;
    }
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📊 Mohan\'s Provider Data:');
      console.log('  - ID:', doc.id);
      console.log('  - Business Name:', data.businessName);
      console.log('  - Category:', data.category);
      console.log('  - Services Array:', data.services ? JSON.stringify(data.services, null, 2) : 'null');
      console.log('  - Service Categories:', data.serviceCategories);
      console.log('  - Is Profile Complete:', data.isProfileComplete);
      console.log('  - All Fields:', Object.keys(data));
      
      // Check if he has any custom sub-services
      if (data.services && Array.isArray(data.services)) {
        console.log('\n🔧 Custom Services Found:');
        data.services.forEach((service, index) => {
          console.log(`  Service ${index + 1}:`, {
            category: service.category,
            subcategories: service.subcategories
          });
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkMohanProvider();

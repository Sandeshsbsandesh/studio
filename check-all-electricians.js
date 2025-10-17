// Script to check all electrician providers and their sub-services
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

async function checkAllElectricians() {
  try {
    console.log('🔍 Checking all Electrician providers...\n');
    
    const providersRef = collection(db, 'providers');
    const querySnapshot = await getDocs(providersRef);
    
    const electricians = querySnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.category === 'Electricians' || 
             (data.serviceCategories && data.serviceCategories.includes('Electricians'));
    });
    
    console.log(`📊 Found ${electricians.length} Electrician providers:\n`);
    
    electricians.forEach((doc, index) => {
      const data = doc.data();
      console.log(`--- Electrician ${index + 1}: ${data.businessName} ---`);
      console.log('  - ID:', doc.id);
      console.log('  - Category:', data.category);
      console.log('  - Services Array:', data.services ? 'EXISTS' : 'null');
      console.log('  - Service Categories:', data.serviceCategories);
      console.log('  - Is Profile Complete:', data.isProfileComplete);
      
      if (data.services && Array.isArray(data.services)) {
        console.log('  🔧 Custom Services:');
        data.services.forEach((service, idx) => {
          console.log(`    Service ${idx + 1}:`, {
            category: service.category,
            subcategories: service.subcategories ? service.subcategories.length : 0
          });
          if (service.subcategories) {
            service.subcategories.forEach(sub => {
              console.log(`      - ${sub.name}: ₹${sub.price}`);
            });
          }
        });
      } else {
        console.log('  ⚠️ No custom services array (using old structure)');
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAllElectricians();

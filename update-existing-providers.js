// Script to mark all existing providers as having completed profiles
// Run this once to update existing providers in Firebase

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-9158883051-f75ec",
  "appId": "1:857576805556:web:4f0a07df658fa40df973e1",
  "apiKey": "AIzaSyDqs-1uj2iaE8e5HHrF6nR9Kcrohf8b60A",
  "authDomain": "studio-9158883051-f75ec.firebaseapp.com",
  "messagingSenderId": "857576805556"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateExistingProviders() {
  try {
    console.log('🔄 Fetching all providers from database...');
    
    const providersRef = collection(db, 'providers');
    const querySnapshot = await getDocs(providersRef);
    
    console.log(`📊 Found ${querySnapshot.size} providers`);
    
    let updated = 0;
    let alreadyComplete = 0;
    
    for (const docSnap of querySnapshot.docs) {
      const provider = docSnap.data();
      const providerId = docSnap.id;
      
      // Check if already marked as complete
      if (provider.isProfileComplete === true) {
        console.log(`✅ ${provider.name || provider.businessName || providerId} - Already complete`);
        alreadyComplete++;
        continue;
      }
      
      // Check if provider has required fields (backward compatibility check)
      const hasRequiredFields = 
        provider.businessName && 
        provider.services && 
        provider.services.length > 0;
      
      if (hasRequiredFields) {
        // Update the provider with isProfileComplete flag
        await updateDoc(doc(db, 'providers', providerId), {
          isProfileComplete: true,
          termsAccepted: true, // Also mark terms as accepted
          profileCompletedAt: new Date()
        });
        
        console.log(`✅ Updated: ${provider.name || provider.businessName || providerId}`);
        updated++;
      } else {
        console.log(`⚠️ Skipped (incomplete): ${provider.name || provider.businessName || providerId}`);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updated} providers`);
    console.log(`   ✓ Already complete: ${alreadyComplete} providers`);
    console.log(`   📝 Total: ${querySnapshot.size} providers`);
    console.log('\n🎉 Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the update
updateExistingProviders();


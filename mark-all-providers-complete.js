// Script to mark ALL existing providers as having completed profiles
// This will allow them to skip the setup wizard

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

async function markAllProvidersComplete() {
  try {
    console.log('🔄 Fetching all providers from database...');
    
    const providersRef = collection(db, 'providers');
    const querySnapshot = await getDocs(providersRef);
    
    console.log(`📊 Found ${querySnapshot.size} providers\n`);
    
    let updated = 0;
    let alreadyComplete = 0;
    
    for (const docSnap of querySnapshot.docs) {
      const provider = docSnap.data();
      const providerId = docSnap.id;
      const providerName = provider.name || provider.businessName || providerId;
      
      // Check if already marked as complete
      if (provider.isProfileComplete === true) {
        console.log(`✅ ${providerName} - Already complete`);
        alreadyComplete++;
        continue;
      }
      
      // Check if provider has businessName (minimum requirement for existing providers)
      if (provider.businessName) {
        // Update the provider with isProfileComplete flag
        await updateDoc(doc(db, 'providers', providerId), {
          isProfileComplete: true,
          termsAccepted: true,
          profileCompletedAt: new Date()
        });
        
        console.log(`✅ Marked complete: ${providerName} (Category: ${provider.category || 'N/A'})`);
        updated++;
      } else {
        console.log(`⚠️ Skipped (no businessName): ${providerId}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(50));
    console.log(`   ✅ Newly marked complete: ${updated} providers`);
    console.log(`   ✓ Already complete: ${alreadyComplete} providers`);
    console.log(`   📝 Total providers: ${querySnapshot.size}`);
    console.log('='.repeat(50));
    console.log('\n🎉 All existing providers are now marked as profile complete!');
    console.log('📱 They will no longer see the setup wizard on login.\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the update
markAllProvidersComplete();


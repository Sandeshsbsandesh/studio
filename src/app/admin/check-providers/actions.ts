'use server';

import { db } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

export async function fixProviderServiceCategories() {
  try {
    const providersCol = collection(db, 'providers');
    const snapshot = await getDocs(providersCol);
    
    let fixed = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      const providerId = docSnapshot.id;
      
      // Check if serviceCategories is missing or empty
      const needsFix = !Array.isArray(data.serviceCategories) || data.serviceCategories.length === 0;
      
      if (!needsFix) {
        skipped++;
        continue;
      }

      // Try to regenerate from services array
      if (Array.isArray(data.services) && data.services.length > 0) {
        try {
          const serviceCategories = data.services
            .map((s: any) => s.category)
            .filter((cat: string) => cat); // Remove empty values

          if (serviceCategories.length > 0) {
            await updateDoc(doc(db, 'providers', providerId), {
              serviceCategories,
              updatedAt: new Date(),
            });
            fixed++;
          } else {
            errors.push(`${data.businessName || providerId}: services array exists but no categories found`);
          }
        } catch (error) {
          errors.push(`${data.businessName || providerId}: ${error instanceof Error ? error.message : 'Update failed'}`);
        }
      } else {
        errors.push(`${data.businessName || providerId}: No services array to generate categories from`);
      }
    }

    return {
      success: true,
      fixed,
      skipped,
      total: snapshot.docs.length,
      errors,
    };
  } catch (error) {
    console.error('Error fixing provider service categories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fixed: 0,
      skipped: 0,
      total: 0,
      errors: [],
    };
  }
}


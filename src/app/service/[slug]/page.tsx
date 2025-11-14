
import { notFound } from 'next/navigation';
import { services } from '@/lib/data';
import ServiceProvidersList from './service-providers-list';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import BackButton from '@/components/back-button';

// Helper function to capitalize the first letter
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format the slug from the URL to match the category
function formatSlugToCategory(slug: string) {
  // Example: "water-can-delivery" -> "Water Can Delivery"
  // Example: "electricians" -> "Electricians"
  return slug.split('-').map(capitalizeFirstLetter).join(' ');
}


async function getProviders(serviceSlug: string) {
  try {
    if (!db) {
      console.error('[getProviders] Firestore database not initialized!');
      throw new Error('Database connection not available');
    }

    const providersCol = collection(db, 'providers');
    const category = formatSlugToCategory(serviceSlug);
    
    console.log(`[getProviders] Searching for category: "${category}"`);
    
    // Get ALL providers (no filter - we'll filter in JavaScript)
    // This is needed because old providers might not have the 'active' field
    const querySnapshot = await getDocs(providersCol);
    
    console.log(`[getProviders] Total providers in database: ${querySnapshot.docs.length}`);
    
    // Filter providers that match either:
    // 1. New structure: serviceCategories array contains the category AND active is true (or undefined for backward compatibility)
    // 2. Old structure: category field equals the category AND active is not explicitly false
    const providers = querySnapshot.docs
      .filter(doc => {
        const data = doc.data();
        const providerId = doc.id;
        
        // Log each provider for debugging
        console.log(`[getProviders] Checking provider: ${data.businessName || data.name || providerId}`, {
          active: data.active,
          serviceCategories: data.serviceCategories,
          hasCategory: Array.isArray(data.serviceCategories) && data.serviceCategories.includes(category),
          oldCategory: data.category,
        });
        
        // Skip if explicitly set to inactive
        if (data.active === false) {
          console.log(`  ❌ Skipped: Provider is inactive`);
          return false;
        }
        
        // Check new structure (array)
        if (Array.isArray(data.serviceCategories) && data.serviceCategories.includes(category)) {
          console.log(`  ✅ Match: Found in serviceCategories array`);
          return true;
        }
        
        // Check old structure (single field) - case insensitive
        if (data.category && data.category.toLowerCase() === category.toLowerCase()) {
          console.log(`  ✅ Match: Found in old category field`);
          return true;
        }
        
        console.log(`  ❌ Skipped: Category not found`);
        return false;
      })
      .map(doc => {
        const data = doc.data();
        
        // Transform services array to object format
        let servicesObject = {};
        if (Array.isArray(data.services)) {
          // Convert array format to object format
          data.services.forEach((serviceCategory: any) => {
            if (serviceCategory.category && Array.isArray(serviceCategory.subcategories)) {
              servicesObject[serviceCategory.category] = {};
              serviceCategory.subcategories.forEach((subcat: any) => {
                if (subcat.name && subcat.price !== undefined) {
                  servicesObject[serviceCategory.category][subcat.name] = String(subcat.price);
                }
              });
            }
          });
        } else if (typeof data.services === 'object' && data.services !== null) {
          // Already in object format
          servicesObject = data.services;
        }
        
        // Convert Firestore Timestamps to plain JavaScript objects
        return {
          id: doc.id,
          name: data.name || data.businessName || '',
          businessName: data.businessName || data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || data.city || '',
          city: data.city || '',
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          totalRatings: data.totalRatings || 0,
          experience: data.experience || '',
          priceRange: data.priceRange || '',
          active: data.active !== false, // Default to true if not set
          verified: data.verified || false,
          companyLogo: data.companyLogo || '',
          services: servicesObject, // Include the services object with subcategories and pricing
          latitude: typeof data.latitude === 'number'
            ? data.latitude
            : (data.location?.latitude ?? data.location?.lat ?? null),
          longitude: typeof data.longitude === 'number'
            ? data.longitude
            : (data.location?.longitude ?? data.location?.lng ?? null),
          // Convert Timestamps to ISO strings for serialization
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
          setupCompletedAt: data.setupCompletedAt?.toDate?.()?.toISOString() || null,
        };
      });
    
    console.log(`[getProviders] ✅ Found ${providers.length} matching provider(s) for "${category}"`);
    
    return providers;
  } catch (error) {
    console.error("[getProviders] Error fetching providers:", error);
    console.error("[getProviders] Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    
    // Re-throw to let the page component handle it
    throw error;
  }
}


export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params in Next.js 15
  const { slug } = await params;
  
  const service = services.find(s => s.href === `/service/${slug}`);

  if (!service) {
    notFound();
  }

  const serviceProviders = await getProviders(slug);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="mb-8 text-center">
            <div className="inline-block bg-primary/10 p-4 rounded-full text-primary mb-4">
                {service.icon}
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">{service.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{service.description}</p>
        </div>

        <h2 className="text-2xl font-bold font-headline mb-6">Available Providers</h2>
        <ServiceProvidersList serviceSlug={slug} serviceProviders={serviceProviders} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return services.map(service => ({
    slug: service.href.split('/').pop(),
  }));
}

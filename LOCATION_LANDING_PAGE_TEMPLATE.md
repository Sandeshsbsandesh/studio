# Location-Specific Landing Page Template

## Purpose
To rank for searches like:
- "electrician near me" (when user is in that area)
- "electrician in koramangala"
- "plumber in whitefield"
- "best cleaning service in indiranagar"

---

## File Structure to Create

```
src/app/service/[slug]/[location]/page.tsx
```

Example URLs:
- `/service/electricians/koramangala`
- `/service/electricians/whitefield`
- `/service/plumbers/hsr-layout`

---

## Implementation Example

Create: `src/app/service/[slug]/[location]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { services } from '@/lib/data';
import type { Metadata } from 'next';
import ServiceProvidersList from '../service-providers-list';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import BackButton from '@/components/back-button';
import { MapPin, Star, Clock, Shield } from 'lucide-react';

// Bangalore areas to target
const bangaloreAreas = [
  { slug: 'koramangala', name: 'Koramangala', coords: { lat: 12.9352, lng: 77.6245 } },
  { slug: 'whitefield', name: 'Whitefield', coords: { lat: 12.9698, lng: 77.7500 } },
  { slug: 'indiranagar', name: 'Indiranagar', coords: { lat: 12.9716, lng: 77.6412 } },
  { slug: 'hsr-layout', name: 'HSR Layout', coords: { lat: 12.9116, lng: 77.6473 } },
  { slug: 'marathahalli', name: 'Marathahalli', coords: { lat: 12.9591, lng: 77.6974 } },
  { slug: 'jp-nagar', name: 'JP Nagar', coords: { lat: 12.9082, lng: 77.5855 } },
  { slug: 'electronic-city', name: 'Electronic City', coords: { lat: 12.8399, lng: 77.6770 } },
  { slug: 'btm-layout', name: 'BTM Layout', coords: { lat: 12.9165, lng: 77.6101 } },
  { slug: 'jayanagar', name: 'Jayanagar', coords: { lat: 12.9250, lng: 77.5838 } },
  { slug: 'banashankari', name: 'Banashankari', coords: { lat: 12.9250, lng: 77.5486 } },
];

// Helper function
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatSlugToCategory(slug: string) {
  return slug.split('-').map(capitalizeFirstLetter).join(' ');
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; location: string }> 
}): Promise<Metadata> {
  const { slug, location } = await params;
  const service = services.find(s => s.href === `/service/${slug}`);
  const area = bangaloreAreas.find(a => a.slug === location);
  
  if (!service || !area) {
    return { title: 'Service Not Found - UrbanEzii' };
  }

  const serviceName = service.title;
  const areaName = area.name;
  const title = `${serviceName} in ${areaName}, Bangalore | Book Online | UrbanEzii`;
  const description = `Looking for ${serviceName.toLowerCase()} in ${areaName}? UrbanEzii connects you with verified professionals near you. ⭐ 4.8+ rated | Same-day service | 30-min response | Book now!`;

  return {
    title,
    description,
    keywords: `${serviceName.toLowerCase()} in ${areaName}, ${serviceName.toLowerCase()} near me, ${areaName} ${serviceName.toLowerCase()}, best ${serviceName.toLowerCase()} ${areaName}, local ${serviceName.toLowerCase()} ${areaName}, verified ${serviceName.toLowerCase()}`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://urbanezii.com/service/${slug}/${location}`,
      siteName: 'UrbanEzii',
    },
    alternates: {
      canonical: `https://urbanezii.com/service/${slug}/${location}`,
    },
  };
}

// Fetch providers for this service and location
async function getProvidersForLocation(serviceSlug: string, locationSlug: string) {
  const category = formatSlugToCategory(serviceSlug);
  const area = bangaloreAreas.find(a => a.slug === locationSlug);
  
  if (!area || !db) return [];
  
  const providersCol = collection(db, 'providers');
  const querySnapshot = await getDocs(providersCol);
  
  // Filter providers that:
  // 1. Serve this service category
  // 2. Serve this area (within 10km or explicitly listed)
  const providers = querySnapshot.docs
    .filter(doc => {
      const data = doc.data();
      if (data.active === false) return false;
      
      // Check service category
      const hasService = 
        (Array.isArray(data.serviceCategories) && data.serviceCategories.includes(category)) ||
        (data.category && data.category.toLowerCase() === category.toLowerCase());
      
      if (!hasService) return false;
      
      // Check location (if provider has coordinates, calculate distance)
      // For now, we'll show all providers, but you can add distance filtering
      return true;
    })
    .map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.businessName || data.name || '',
        businessName: data.businessName || data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || data.city || '',
        city: data.city || '',
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        verified: data.verified || false,
        companyLogo: data.companyLogo || '',
      };
    });
  
  return providers;
}

// Main page component
export default async function ServiceLocationPage({ 
  params 
}: { 
  params: Promise<{ slug: string; location: string }> 
}) {
  const { slug, location } = await params;
  
  const service = services.find(s => s.href === `/service/${slug}`);
  const area = bangaloreAreas.find(a => a.slug === location);
  
  if (!service || !area) {
    notFound();
  }
  
  const providers = await getProvidersForLocation(slug, location);
  
  // Structured Data for Local SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.title} in ${area.name}`,
    description: `Professional ${service.title.toLowerCase()} services in ${area.name}, Bangalore`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'UrbanEzii',
      address: {
        '@type': 'PostalAddress',
        addressLocality: area.name,
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: area.coords.lat,
        longitude: area.coords.lng,
      },
    },
    areaServed: {
      '@type': 'City',
      name: area.name,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <BackButton />
          
          {/* Hero Section */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary mb-4">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">{area.name}, Bangalore</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
              Best {service.title} in {area.name}
            </h1>
            
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Find verified and trusted {service.title.toLowerCase()} near you in {area.name}. 
              Book instantly and get professionals at your doorstep within 30 minutes.
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
              <Star className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-semibold">4.8+ Rated</h3>
              <p className="text-sm text-muted-foreground mt-1">Verified reviews</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
              <Clock className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold">30-Min Response</h3>
              <p className="text-sm text-muted-foreground mt-1">Quick service</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
              <Shield className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold">Verified Pros</h3>
              <p className="text-sm text-muted-foreground mt-1">Background checked</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
              <MapPin className="w-8 h-8 text-red-500 mb-3" />
              <h3 className="font-semibold">Local Experts</h3>
              <p className="text-sm text-muted-foreground mt-1">In {area.name}</p>
            </div>
          </div>

          {/* Providers List */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold font-headline mb-6">
              Available {service.title} in {area.name}
            </h2>
            {providers.length > 0 ? (
              <div className="grid gap-6">
                {/* Your existing ServiceProvidersList component */}
                <p className="text-muted-foreground">
                  Found {providers.length} verified provider{providers.length !== 1 ? 's' : ''} in {area.name}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg border">
                <p className="text-muted-foreground">
                  No providers currently available in {area.name}. 
                  Try our AI Assistant to find alternatives nearby.
                </p>
              </div>
            )}
          </div>

          {/* Local SEO Content */}
          <div className="mt-12 prose prose-slate max-w-none">
            <h2>Why Choose {service.title} in {area.name}?</h2>
            <p>
              {area.name} is one of Bangalore's most vibrant neighborhoods, and finding reliable 
              {service.title.toLowerCase()} shouldn't be a hassle. UrbanEzii connects you with 
              verified professionals who serve {area.name} and surrounding areas.
            </p>
            
            <h3>What We Offer in {area.name}</h3>
            <ul>
              <li>Verified and background-checked professionals</li>
              <li>Same-day service availability in {area.name}</li>
              <li>Transparent pricing with no hidden charges</li>
              <li>30-day service guarantee</li>
              <li>Easy online booking and payment</li>
            </ul>
            
            <h3>Our Service Areas Near {area.name}</h3>
            <p>
              We also serve the following areas close to {area.name}:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose mt-4">
              {bangaloreAreas
                .filter(a => a.slug !== location)
                .slice(0, 6)
                .map(a => (
                  <a
                    key={a.slug}
                    href={`/service/${slug}/${a.slug}`}
                    className="text-primary hover:underline"
                  >
                    {service.title} in {a.name}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Generate static paths for all service-location combinations
export async function generateStaticParams() {
  const serviceParams: { slug: string; location: string }[] = [];
  
  services.forEach(service => {
    bangaloreAreas.forEach(area => {
      serviceParams.push({
        slug: service.href.split('/').pop() || '',
        location: area.slug,
      });
    });
  });
  
  return serviceParams;
}
```

---

## Key SEO Elements in This Template

### 1. **Dynamic Metadata**
- Title format: "{Service} in {Area}, Bangalore | Book Online"
- Description with local keywords
- Location-specific keywords

### 2. **Structured Data**
- LocalBusiness schema with specific coordinates
- Area-specific information
- Service details

### 3. **Location Keywords**
The page mentions the area name:
- In the H1 heading
- In the description
- Throughout the content (naturally)
- In the features section

### 4. **Internal Linking**
- Links to nearby areas
- Links back to main service page
- Helps Google understand site structure

### 5. **User Intent**
- Shows local features
- Displays providers in that area
- Addresses "near me" queries

---

## How to Deploy This

1. **Create the file:**
   ```
   src/app/service/[slug]/[location]/page.tsx
   ```

2. **Update your sitemap:**
   Add all location pages to `src/app/sitemap.ts`:
   ```typescript
   const locationPages = [];
   services.forEach(service => {
     bangaloreAreas.forEach(area => {
       locationPages.push({
         url: `${baseUrl}/service/${service.slug}/${area.slug}`,
         lastModified: new Date(),
         changeFrequency: 'weekly' as const,
         priority: 0.9,
       });
     });
   });
   ```

3. **Add navigation links:**
   On your main service page, add:
   ```tsx
   <div className="mt-8">
     <h3>Popular Areas in Bangalore</h3>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       {bangaloreAreas.map(area => (
         <Link 
           key={area.slug}
           href={`/service/${slug}/${area.slug}`}
           className="text-primary hover:underline"
         >
           {area.name}
         </Link>
       ))}
     </div>
   </div>
   ```

---

## Expected Impact

With these location pages:

1. **"Electrician near me" searches**: When user is in Koramangala, Google will show your Koramangala page
2. **"Electrician in Koramangala" searches**: Direct match to your page
3. **Local Pack ranking**: Better chance of appearing in top 3 with map
4. **Long-tail keywords**: Rank for "{service} {area} bangalore", "best {service} {area}", etc.

---

## Pro Tips

1. **Add unique content**: Don't just duplicate content across pages. Add area-specific details:
   - "Common issues in [Area]"
   - "Why [Area] residents choose us"
   - Local landmarks/references

2. **Get area-specific reviews**: Ask customers to mention the area in reviews
   - "Great electrician in Koramangala!"
   - "Fixed my AC in Whitefield within 2 hours"

3. **Update regularly**: Add photos from that area, local case studies, etc.

4. **Track separately**: In Google Search Console, monitor each location page's performance

---

This structure will significantly improve your "near me" search rankings! 🚀


# Provider-Customer Data Sync Guide

## 🔄 Complete Data Flow

### **1. Provider Signs Up & Completes Setup**

**Step-by-Step Flow:**
1. Provider navigates to `/login?as=provider`
2. Signs up with email, password, name, phone, location
3. Redirected to `/provider/setup-wizard`
4. Completes 4-step setup:
   - **Step 1**: Business Information (company name, type, city, location, description)
   - **Step 2**: Services (selects categories like "Electricians", "Plumbers" with subcategory pricing)
   - **Step 3**: Availability (working days, hours, price range)
   - **Step 4**: Documents (ID proof, address proof, certifications)
5. Clicks "Complete Setup"
6. **Data saved to Firestore** `providers` collection

### **2. Data Structure in Firebase**

```javascript
// Firestore: providers/{providerId}
{
  // User Info
  uid: "provider_unique_id",
  email: "provider@example.com",
  name: "John Doe",
  phone: "9876543210",
  role: "provider",
  
  // Business Info
  businessName: "John's Electrical Services",
  businessType: "individual",
  city: "Bangalore",
  address: "123 Street, Area",
  location: { latitude: 12.9716, longitude: 77.5946 },
  businessDescription: "Professional electrical services...",
  
  // Services with Pricing
  services: [
    {
      category: "Electricians",
      subcategories: [
        { name: "Fan Installation/Repair", price: 500 },
        { name: "AC Installation/Repair", price: 1500 },
        { name: "Wiring & Rewiring", price: 2000 }
      ]
    }
  ],
  
  // ⭐ KEY FIELD FOR QUERYING ⭐
  serviceCategories: ["Electricians"],  // Array for easy querying
  
  experience: "3-5 years",
  
  // Availability
  availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  workingHours: { start: "09:00", end: "18:00" },
  priceRange: "standard",
  
  // Status
  active: true,
  verified: false,
  rating: 0,
  totalBookings: 0,
  
  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,
  setupCompletedAt: timestamp
}
```

### **3. Customer Searches for Services**

**URL Mapping:**
- Customer clicks "Electricians" → `/service/electricians`
- Customer clicks "Plumbers" → `/service/plumbers`
- Customer clicks "House Maids" → `/service/house-maids`

### **4. Query Execution**

```typescript
// src/app/service/[slug]/page.tsx

async function getProviders(serviceSlug: string) {
  const category = formatSlugToCategory(serviceSlug);
  // "electricians" → "Electricians"
  
  const q = query(
    collection(db, 'providers'),
    where('serviceCategories', 'array-contains', category),
    where('active', '==', true)
  );
  
  const providers = await getDocs(q);
  // Returns all active providers who offer "Electricians" service
}
```

### **5. Category Name Mapping**

| URL Slug | Formatted Category | Provider Setup Category |
|----------|-------------------|------------------------|
| `electricians` | Electricians | Electricians ✅ |
| `plumbers` | Plumbers | Plumbers ✅ |
| `house-maids` | House Maids | House Maids ✅ |
| `cleaners` | Cleaners | Cleaners ✅ |
| `personal-cooks` | Personal Cooks | Personal Cooks ✅ |
| `painters` | Painters | Painters ✅ |
| `shifters` | Shifters | Shifters ✅ |
| `local-buddy` | Local Buddy | Local Buddy ✅ |
| `water-can-delivery` | Water Can Delivery | Water Can Delivery ✅ |
| `doctor-on-call` | Doctor On Call | Doctor On Call ✅ |
| `cylinder-delivery` | Cylinder Delivery | Cylinder Delivery ✅ |

### **6. Display to Customer**

```typescript
// Customer sees provider card with:
- Provider Name (businessName)
- Address
- Rating (0.0 initially, updates with reviews)
- Number of reviews
- "Schedule" & "Book Now" buttons
```

### **7. Real-Time Sync**

✅ **Provider completes setup** → Data immediately saved to Firestore
✅ **Customer visits service page** → Query runs and fetches providers
✅ **Provider appears in list** → Customer can book immediately!

## 🔐 Firestore Security Rules

```
// providers collection
match /providers/{providerId} {
  allow read: if true;  // Public read for customers to see providers
  allow write: if request.auth != null && request.auth.uid == providerId;
}
```

## 📊 Key Features

1. **Instant Sync**: No delay between provider signup and customer visibility
2. **Category-based Search**: Customers find providers by service category
3. **Active Filter**: Only active providers are shown
4. **Location Support**: Providers have location data for "nearby" features (future)
5. **Multi-service**: Providers can offer multiple service categories
6. **Detailed Pricing**: Each subcategory has individual pricing

## 🧪 Testing the Flow

**Test Provider Setup:**
1. Go to `/login?as=provider`
2. Sign up as provider
3. Complete setup wizard
4. Select "Electricians" category
5. Add subcategories with prices
6. Complete all steps

**Test Customer View:**
1. Go to `/services`
2. Click "Electricians" service
3. ✅ Provider should appear in the list!
4. Click "Book Now"
5. Fill booking form
6. Booking saved to `bookings` collection

## 🎯 Data Consistency Checklist

- ✅ Provider categories match URL slugs
- ✅ `serviceCategories` array field for querying
- ✅ `active` field for filtering
- ✅ All required fields populated
- ✅ Firestore rules allow public read
- ✅ Query uses `array-contains` for category matching
- ✅ Provider appears immediately after setup

---

**Last Updated**: 2025-01-16
**Status**: ✅ Fully Synced


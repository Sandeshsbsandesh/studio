# Complete Mobile App Rebuild Plan

## 🚨 CRITICAL ISSUES FOUND

### 1. **Provider Fetching** ❌ BROKEN
- Mobile app checks `serviceCategories` and `services` array
- Web app ALSO checks if `services` array has category match
- **ISSUE**: Not working correctly, missing providers

### 2. **Authentication & Routing** ❌ BROKEN  
- Mobile stores `userRole` but web app uses `userType`
- Provider dashboard redirect not working
- Bottom navigation goes to wrong screens

### 3. **Booking Flow** ❌ NOT IMPLEMENTED
- "Book Now" button does nothing
- No booking form
- No date/time picker
- No address/notes input

### 4. **Provider Dashboard** ❌ NOT FUNCTIONAL
- Buttons don't work
- Stats not loading
- Can't navigate to bookings/services/profile

### 5. **Customer Bookings Page** ❌ NOT IMPLEMENTED
- No bookings list
- Can't view booking details
- Can't see booking status

---

## ✅ CORRECT WEB APP FLOW

### **Customer Flow:**
1. Login → Home screen
2. Click service (e.g., "Electricians") → `/service/electricians`
3. See list of providers with:
   - Name, Rating, Reviews, Address
   - "Schedule" button (future)
   - **"Book Now"** button → Opens booking modal
4. Booking modal shows form:
   - Service type dropdown (subcategories)
   - Date picker
   - Time slot selector
   - Address input
   - Phone number
   - Notes textarea
   - Submit button → Creates booking in Firebase
5. Booking confirmed → Toast notification
6. Go to `/bookings` → See all bookings

### **Provider Flow:**
1. Login → `/provider/dashboard`
2. Dashboard shows:
   - Stats: Total Bookings, Monthly Earnings, Rating, Status
   - Upcoming Appointments list
   - Earnings trend chart
   - Recent activity
3. Sidebar navigation:
   - Dashboard
   - My Profile
   - My Services
   - My Bookings
   - Earnings
   - Reviews
   - Documents
   - Settings
4. Can view/manage bookings
5. Can update profile/services
6. Can see earnings

---

## 🔧 FIXES NEEDED

### **Fix 1: Proper Authentication**
```javascript
// CORRECT (like web app):
localStorage.setItem('userType', 'provider'); // NOT userRole
localStorage.setItem('userData', JSON.stringify(user));

// Check userType for routing
if (userType === 'provider') {
  router.push('/provider/dashboard');
}
```

### **Fix 2: Provider Fetching**
```javascript
// Web app logic (src/app/service/[slug]/page.tsx):
const filteredDocs = querySnapshot.docs.filter(doc => {
  const data = doc.data();
  
  // Skip inactive
  if (data.active === false) return false;
  
  // Check serviceCategories array
  if (Array.isArray(data.serviceCategories) && 
      data.serviceCategories.includes(category)) {
    return true;
  }
  
  // Check services array
  if (Array.isArray(data.services)) {
    const hasMatch = data.services.some(s => 
      s.category === category
    );
    if (hasMatch) return true;
  }
  
  // Check old category field
  if (data.category === category) {
    return true;
  }
  
  return false;
});
```

### **Fix 3: Booking Flow**
```javascript
// When "Book Now" clicked:
1. Show booking form screen
2. Get provider's services (subcategories)
3. Show form fields:
   - Service dropdown (from provider.services)
   - Date picker
   - Time slot (9AM-5PM slots)
   - Address input
   - Phone (pre-filled)
   - Notes
4. On submit:
   - Create booking in Firebase `bookings` collection
   - bookingData = {
       providerId, providerName,
       customerName, customerPhone,
       serviceType, date, timeSlot,
       address, phone, notes,
       amount (from service price),
       status: 'pending'
     }
5. Show success message
6. Navigate to bookings page
```

### **Fix 4: Provider Navigation**
```javascript
// Provider Bottom Nav should go to:
- Home → provider-dashboard (NOT customer home)
- Bookings → provider-bookings (load provider's bookings)
- Services → provider-services (manage services)
- Profile → provider-profile (with logout)

// Each screen must check userType === 'provider'
```

### **Fix 5: Customer Bookings**
```javascript
// Customer bookings page:
1. Query bookings where customerPhone === user.phone
2. Show list with:
   - Provider name
   - Service type
   - Date & time
   - Status badge
   - Call button
   - View details button
3. Group by status:
   - Upcoming (pending, confirmed)
   - Completed
   - Cancelled
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Core Fixes
- [ ] Fix authentication (userType not userRole)
- [ ] Fix provider fetching (exact web app logic)
- [ ] Fix provider dashboard redirect
- [ ] Fix provider bottom navigation

### Phase 2: Customer Features
- [ ] Implement booking form
- [ ] Add date/time picker
- [ ] Create booking in Firebase
- [ ] Show booking confirmation
- [ ] Customer bookings list page

### Phase 3: Provider Features
- [ ] Provider bookings list (their jobs)
- [ ] Provider services management
- [ ] Provider profile with stats
- [ ] Dashboard with real data

### Phase 4: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Success toasts
- [ ] Pull to refresh
- [ ] Smooth animations

---

## 🎯 PRIORITY ORDER

1. **FIX AUTHENTICATION** (userType not userRole)
2. **FIX PROVIDER FETCHING** (services array check)
3. **IMPLEMENT BOOKING FLOW** (most critical for customers)
4. **FIX PROVIDER NAVIGATION** (separate from customer)
5. **CUSTOMER BOOKINGS LIST**
6. **PROVIDER BOOKINGS LIST**

---

## 🔥 START HERE

The mobile app needs a complete rewrite to properly mirror the web app. Every button, every navigation, every data fetch must match the web app EXACTLY.

**NO shortcuts. NO placeholders. FULL implementation.**


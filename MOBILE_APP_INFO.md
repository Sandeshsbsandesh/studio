# UrbanEzii Mobile App - Technical Documentation

## ✅ **Complete Standalone Mobile App**

**No Chrome redirection! Everything runs inside the app!**

---

## 🔥 **Features Implemented**

### 1. **Authentication (Same as Web App)**
- ✅ Login with Email/Password (Firebase Auth)
- ✅ Signup with role selection (Customer/Provider)
- ✅ Same Firebase Auth instance as web app
- ✅ Session persistence with `onAuthStateChanged`

### 2. **Database Integration (Same DB as Web App)**
- ✅ Uses exact same Firebase Firestore
- ✅ Collections:
  - `customers/{uid}` - Customer profiles
  - `providers/{uid}` - Provider profiles
- ✅ Same data structure as web app
- ✅ Real-time data sync

### 3. **Provider Fetching (Same Logic as Web App)**
```javascript
// Matches web app's query logic from src/app/service/[slug]/page.tsx

// 1. Fetch all providers
const providersRef = collection(db, 'providers');
const querySnapshot = await getDocs(providersRef);

// 2. Filter by service category
const filtered = querySnapshot.docs.filter(doc => {
  const data = doc.data();
  
  // Skip inactive
  if (data.active === false) return false;
  
  // Check new structure: serviceCategories array
  if (Array.isArray(data.serviceCategories) && 
      data.serviceCategories.includes(category)) {
    return true;
  }
  
  // Check old structure: category field
  if (data.category && 
      data.category.toLowerCase() === category.toLowerCase()) {
    return true;
  }
  
  return false;
});
```

### 4. **Screens**
- ✅ Loading Screen (Brand intro)
- ✅ Login Screen (Email/Password)
- ✅ Signup Screen (With role selection)
- ✅ Home Screen (Services grid)
- ✅ Services Screen (Full service list with search)
- ✅ Service Detail Screen (Provider listings from Firebase)
- ✅ Profile Screen (User info + Logout)
- ✅ Bookings Screen (Empty state for now)

### 5. **Navigation**
- ✅ Bottom navigation bar (Home, Services, Bookings, Profile)
- ✅ Back button navigation
- ✅ Screen state management
- ✅ Active tab highlighting

### 6. **Location**
- ✅ Auto-detect location on login
- ✅ Manual location update
- ✅ Location storage in localStorage

### 7. **UI/UX**
- ✅ Premium gradient design (Purple like Swiggy/Zomato)
- ✅ Card-based layouts
- ✅ Smooth animations
- ✅ Touch feedback
- ✅ Safe area support (notch/home indicator)
- ✅ Loading states
- ✅ Error handling

---

## 🎯 **Role-Based Flow**

### **Customer Flow:**
1. Signup → Select "Customer" role
2. Data saved to `customers/{uid}` collection
3. Login → Home screen with services
4. Click service → See providers from Firebase
5. Book provider → (Coming soon)

### **Provider Flow:**
1. Signup → Select "Service Provider" role
2. Data saved to `providers/{uid}` collection
3. Login → Home screen
4. *(Provider dashboard coming soon)*

---

## 🔄 **Data Sync with Web App**

### **Authentication:**
- Mobile app uses: `Firebase Auth`
- Web app uses: `Firebase Auth`
- ✅ **Same authentication instance**
- ✅ **User can login on web or mobile with same credentials**

### **Database:**
- Mobile app uses: `Firestore (studio-9158883051-f75ec)`
- Web app uses: `Firestore (studio-9158883051-f75ec)`
- ✅ **Same database**
- ✅ **Same collections (customers, providers)**
- ✅ **Same data structure**

### **Provider Queries:**
- Mobile app: Filters by `serviceCategories` array
- Web app: Filters by `serviceCategories` array
- ✅ **Same query logic** (from `src/app/service/[slug]/page.tsx`)

---

## 📱 **Services (Hardcoded)**

As requested, services are hardcoded in the mobile app:

```javascript
const SERVICES = [
  { id: 'water-can-delivery', name: 'Water Can', icon: '💧' },
  { id: 'house-maids', name: 'House Maids', icon: '🏠' },
  { id: 'electricians', name: 'Electricians', icon: '⚡' },
  { id: 'plumbers', name: 'Plumbers', icon: '🔧' },
  { id: 'doctor-on-call', name: 'Doctor', icon: '🩺' },
  { id: 'cylinder-delivery', name: 'Cylinder', icon: '🔥' },
  { id: 'cleaners', name: 'Cleaners', icon: '✨' },
  { id: 'personal-cooks', name: 'Cooks', icon: '👨‍🍳' },
  { id: 'local-buddy', name: 'Local Buddy', icon: '🤝' },
  { id: 'shifters-and-movers', name: 'Movers', icon: '🚚' },
  { id: 'painters', name: 'Painters', icon: '🎨' },
];
```

**Service Providers are fetched from Firebase dynamically!**

---

## 🔧 **Technical Stack**

- **Framework:** Vanilla JavaScript (ES6 Modules)
- **Backend:** Firebase (Auth + Firestore)
- **Container:** Capacitor (Native Android wrapper)
- **UI:** Pure HTML/CSS with inline styles
- **State Management:** JavaScript variables + localStorage

---

## 🚀 **Build Instructions**

1. **Sync changes:**
   ```bash
   npx cap sync
   ```

2. **Open Android Studio:**
   ```bash
   npx cap open android
   ```

3. **Build APK:**
   - Wait for Gradle sync
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Wait 2-3 minutes
   - Click "locate" to find APK

4. **Install on phone**

---

## 📊 **Firebase Config**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDqs-1uj2iaE8e5HHrF6nR9Kcrohf8b60A",
  authDomain: "studio-9158883051-f75ec.firebaseapp.com",
  projectId: "studio-9158883051-f75ec",
  messagingSenderId: "857576805556",
  appId: "1:857576805556:web:4f0a07df658fa40df973e1"
};
```

**Same config as web app's `.env.local`!**

---

## ✅ **What's Working**

- ✅ Login/Signup with Firebase
- ✅ Customer/Provider role selection
- ✅ Data saved to correct Firestore collection
- ✅ Services display (hardcoded)
- ✅ Provider fetching from Firebase (dynamic)
- ✅ Location detection & storage
- ✅ Profile screen with user info
- ✅ Logout functionality
- ✅ Bottom navigation
- ✅ Premium mobile UI (no web view!)
- ✅ Same database as web app
- ✅ No Chrome redirection!

---

## 🔜 **Coming Soon**

- ⏳ Booking flow with date/time picker
- ⏳ Provider dashboard
- ⏳ Booking history
- ⏳ Push notifications
- ⏳ Payment integration

---

## 🎨 **Design Philosophy**

Inspired by **Zomato, Swiggy, Rapido:**
- Gradient headers
- Card-based layouts
- Bottom navigation
- Quick action buttons
- Clean, modern UI
- Smooth animations
- Premium feel

---

## 🔐 **Security**

- Firebase Auth handles authentication
- Firestore security rules apply (from web app)
- No sensitive data in localStorage
- Session tokens managed by Firebase SDK

---

## 📝 **Notes**

1. **No Server Actions:** Mobile app uses Firebase SDK directly (client-side)
2. **No Next.js:** Pure JavaScript for faster, smaller app
3. **Same Backend:** Uses exact same Firebase as web app
4. **Offline Support:** Can be added with Firestore offline persistence
5. **Update Strategy:** Rebuild APK when you need to update the mobile UI

---

**Built with ❤️ for UrbanEzii**


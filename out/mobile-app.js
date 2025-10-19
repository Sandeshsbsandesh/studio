/**
 * UrbanEzii Mobile App
 * Complete mobile implementation matching web app functionality
 * Built with Firebase, Capacitor, and premium mobile UI
 */

// Firebase imports from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
  orderBy,
  Timestamp,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ============================================================================
// FIREBASE CONFIGURATION
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDqs-1uj2iaE8e5HHrF6nR9Kcrohf8b60A",
  authDomain: "studio-9158883051-f75ec.firebaseapp.com",
  projectId: "studio-9158883051-f75ec",
  messagingSenderId: "857576805556",
  appId: "1:857576805556:web:4f0a07df658fa40df973e1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================================================
// APP STATE
// ============================================================================
let currentUser = null;
let currentScreen = 'loading';
let selectedService = null;
let selectedProvider = null;
let userLocation = null;

// Setup Wizard State
let wizardStep = 1;
let wizardData = {
  step1: {},
  step2: { services: [], experience: '' },
  step3: {},
  step4: {}
};
let expandedCategories = []; // Track which categories are expanded

// Real-time Dashboard State
let providerBookingsListener = null;
let lastBookingCount = 0;
let isFirstLoad = true;

// Service Categories with Subcategories (matching web app)
const SERVICE_CATEGORIES = {
  'Electricians': [
    'Fan Installation/Repair',
    'AC Installation/Repair',
    'Geyser Installation/Repair',
    'Kitchen Appliances Service',
    'TV Installation/Repair',
    'Wiring & Rewiring',
    'Switch & Socket Installation',
    'MCB & DB Installation',
    'Light Fixture Installation',
    'Electrical Safety Inspection',
  ],
  'Plumbers': [
    'Pipe Leakage Repair',
    'Tap Installation/Repair',
    'Toilet Repair',
    'Drainage Cleaning',
    'Water Tank Cleaning',
    'Bathroom Fitting Installation',
    'Sink Installation/Repair',
    'Overhead Tank Installation',
    'Water Heater Installation',
    'Sewer Line Cleaning',
  ],
  'Cleaners': [
    'Deep Cleaning',
    'Kitchen Cleaning',
    'Bathroom Cleaning',
    'Sofa Cleaning',
    'Carpet Cleaning',
    'Post-Construction Cleaning',
    'Window Cleaning',
    'Floor Polishing',
    'Balcony Cleaning',
    'Full Home Sanitization',
  ],
  'Doctor on Call': [
    'General Checkup',
    'Pediatrician Consultation',
    'Emergency Consultation',
    'Follow-up Visit',
    'Health Monitoring',
    'Blood Pressure Check',
    'Diabetes Management',
    'Elderly Care Visit',
    'Post-Surgery Care',
    'Vaccination',
  ],
  'Water Can Delivery': [
    '20L Can Delivery',
    '25L Can Delivery',
    'Monthly Subscription',
    'Weekly Subscription',
    'Single Delivery',
  ],
  'Cylinder Delivery': [
    'Domestic LPG Cylinder',
    'Commercial LPG Cylinder',
    'Emergency Delivery',
    'Regular Subscription',
  ],
  'House Maids': [
    'Daily Cleaning',
    'Weekly Deep Clean',
    'Part-time Maid',
    'Full-time Maid',
    'Cooking Service',
    'Utensils Washing',
    'Laundry Service',
  ],
  'Personal Cooks': [
    'Breakfast Preparation',
    'Lunch Preparation',
    'Dinner Preparation',
    'Full-time Cook',
    'Part-time Cook',
    'Special Diet Preparation',
    'Party Catering',
  ],
  'Local Buddy': [
    'City Tour Guide',
    'Shopping Assistance',
    'Translation Service',
    'Local Information',
    'Event Planning Help',
  ],
  'Shifters & Movers': [
    'Local Shifting',
    'Intercity Moving',
    'Packing Service',
    'Unpacking Service',
    'Vehicle Transportation',
    'Office Relocation',
    'Warehouse Shifting',
  ],
  'Painters': [
    'Interior Painting',
    'Exterior Painting',
    'Texture Painting',
    'Wood Polishing',
    'Wall Putty',
    'Waterproofing',
    'Stencil Art',
  ],
};

// Professional SVG Icons
// Professional icon images for services (using emojis for simplicity and reliability)
const ICONS = {
  waterCan: '💧',
  houseMaid: '🏠',
  electrician: '⚡',
  plumber: '🔧',
  doctor: '⚕️',
  cylinder: '🔥',
  cleaner: '🧹',
  cook: '👨‍🍳',
  buddy: '👥',
  mover: '🚚',
  painter: '🎨'
};

// Services configuration (hardcoded as per requirement)
const SERVICES = [
  { id: 'water-can-delivery', name: 'Water Can', icon: ICONS.waterCan, category: 'Water Can Delivery' },
  { id: 'house-maids', name: 'House Maids', icon: ICONS.houseMaid, category: 'House Maids' },
  { id: 'electricians', name: 'Electricians', icon: ICONS.electrician, category: 'Electricians' },
  { id: 'plumbers', name: 'Plumbers', icon: ICONS.plumber, category: 'Plumbers' },
  { id: 'doctor-on-call', name: 'Doctor', icon: ICONS.doctor, category: 'Doctor on Call' },
  { id: 'cylinder-delivery', name: 'Cylinder', icon: ICONS.cylinder, category: 'Cylinder Delivery' },
  { id: 'cleaners', name: 'Cleaners', icon: ICONS.cleaner, category: 'Cleaners' },
  { id: 'personal-cooks', name: 'Cooks', icon: ICONS.cook, category: 'Personal Cooks' },
  { id: 'local-buddy', name: 'Local Buddy', icon: ICONS.buddy, category: 'Local Buddy' },
  { id: 'shifters-and-movers', name: 'Movers', icon: ICONS.mover, category: 'Shifters & Movers' },
  { id: 'painters', name: 'Painters', icon: ICONS.painter, category: 'Painters' },
];

// ============================================================================
// SPLASH SCREEN
// ============================================================================
function showSplashScreen() {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: splashFadeIn 0.8s ease-out;
    ">
      <!-- Logo Container -->
      <div style="
        position: relative;
        margin-bottom: 40px;
        animation: logoFloat 2s ease-in-out infinite;
      ">
        <!-- Main Logo -->
        <div style="
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        ">
          <!-- Logo Icon -->
          <div style="
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          
          <!-- Shine Effect -->
          <div style="
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
            animation: logoShine 2s ease-in-out infinite;
          "></div>
        </div>
        
        <!-- Floating Particles -->
        <div style="
          position: absolute;
          top: -20px;
          left: -20px;
          width: 160px;
          height: 160px;
          pointer-events: none;
        ">
          <div style="
            position: absolute;
            top: 20px;
            left: 20px;
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            animation: particleFloat1 3s ease-in-out infinite;
          "></div>
          <div style="
            position: absolute;
            top: 40px;
            right: 30px;
            width: 4px;
            height: 4px;
            background: rgba(255,255,255,0.4);
            border-radius: 50%;
            animation: particleFloat2 2.5s ease-in-out infinite;
          "></div>
          <div style="
            position: absolute;
            bottom: 30px;
            left: 10px;
            width: 5px;
            height: 5px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
            animation: particleFloat3 3.5s ease-in-out infinite;
          "></div>
        </div>
      </div>
      
      <!-- App Name -->
      <div style="
        color: white;
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 8px;
        text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        animation: textSlideUp 1s ease-out 0.5s both;
      ">
        UrbanEzii
      </div>
      
      <!-- Tagline -->
      <div style="
        color: rgba(255,255,255,0.9);
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 60px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        animation: textSlideUp 1s ease-out 0.7s both;
      ">
        Your Trusted Service Partner
      </div>
      
      <!-- Loading Indicator -->
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        animation: textSlideUp 1s ease-out 0.9s both;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: loadingDot1 1.4s ease-in-out infinite;
        "></div>
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: loadingDot2 1.4s ease-in-out infinite;
        "></div>
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: loadingDot3 1.4s ease-in-out infinite;
        "></div>
      </div>
      
      <!-- Version Info -->
      <div style="
        position: absolute;
        bottom: 40px;
        color: rgba(255,255,255,0.7);
        font-size: 12px;
        font-weight: 500;
        animation: textSlideUp 1s ease-out 1.1s both;
      ">
        Version 1.0 • Made with ❤️ in India
      </div>
    </div>
    
    <style>
      @keyframes splashFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes logoFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes logoShine {
        0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
        50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      }
      
      @keyframes particleFloat1 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
        50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
      }
      
      @keyframes particleFloat2 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
        50% { transform: translateY(-15px) scale(1.1); opacity: 0.8; }
      }
      
      @keyframes particleFloat3 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
        50% { transform: translateY(-25px) scale(1.3); opacity: 0.9; }
      }
      
      @keyframes textSlideUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0px); 
        }
      }
      
      @keyframes loadingDot1 {
        0%, 20% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
        80%, 100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes loadingDot2 {
        0%, 20% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
        80%, 100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes loadingDot3 {
        0%, 20% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
        80%, 100% { transform: scale(1); opacity: 1; }
      }
    </style>
  `;
}

// ============================================================================
// INITIALIZATION
// ============================================================================
async function initApp() {
  console.log('🚀 Initializing UrbanEzii Mobile App...');
  
  // Initialize notification service (but don't request permissions yet)
  if (window.notificationService) {
    console.log('🔔 Notification service available');
  }
  
  // Load location from localStorage if available
  const savedLocation = localStorage.getItem('userLocation');
  if (savedLocation) {
    try {
      userLocation = JSON.parse(savedLocation);
      console.log('📍 Location loaded from localStorage:', userLocation);
    } catch (e) {
      console.error('Failed to parse saved location:', e);
      userLocation = null;
    }
  }
  
  // Set up Firebase auth listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      loadUserData(user.uid);
    } else {
      currentUser = null;
      showScreen('login');
    }
  });
  
  // Show login screen directly (no splash screen interference)
  showScreen('login');
  
  // Request notification permission after a short delay
  setTimeout(() => {
    requestNotificationPermissionDirect();
  }, 1000);
}

// ============================================================================
// DIRECT NOTIFICATION PERMISSION REQUEST
// ============================================================================
async function requestNotificationPermissionDirect() {
  try {
    if (typeof Capacitor === 'undefined') return;
    
    const { PushNotifications } = await import('@capacitor/push-notifications');
    
    // Direct permission request
    const result = await PushNotifications.requestPermissions();
    
    if (result.receive === 'granted') {
      await PushNotifications.register();
      
      // Listen for registration token
      PushNotifications.addListener('registration', (token) => {
        console.log('🔔 FCM Token received:', token.value);
        saveFCMTokenToDatabase(token.value);
      });
      
      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error) => {
        console.error('❌ FCM Registration error:', error);
      });
    }
  } catch (error) {
    console.error('❌ Notification permission error:', error);
  }
}

// Save FCM token to database
async function saveFCMTokenToDatabase(token) {
  try {
    if (!currentUser) return;
    
    const userType = localStorage.getItem('userType') || 'customer';
    const collectionName = userType === 'provider' ? 'providers' : 'customers';
    
    await updateDoc(doc(db, collectionName, currentUser.uid), {
      fcmToken: token,
      lastTokenUpdate: new Date()
    });
    
    console.log('✅ FCM Token saved to database');
  } catch (error) {
    console.error('❌ Error saving FCM token:', error);
  }
}

// ============================================================================
// NOTIFICATION PERMISSION CHECK
// ============================================================================
async function checkAndRequestNotificationPermission() {
  try {
    console.log('🔔 Checking notification permission status...');
    
    // Check if we're on mobile
    if (typeof Capacitor === 'undefined') {
      console.log('📱 Not on mobile platform, skipping notification check');
      return;
    }
    
    // Import PushNotifications dynamically
    const { PushNotifications } = await import('@capacitor/push-notifications');
    
    // Check current permission status
    const permissionStatus = await PushNotifications.checkPermissions();
    console.log('🔔 Current permission status:', permissionStatus);
    
    if (permissionStatus.receive === 'granted') {
      console.log('✅ Notification permission already granted');
      return;
    }
    
    // Permission not granted, request it with explicit options
    console.log('🔔 Requesting notification permission...');
    
    // Request permissions with explicit options
    const newPermissionStatus = await PushNotifications.requestPermissions({
      permissions: ['receive']
    });
    
    console.log('🔔 New permission status:', newPermissionStatus);
    
    if (newPermissionStatus.receive === 'granted') {
      console.log('✅ Notification permission granted!');
      
      // Register for push notifications
      await PushNotifications.register();
      console.log('✅ Registered for push notifications');
      
      // Show success message
      setTimeout(() => {
        alert('🔔 Notifications enabled! You will now receive alerts on your lock screen.');
      }, 1000);
      
    } else {
      console.log('❌ Notification permission denied');
      // Show message that user can enable later
      setTimeout(() => {
        alert('🔔 Notification permission denied. You can enable it later in Settings > Apps > UrbanEzii > Notifications');
      }, 1000);
    }
    
  } catch (error) {
    console.error('❌ Error checking notification permission:', error);
    console.log('🔔 Trying alternative permission request...');
    
    // Fallback: try direct permission request
    try {
      if (typeof PushNotifications !== 'undefined') {
        const result = await PushNotifications.requestPermissions();
        console.log('🔔 Fallback permission result:', result);
      }
    } catch (fallbackError) {
      console.error('❌ Fallback permission request failed:', fallbackError);
    }
  }
}

// ============================================================================
// USER DATA LOADING (Exact web app logic)
// ============================================================================
async function loadUserData(uid) {
  try {
    console.log('📥 Loading user data for UID:', uid);
    
    // Try customers collection first (SAME AS WEB APP)
    let userDocRef = doc(db, 'customers', uid);
    let userDoc = await getDoc(userDocRef);
    let userType = 'customer';

    // If not found in customers, try providers collection
    if (!userDoc.exists()) {
      console.log('🔍 Not found in customers, checking providers...');
      userDocRef = doc(db, 'providers', uid);
      userDoc = await getDoc(userDocRef);
      userType = 'provider';
    }

    if (!userDoc.exists()) {
      console.log('⚠️ User not found in any collection');
      showScreen('login');
      return;
    }

    const userData = userDoc.data();
    console.log('✅ User found:', {
      name: userData.name,
      businessName: userData.businessName,
      email: userData.email,
      phone: userData.phone,
      servicesCount: userData.services?.length || 0,
      role: userData.role,
      userType: userData.userType
    });
    
    // Handle different role field formats (SAME AS WEB APP)
    if (userData.role === 'provider' || userData.role === 'service_provider' || userData.userType === 'provider') {
      userType = 'provider';
    }
    
    // Store user data (use userType, NOT userRole - CRITICAL!)
    localStorage.setItem('userName', userData.name || userData.businessName || '');
    localStorage.setItem('userEmail', userData.email || '');
    localStorage.setItem('userPhone', userData.phone || '');
    localStorage.setItem('userType', userType); // CORRECT KEY
    localStorage.setItem('userData', JSON.stringify({
      uid: uid,
      email: userData.email,
      name: userData.name || userData.businessName,
      userType: userType,
      phone: userData.phone
    }));
    
    // Load and store location from database (SAME AS WEB APP)
    if (userData.location) {
      userLocation = {
        latitude: userData.location.latitude,
        longitude: userData.location.longitude
      };
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
      console.log('📍 User location loaded:', userLocation);
    } else {
      userLocation = null;
      localStorage.removeItem('userLocation');
      console.log('📍 No location in database');
    }
    
    console.log('✅ User type:', userType);
    
    // Check notification permission after successful login
    await checkAndRequestNotificationPermission();
    
    // Redirect based on userType (SAME AS WEB APP)
    if (userType === 'provider') {
      console.log('🔄 Checking provider profile completeness...');
      console.log('📊 Provider data:', {
        isProfileComplete: userData.isProfileComplete,
        businessName: userData.businessName,
        servicesCount: userData.services?.length || 0,
        termsAccepted: userData.termsAccepted
      });
      
      // Check if provider profile is complete (SAME LOGIC AS WEB APP)
      // Web app checks for document existence and required fields, not isProfileComplete flag
      let isProfileComplete = userData.businessName && 
                            userData.services && 
                            userData.services.length > 0 &&
                            userData.termsAccepted === true;
      
      // Also check for explicit flag if it exists (for mobile-specific providers)
      if (!isProfileComplete && userData.isProfileComplete === true) {
        isProfileComplete = true;
      }
      
      if (!isProfileComplete) {
        console.log('⚠️ Provider profile incomplete, showing setup wizard');
        showScreen('setup-wizard');
      } else {
        console.log('✅ Provider profile complete, showing dashboard');
        showScreen('provider-dashboard');
      }
    } else {
      console.log('🔄 Redirecting to customer home');
      showScreen('home');
    }
    
  } catch (error) {
    console.error('❌ Error loading user data:', error);
    showScreen('login');
  }
}

// ============================================================================
// SCREEN MANAGEMENT
// ============================================================================
function showScreen(screenName) {
  console.log('📱 Showing screen:', screenName);
  currentScreen = screenName;
  const appContainer = document.getElementById('app');
  
  switch(screenName) {
    case 'loading':
      appContainer.innerHTML = getLoadingScreen();
      break;
    case 'login':
      appContainer.innerHTML = getLoginScreen();
      attachLoginHandlers();
      break;
    case 'signup':
      appContainer.innerHTML = getSignupScreen();
      attachSignupHandlers();
      break;
    case 'home':
      appContainer.innerHTML = getHomeScreen();
      attachHomeHandlers();
      break;
    case 'services':
      appContainer.innerHTML = getServicesScreen();
      attachServicesHandlers();
      break;
    case 'service-detail':
      appContainer.innerHTML = getServiceDetailScreen();
      attachServiceDetailHandlers();
      break;
    case 'booking-form':
      appContainer.innerHTML = getBookingFormScreen();
      attachBookingFormHandlers();
      break;
    case 'customer-bookings':
      appContainer.innerHTML = getCustomerBookingsScreen();
      attachCustomerBookingsHandlers();
      break;
    case 'customer-profile':
      appContainer.innerHTML = getCustomerProfileScreen();
      attachCustomerProfileHandlers();
      break;
    case 'admin-panel':
      if (currentUser && currentUser.email === 'sandeshsb25260@gmail.com') {
        // Check admin access and get panel
        window.adminPanel.checkAdminAccess(currentUser);
        appContainer.innerHTML = window.adminPanel.getAdminPanel();
      } else {
        showScreen('home');
      }
      break;
    case 'provider-dashboard':
      appContainer.innerHTML = getProviderDashboardScreen();
      attachProviderDashboardHandlers();
      break;
    case 'provider-bookings':
      appContainer.innerHTML = getProviderBookingsScreen();
      attachProviderBookingsHandlers();
      break;
    case 'provider-services':
      appContainer.innerHTML = getProviderServicesScreen();
      attachProviderServicesHandlers();
      break;
    case 'provider-profile':
      appContainer.innerHTML = getProviderProfileScreen();
      attachProviderProfileHandlers();
      break;
    case 'setup-wizard':
      appContainer.innerHTML = getSetupWizardScreen();
      attachSetupWizardHandlers();
      break;
    case 'provider-earnings':
      appContainer.innerHTML = getProviderEarningsScreen();
      attachProviderEarningsHandlers();
      break;
    case 'provider-reviews':
      appContainer.innerHTML = getProviderReviewsScreen();
      attachProviderReviewsHandlers();
      break;
    case 'provider-documents':
      appContainer.innerHTML = getProviderDocumentsScreen();
      attachProviderDocumentsHandlers();
      break;
    case 'provider-settings':
      appContainer.innerHTML = getProviderSettingsScreen();
      attachProviderSettingsHandlers();
      break;
    case 'about':
      appContainer.innerHTML = getAboutScreen();
      break;
    case 'features':
      appContainer.innerHTML = getFeaturesScreen();
      break;
    case 'pricing':
      appContainer.innerHTML = getPricingScreen();
      break;
    case 'faq':
      appContainer.innerHTML = getFAQScreen();
      break;
    case 'blog':
      appContainer.innerHTML = getBlogScreen();
      break;
    case 'contact':
      appContainer.innerHTML = getContactScreen();
      attachContactHandlers();
      break;
    default:
      appContainer.innerHTML = getLoadingScreen();
  }
}

// ============================================================================
// REUSABLE BEAUTIFUL LOADER (Used across the app)
// ============================================================================
function getBeautifulLoader(message = 'Loading...', fullscreen = false, size = 'medium') {
  const sizes = {
    small: { logo: '60px', spinner: '80px', text: '12px' },
    medium: { logo: '100px', spinner: '120px', text: '14px' },
    large: { logo: '140px', spinner: '160px', text: '16px' }
  };
  
  const s = sizes[size] || sizes.medium;
  
  const containerStyle = fullscreen 
    ? 'min-height: 100vh; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);' 
    : 'padding: 60px 20px; background: transparent;';
  
  return `
    <div style="${containerStyle} display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;">
      ${fullscreen ? `
        <!-- Animated Background Elements (only for fullscreen) -->
        <div style="position: absolute; width: 300px; height: 300px; background: rgba(255,255,255,0.05); border-radius: 50%; top: -100px; right: -100px; animation: float 6s ease-in-out infinite;"></div>
        <div style="position: absolute; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%; bottom: -50px; left: -50px; animation: float 8s ease-in-out infinite reverse;"></div>
      ` : ''}
      
      <!-- Logo Container with Pulse + Glow Animation -->
      <div style="position: relative; width: ${s.spinner}; height: ${s.spinner}; margin-bottom: 24px;">
        <!-- Outer Glow Ring 1 -->
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle, ${fullscreen ? 'rgba(255,255,255,0.15)' : 'rgba(59, 130, 246, 0.15)'} 0%, transparent 70%); animation: pulse 2s ease-in-out infinite;"></div>
        
        <!-- Outer Glow Ring 2 -->
        <div style="position: absolute; width: 90%; height: 90%; top: 5%; left: 5%; border-radius: 50%; background: radial-gradient(circle, ${fullscreen ? 'rgba(255,255,255,0.2)' : 'rgba(59, 130, 246, 0.2)'} 0%, transparent 70%); animation: pulse 2s ease-in-out 0.5s infinite;"></div>
        
        <!-- Spinning Border -->
        <div style="position: absolute; width: 100%; height: 100%; border: 3px solid transparent; border-top-color: ${fullscreen ? 'white' : '#3b82f6'}; border-right-color: ${fullscreen ? 'white' : '#3b82f6'}; border-radius: 50%; animation: spin 1.5s linear infinite;"></div>
        
        <!-- Inner Circle with Logo -->
        <div style="position: absolute; width: ${s.logo}; height: ${s.logo}; top: 50%; left: 50%; transform: translate(-50%, -50%); background: ${fullscreen ? 'rgba(255,255,255,0.95)' : 'white'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: ${size === 'small' ? '12px' : size === 'large' ? '24px' : '18px'}; box-shadow: 0 8px 32px ${fullscreen ? 'rgba(0,0,0,0.2)' : 'rgba(59, 130, 246, 0.25)'}; animation: logoFloat 3s ease-in-out infinite;">
          <img src="logo.png" alt="UrbanEzii" style="width: 100%; height: 100%; object-fit: contain; animation: logoBreathe 2s ease-in-out infinite;" />
        </div>
        
        <!-- Orbiting Dots -->
        <div style="position: absolute; width: 8px; height: 8px; background: ${fullscreen ? 'white' : '#3b82f6'}; border-radius: 50%; top: 0; left: 50%; transform: translateX(-50%); animation: orbit 3s linear infinite;"></div>
        <div style="position: absolute; width: 8px; height: 8px; background: ${fullscreen ? 'white' : '#06b6d4'}; border-radius: 50%; bottom: 0; left: 50%; transform: translateX(-50%); animation: orbit 3s linear 1.5s infinite;"></div>
      </div>
      
      <!-- Loading Message -->
      <p style="color: ${fullscreen ? 'rgba(255,255,255,0.9)' : '#333'}; font-size: ${s.text}; font-weight: 600; text-align: center; animation: fadeInUp 1s ease-out; margin: 0;">${message}</p>
      
      ${fullscreen ? `
        <!-- Brand Name (only for fullscreen) -->
        <h1 style="color: white; font-size: 32px; font-weight: 800; margin-top: 32px; letter-spacing: 2px; animation: fadeInUp 1s ease-out 0.2s backwards;">UrbanEzii</h1>
        <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 8px; animation: fadeInUp 1s ease-out 0.4s backwards;">Your Local Service Bridge</p>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// SCREEN HTML: LOADING (Using Beautiful Loader)
// ============================================================================
function getLoadingScreen() {
  return getBeautifulLoader('Loading your experience...', true, 'large');
}

// ============================================================================
// SCREEN HTML: LOGIN
// ============================================================================
function getLoginScreen() {
  return `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 20px; display: flex; flex-direction: column; overflow-y: auto; position: relative;">
      <!-- Floating Background Elements -->
      <div style="position: absolute; width: 250px; height: 250px; background: rgba(255,255,255,0.08); border-radius: 50%; top: -50px; right: -50px; animation: float 8s ease-in-out infinite;"></div>
      <div style="position: absolute; width: 180px; height: 180px; background: rgba(255,255,255,0.08); border-radius: 50%; bottom: 50px; left: -50px; animation: float 6s ease-in-out infinite reverse;"></div>
      
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 420px; margin: 0 auto; width: 100%; position: relative; z-index: 2;">
        <!-- Logo & Header -->
        <div style="text-align: center; margin-bottom: 40px; animation: fadeInUp 0.8s ease-out;">
          <div style="width: 110px; height: 110px; background: white; border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; padding: 16px; box-shadow: 0 12px 48px rgba(0,0,0,0.25); animation: logoFloat 3s ease-in-out infinite;">
            <img src="logo.png" alt="UrbanEzii Logo" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <h1 style="color: white; font-size: 34px; font-weight: 800; margin-bottom: 8px; letter-spacing: 0.5px;">Welcome Back!</h1>
          <p style="color: rgba(255,255,255,0.92); font-size: 15px; font-weight: 500;">Sign in to continue to UrbanEzii</p>
        </div>
        
        <!-- Login Form Card -->
        <div style="background: white; border-radius: 28px; padding: 36px; box-shadow: 0 24px 80px rgba(0,0,0,0.35); animation: fadeInUp 0.8s ease-out 0.2s backwards;">
          <div id="loginError" style="display: none; background: linear-gradient(135deg, #fee 0%, #fecaca 100%); color: #991b1b; padding: 14px; border-radius: 12px; margin-bottom: 24px; font-size: 14px; font-weight: 600; border-left: 4px solid #dc2626;"></div>
          
          <!-- Email Input -->
          <div style="margin-bottom: 22px;">
            <label style="display: block; font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px;">Email Address</label>
            <div style="position: relative;">
              <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); opacity: 0.4;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input type="email" id="loginEmail" placeholder="your@email.com" style="width: 100%; padding: 16px 16px 16px 48px; border: 2px solid #e5e7eb; border-radius: 14px; font-size: 15px; outline: none; transition: all 0.3s; font-weight: 500;" onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 4px rgba(59, 130, 246, 0.1)';" onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';" />
            </div>
          </div>
          
          <!-- Password Input -->
          <div style="margin-bottom: 28px;">
            <label style="display: block; font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px;">Password</label>
            <div style="position: relative;">
              <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); opacity: 0.4;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input type="password" id="loginPassword" placeholder="Enter your password" style="width: 100%; padding: 16px 56px 16px 48px; border: 2px solid #e5e7eb; border-radius: 14px; font-size: 15px; outline: none; transition: all 0.3s; font-weight: 500;" onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 4px rgba(59, 130, 246, 0.1)';" onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';" />
              <button type="button" id="toggleLoginPassword" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 20px; cursor: pointer; padding: 4px; opacity: 0.5; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.5'">👁️</button>
            </div>
          </div>
          
          <!-- Sign In Button -->
          <button id="loginBtn" style="width: 100%; padding: 18px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 14px; font-size: 17px; font-weight: 800; cursor: pointer; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 32px rgba(59, 130, 246, 0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(59, 130, 246, 0.4)'">
            Sign In →
          </button>
          
          <!-- Signup Link -->
          <div style="text-align: center; font-size: 15px; color: #666; font-weight: 500;">
            Don't have an account? 
            <button id="goToSignup" style="color: #3b82f6; font-weight: 700; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: all 0.2s;" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'" onmouseout="this.style.background='none'">
              Sign Up
            </button>
          </div>
        </div>
      </div>
      
      <style>
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </div>
  `;
}

// EVENT HANDLERS & MORE SCREENS TO BE ADDED...
// Continuing the build:

// ============================================================================
// SCREEN HTML: SIGNUP  
// ============================================================================
function getSignupScreen() {
  return `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 20px; display: flex; flex-direction: column; overflow-y: auto;">
      <button id="backBtn" style="align-self: flex-start; background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; cursor: pointer;">
        ← Back
      </button>
      
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 400px; margin: 0 auto; width: 100%;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 100px; height: 100px; background: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; padding: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
            <img src="logo.png" alt="UrbanEzii Logo" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <h1 style="color: white; font-size: 32px; font-weight: 700; margin-bottom: 8px;">Create Account</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px;">Join UrbanEzii today</p>
        </div>
        
        <div style="background: white; border-radius: 24px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <div id="signupError" style="display: none; background: #fee; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;"></div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Full Name</label>
            <input type="text" id="signupName" placeholder="John Doe" style="width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; outline: none;" />
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Email</label>
            <input type="email" id="signupEmail" placeholder="your@email.com" style="width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; outline: none;" />
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Phone</label>
            <input type="tel" id="signupPhone" placeholder="+91 98765 43210" style="width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; outline: none;" />
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Password</label>
            <div style="position: relative;">
              <input type="password" id="signupPassword" placeholder="Minimum 6 characters" style="width: 100%; padding: 14px 50px 14px 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; outline: none;" />
              <button type="button" id="toggleSignupPassword" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 20px; cursor: pointer; padding: 4px;">👁️</button>
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">I am a</label>
            <select id="signupRole" style="width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; outline: none;">
              <option value="customer">Customer</option>
              <option value="provider">Service Provider</option>
            </select>
          </div>
          
          <!-- Location Capture (Required for Providers) -->
          <div id="locationSection" style="margin-bottom: 20px; padding: 16px; background: #f0f9ff; border-radius: 12px; border: 2px solid rgba(59, 130, 246, 0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label style="font-size: 13px; font-weight: 700; color: #333;">
                Location <span id="locationRequired" style="color: #dc2626; font-size: 11px;">(Required for providers)</span>
              </label>
              <span id="locationStatus" style="font-size: 11px; font-weight: 600; color: #999;">Not captured</span>
            </div>
            <button type="button" id="getLocationBtn" style="width: 100%; padding: 12px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span id="locationBtnText">Get Location</span>
            </button>
            <div id="locationError" style="display: none; margin-top: 8px; font-size: 12px; color: #dc2626;"></div>
          </div>
          
          <button id="signupBtn" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer;">
            Create Account
          </button>
        </div>
      </div>
    </div>
  `;
}

// EVENT HANDLERS & MORE SCREENS TO BE ADDED...
// Continuing the build:

// Auth Handlers
function attachLoginHandlers() {
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('goToSignup').addEventListener('click', () => showScreen('signup'));
  const passwordInput = document.getElementById('loginPassword');
  const toggleBtn = document.getElementById('toggleLoginPassword');
  toggleBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleBtn.textContent = '';
    } else {
      passwordInput.type = 'password';
      toggleBtn.textContent = '';
    }
  });
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  
  if (!email || !password) {
    errorDiv.textContent = 'Please fill in all fields';
    errorDiv.style.display = 'block';
    return;
  }
  
  btn.textContent = 'Signing in...';
  btn.disabled = true;
  errorDiv.style.display = 'none';
  
  // Add timeout to prevent hanging
  const loginTimeout = setTimeout(() => {
    btn.textContent = 'Sign In';
    btn.disabled = false;
    errorDiv.textContent = 'Login timeout. Please try again.';
    errorDiv.style.display = 'block';
  }, 10000); // 10 second timeout
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    clearTimeout(loginTimeout);
  } catch (error) {
    clearTimeout(loginTimeout);
    console.error('Login error:', error);
    errorDiv.textContent = error.message.replace('Firebase: ', '');
    errorDiv.style.display = 'block';
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
}

function attachSignupHandlers() {
  document.getElementById('signupBtn').addEventListener('click', handleSignup);
  document.getElementById('backBtn').addEventListener('click', () => showScreen('login'));
  
  // Password toggle
  const passwordInput = document.getElementById('signupPassword');
  const toggleBtn = document.getElementById('toggleSignupPassword');
  toggleBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleBtn.textContent = '🙈';
    } else {
      passwordInput.type = 'password';
      toggleBtn.textContent = '👁️';
    }
  });
  
  // Location capture button
  const getLocationBtn = document.getElementById('getLocationBtn');
  getLocationBtn.addEventListener('click', captureLocation);
  
  // Role change handler (show/hide location requirement)
  const roleSelect = document.getElementById('signupRole');
  roleSelect.addEventListener('change', (e) => {
    const locationRequired = document.getElementById('locationRequired');
    if (e.target.value === 'provider') {
      locationRequired.style.display = 'inline';
      locationRequired.textContent = '(Required for providers)';
    } else {
      locationRequired.style.display = 'inline';
      locationRequired.textContent = '(Optional)';
    }
  });
}

// Capture user location (SAME AS WEB APP)
function captureLocation() {
  const locationBtn = document.getElementById('getLocationBtn');
  const locationBtnText = document.getElementById('locationBtnText');
  const locationStatus = document.getElementById('locationStatus');
  const locationError = document.getElementById('locationError');
  
  locationError.style.display = 'none';
  
  if (!navigator.geolocation) {
    locationError.textContent = 'Geolocation is not supported by your device';
    locationError.style.display = 'block';
    return;
  }
  
  locationBtnText.textContent = 'Getting location...';
  locationBtn.disabled = true;
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      // Store in localStorage
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
      
      locationStatus.textContent = '✅ Captured';
      locationStatus.style.color = '#10b981';
      locationBtnText.textContent = '✓ Location Captured';
      locationBtn.style.background = '#10b981';
      locationBtn.style.color = 'white';
      locationBtn.style.borderColor = '#10b981';
      
      console.log('📍 Location captured:', userLocation);
    },
    (error) => {
      console.error('Location error:', error);
      locationError.textContent = 'Could not get location. Please enable location access in settings.';
      locationError.style.display = 'block';
      locationBtnText.textContent = 'Retry';
      locationBtn.disabled = false;
    }
  );
}

async function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const password = document.getElementById('signupPassword').value;
  const role = document.getElementById('signupRole').value;
  const errorDiv = document.getElementById('signupError');
  const btn = document.getElementById('signupBtn');
  
  if (!name || !email || !password || !phone) {
    errorDiv.textContent = 'Please fill in all required fields';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Location validation (SAME AS WEB APP)
  if (role === 'provider' && !userLocation) {
    errorDiv.textContent = 'Location is required for service providers. Please click "Get Location"';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (password.length < 6) {
    errorDiv.textContent = 'Password must be at least 6 characters';
    errorDiv.style.display = 'block';
    return;
  }
  
  btn.textContent = 'Creating account...';
  btn.disabled = true;
  errorDiv.style.display = 'none';
  
  // Add timeout to prevent hanging
  const signupTimeout = setTimeout(() => {
    btn.textContent = 'Sign Up';
    btn.disabled = false;
    errorDiv.textContent = 'Signup timeout. Please try again.';
    errorDiv.style.display = 'block';
  }, 15000); // 15 second timeout for signup
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    clearTimeout(signupTimeout);
    const user = userCredential.user;
    
    // Prepare user data (SAME AS WEB APP)
    const collectionName = role === 'provider' ? 'providers' : 'customers';
    const userData = {
      name: name,
      email: email,
      phone: phone,
      role: role,
      createdAt: new Date()
    };
    
    // Add location if provided (SAME AS WEB APP)
    if (userLocation) {
      userData.location = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      };
    }
    
    await setDoc(doc(db, collectionName, user.uid), userData);
    
    console.log('✅ Signup successful with location:', userLocation);
    
    // The onAuthStateChanged listener will handle the redirect
  } catch (error) {
    clearTimeout(signupTimeout);
    console.error('Signup error:', error);
    errorDiv.textContent = error.message.replace('Firebase: ', '');
    errorDiv.style.display = 'block';
    btn.textContent = 'Create Account';
    btn.disabled = false;
  }
}

// ============================================================================
// CUSTOMER HOME SCREEN
// ============================================================================
function getHomeScreen() {
  const userName = localStorage.getItem('userName') || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  
  // Get location from localStorage (SAME AS WEB APP)
  const locationData = localStorage.getItem('userLocation');
  let locationText = 'Set Location';
  if (locationData) {
    try {
      const loc = JSON.parse(locationData);
      locationText = `📍 ${loc.latitude.toFixed(2)}, ${loc.longitude.toFixed(2)}`;
    } catch (e) {
      locationText = 'Set Location';
    }
  }
  
  return `
    <div style="min-height: 100vh; background: #f5f7fa; padding-bottom: 90px;">
      <!-- Professional Header like Swiggy -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px 16px 20px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <!-- Logo + User Name -->
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <div style="width: 44px; height: 44px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <img src="logo.png" alt="UrbanEzii" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div style="flex: 1;">
              <div style="font-size: 12px; opacity: 0.85; font-weight: 500; margin-bottom: 2px;">Hey ${userName}! 👋</div>
              <div style="font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">What do you need?</div>
            </div>
          </div>
          
          <!-- User Avatar with Initial -->
          <button onclick="window.mobileApp.showScreen('customer-profile')" style="width: 44px; height: 44px; background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.4); border-radius: 50%; color: white; font-size: 18px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            ${userInitial}
          </button>
        </div>
        
        <!-- Location Display (SAME AS WEB APP) -->
        <button onclick="window.mobileApp.updateLocation()" style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 12px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; margin-bottom: 12px; backdrop-filter: blur(10px); transition: all 0.3s;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${locationText}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        
        <!-- Professional Search Bar -->
        <div onclick="window.mobileApp.showScreen('services')" style="background: white; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.2s;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
          <span style="flex: 1; color: #999; font-size: 15px; font-weight: 500;">Search for services...</span>
        </div>
      </div>
      
      <!-- Professional Service Cards -->
      <div style="padding: 20px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 20px; font-weight: 800; color: #1a1a2e;">All Services</h3>
          <span style="font-size: 13px; color: #3b82f6; font-weight: 600;">View All →</span>
        </div>
        
        <!-- Premium Service Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
          ${SERVICES.map(service => `
            <div onclick="window.mobileApp.selectService('${service.id}')" style="background: white; border-radius: 18px; padding: 18px 12px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;">
              <!-- Icon Container -->
              <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 8px 16px rgba(59, 130, 246, 0.25); position: relative; z-index: 2;">
                ${service.icon}
              </div>
              <!-- Service Name -->
              <div style="font-size: 12px; font-weight: 700; color: #1a1a2e; text-align: center; line-height: 1.4; position: relative; z-index: 2;">${service.name}</div>
              <!-- Hover Gradient Overlay -->
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%); opacity: 0; transition: opacity 0.3s;"></div>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${getBottomNav('home')}
    </div>
  `;
}

// Professional Floating Bottom Navigation
function getBottomNav(active) {
  const isHome = active === 'home';
  const isServices = active === 'services';
  const isBookings = active === 'bookings';
  const isMore = active === 'more';
  
  return `
    <!-- Floating Bottom Nav with Shadow -->
    <div style="position: fixed; bottom: 16px; left: 16px; right: 16px; background: white; border-radius: 24px; display: flex; justify-content: space-around; padding: 12px 8px; z-index: 100; box-shadow: 0 8px 32px rgba(0,0,0,0.12); backdrop-filter: blur(10px);">
      <!-- Home -->
      <div onclick="window.mobileApp.showScreen('home')" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        ${isHome ? '<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 3px;"></div>' : ''}
        <div style="width: 48px; height: 36px; background: ${isHome ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${isHome ? 'white' : 'none'}" stroke="${isHome ? 'white' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <div style="font-size: 11px; font-weight: ${isHome ? '700' : '600'}; color: ${isHome ? '#3b82f6' : '#999'};">Home</div>
      </div>
      
      <!-- Services -->
      <div onclick="window.mobileApp.showScreen('services')" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        ${isServices ? '<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 3px;"></div>' : ''}
        <div style="width: 48px; height: 36px; background: ${isServices ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isServices ? 'white' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
        </div>
        <div style="font-size: 11px; font-weight: ${isServices ? '700' : '600'}; color: ${isServices ? '#3b82f6' : '#999'};">Services</div>
      </div>
      
      <!-- Bookings -->
      <div onclick="window.mobileApp.showScreen('customer-bookings')" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        ${isBookings ? '<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 3px;"></div>' : ''}
        <div style="width: 48px; height: 36px; background: ${isBookings ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isBookings ? 'white' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <div style="font-size: 11px; font-weight: ${isBookings ? '700' : '600'}; color: ${isBookings ? '#3b82f6' : '#999'};">Bookings</div>
      </div>
      
      <!-- More -->
      <div onclick="window.mobileApp.toggleCustomerMenu()" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        ${isMore ? '<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 3px;"></div>' : ''}
        <div style="width: 48px; height: 36px; background: ${isMore ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isMore ? 'white' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>
        <div style="font-size: 11px; font-weight: ${isMore ? '700' : '600'}; color: ${isMore ? '#3b82f6' : '#999'};">More</div>
      </div>
    </div>
  `;
}

// ============================================================================
// SERVICES LIST SCREEN
// ============================================================================
function getServicesScreen() {
  return `
    <div style="min-height: 100vh; background: #f5f7fa; padding-bottom: 90px;">
      <!-- Professional Header -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px 16px 20px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px;">
          <button onclick="window.mobileApp.showScreen('home')" class="back-btn" style="background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.3); color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.3s ease;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h2 style="font-size: 24px; font-weight: 800; flex: 1; letter-spacing: 0.3px;">All Services</h2>
        </div>
      </div>
      
      <!-- Professional Service Grid -->
      <div style="padding: 20px 16px;">
        <p style="font-size: 14px; color: #666; margin-bottom: 20px; font-weight: 500; animation: fadeInUp 0.6s ease;">Select a service to find professionals near you</p>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
          ${SERVICES.map((service, index) => `
            <div class="service-card" onclick="window.mobileApp.selectService('${service.id}')" style="background: white; border-radius: 20px; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; gap: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); cursor: pointer; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; overflow: hidden; animation: fadeInUp 0.6s ease ${index * 0.1}s backwards;">
              <!-- Background Gradient -->
              <div class="service-card-bg" style="position: absolute; top: 0; left: 0; right: 0; height: 60%; background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%); border-radius: 20px 20px 60% 60%; transition: all 0.4s ease;"></div>
              
              <!-- Icon -->
              <div class="service-icon" style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 36px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); position: relative; z-index: 2; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
                ${service.icon}
              </div>
              
              <!-- Service Name -->
              <div style="font-size: 14px; font-weight: 700; color: #1a1a2e; text-align: center; line-height: 1.4; position: relative; z-index: 2;">${service.name}</div>
              
              <!-- Arrow Indicator -->
              <div class="service-arrow" style="position: absolute; bottom: 12px; right: 12px; width: 28px; height: 28px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
              
              <!-- Ripple Effect Container -->
              <div class="ripple-container" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; border-radius: 20px; pointer-events: none;"></div>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${getBottomNav('services')}
      ${getInteractiveStyles()}
    </div>
  `;
}

// ============================================================================
// SERVICE DETAIL SCREEN (Provider Listings)
// ============================================================================
function getServiceDetailScreen() {
  if (!selectedService) return '';
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 20px;">
      <!-- Professional Header with Back Button -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px 16px 24px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <!-- Highlighted Back Button -->
          <button onclick="window.mobileApp.showScreen('services')" class="back-btn" style="background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.4); color: white; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); flex-shrink: 0;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          
          <!-- Service Name (No icon) -->
          <div style="flex: 1; animation: fadeInUp 0.5s ease;">
            <div style="font-size: 12px; opacity: 0.85; font-weight: 500; margin-bottom: 4px;">Service Category</div>
            <h2 style="font-size: 22px; font-weight: 800; letter-spacing: 0.3px;">${selectedService.name}</h2>
          </div>
        </div>
      </div>
      
      <!-- Providers List -->
      <div style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; animation: fadeInUp 0.6s ease;">
          <h3 style="font-size: 18px; font-weight: 700; color: #333;">Available Providers</h3>
        </div>
        <div id="providersContainer">
          ${getBeautifulLoader('Loading providers...', false, 'medium')}
        </div>
      </div>
      
      ${getInteractiveStyles()}
      
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
}

// ============================================================================
// CUSTOMER PROFILE SCREEN
// ============================================================================
function getCustomerProfileScreen() {
  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userPhone = localStorage.getItem('userPhone') || '';
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 40px 16px;">
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto 16px;">👤</div>
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">${userName}</h2>
          <p style="font-size: 14px; opacity: 0.9;">${userEmail}</p>
        </div>
      </div>
      
      <div style="padding: 16px;">
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          ${userPhone ? `
          <div style="padding: 16px; border-bottom: 1px solid #eee;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Phone</div>
            <div style="font-size: 14px; color: #333; font-weight: 500;">${userPhone}</div>
          </div>
          ` : ''}
          <button onclick="window.mobileApp.handleLogout()" style="width: 100%; padding: 16px; border: none; background: white; display: flex; align-items: center; gap: 12px; cursor: pointer; color: #dc2626;">
            <span style="font-size: 20px;">🚪</span>
            <span style="flex: 1; text-align: left; font-size: 14px; font-weight: 500;">Logout</span>
          </button>
        </div>
      </div>
      
      ${getBottomNav('profile')}
    </div>
  `;
}

// ============================================================================
// CUSTOMER BOOKINGS SCREEN
// ============================================================================
function getCustomerBookingsScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px;">
        <h2 style="font-size: 20px; font-weight: 700;">My Bookings</h2>
      </div>
      
      <div style="padding: 16px;">
        <div id="bookingsContainer">
          <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 60px; margin-bottom: 16px;">📅</div>
            <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">No bookings yet</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 24px;">Book a service to see your bookings here</p>
            <button onclick="window.mobileApp.showScreen('services')" style="padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;">Browse Services</button>
          </div>
        </div>
      </div>
      
      ${getBottomNav('bookings')}
    </div>
  `;
}

// ============================================================================
// PROVIDER EARNINGS SCREEN
// ============================================================================
function getProviderEarningsScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px;">
        <h2 style="font-size: 20px; font-weight: 700;">Earnings</h2>
        <p style="font-size: 13px; opacity: 0.9; margin-top: 8px;">Track your income and payment history</p>
      </div>
      
      <div style="padding: 16px;">
        <div id="earningsContainer">
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
            <p style="color: #666;">Loading earnings...</p>
          </div>
        </div>
      </div>
      
      ${getProviderBottomNav('earnings')}
    </div>
  `;
}

// ============================================================================
// PROVIDER REVIEWS SCREEN
// ============================================================================
function getProviderReviewsScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px;">
        <h2 style="font-size: 20px; font-weight: 700;">Reviews & Ratings</h2>
        <p style="font-size: 13px; opacity: 0.9; margin-top: 8px;">Customer feedback and ratings</p>
      </div>
      
      <div style="padding: 16px;">
        <div id="reviewsContainer">
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
            <p style="color: #666;">Loading reviews...</p>
          </div>
        </div>
      </div>
      
      ${getProviderBottomNav('reviews')}
    </div>
  `;
}

// ============================================================================
// PROVIDER DOCUMENTS SCREEN
// ============================================================================
function getProviderDocumentsScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px;">
        <h2 style="font-size: 20px; font-weight: 700;">Documents</h2>
        <p style="font-size: 13px; opacity: 0.9; margin-top: 8px;">Manage your verification documents</p>
      </div>
      
      <div style="padding: 16px;">
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 60px; margin-bottom: 16px;">📄</div>
          <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">Documents</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 24px;">Upload feature coming soon</p>
        </div>
      </div>
      
      ${getProviderBottomNav('documents')}
    </div>
  `;
}

// ============================================================================
// PROVIDER SETTINGS SCREEN
// ============================================================================
function getProviderSettingsScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px;">
        <h2 style="font-size: 20px; font-weight: 700;">Settings</h2>
        <p style="font-size: 13px; opacity: 0.9; margin-top: 8px;">Manage your account preferences</p>
      </div>
      
      <div style="padding: 16px;">
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <div style="padding: 16px; border-bottom: 1px solid #eee;">
            <h4 style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 4px;">Notifications</h4>
            <p style="font-size: 12px; color: #666;">Manage notification preferences</p>
          </div>
          <div style="padding: 16px; border-bottom: 1px solid #eee;">
            <h4 style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 4px;">Privacy</h4>
            <p style="font-size: 12px; color: #666;">Privacy and security settings</p>
          </div>
          <div style="padding: 16px;">
            <h4 style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 4px;">Help & Support</h4>
            <p style="font-size: 12px; color: #666;">Get help and contact support</p>
          </div>
        </div>
      </div>
      
      ${getProviderBottomNav('settings')}
    </div>
  `;
}

// ============================================================================
// SETUP WIZARD SCREEN
// ============================================================================
function getSetupWizardScreen() {
  const progress = (wizardStep / 4) * 100;
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa;">
      <!-- Progress Header -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 20px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h1 style="font-size: 20px; font-weight: 700;">Complete Your Profile</h1>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.mobileApp.skipWizard()" style="background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); color: white; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(10px);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              Skip
            </button>
            <button onclick="window.mobileApp.logout()" style="background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4); color: white; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(10px);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </button>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
          <span>Step ${wizardStep} of 4</span>
          <span>${Math.round(progress)}%</span>
        </div>
        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.3); border-radius: 3px; overflow: hidden;">
          <div style="width: ${progress}%; height: 100%; background: white; transition: width 0.3s;"></div>
        </div>
        
        <!-- Step indicators -->
        <div style="display: flex; justify-content: space-around; margin-top: 16px;">
          ${[1,2,3,4].map(step => `
            <div style="text-align: center; flex: 1;">
              <div style="width: 36px; height: 36px; margin: 0 auto 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; ${step === wizardStep ? 'background: white; color: #3b82f6;' : step < wizardStep ? 'background: rgba(255,255,255,0.3); color: white;' : 'background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);'}">
                ${step < wizardStep ? '✓' : step}
              </div>
              <div style="font-size: 10px; opacity: 0.9;">${['Business', 'Services', 'Availability', 'Documents'][step-1]}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Step Content -->
      <div style="padding: 16px; padding-bottom: 100px;">
        ${wizardStep === 1 ? getWizardStep1() : ''}
        ${wizardStep === 2 ? getWizardStep2() : ''}
        ${wizardStep === 3 ? getWizardStep3() : ''}
        ${wizardStep === 4 ? getWizardStep4() : ''}
      </div>
      
      <!-- Navigation Buttons -->
      <div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #eee; padding: 16px; display: flex; gap: 12px;">
        ${wizardStep > 1 ? `
          <button onclick="window.mobileApp.wizardPrevStep()" style="flex: 1; padding: 14px; background: #e5e7eb; color: #333; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
            ← Back
          </button>
        ` : ''}
        <button id="wizardNextBtn" onclick="window.mobileApp.wizardNextStep()" style="flex: ${wizardStep > 1 ? 2 : 1}; padding: 14px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
          ${wizardStep === 4 ? 'Complete Setup' : 'Next →'}
        </button>
      </div>
    </div>
  `;
}

// ============================================================================
// WIZARD STEP 1: BUSINESS INFORMATION
// ============================================================================
function getWizardStep1() {
  const data = wizardData.step1;
  
  return `
    <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">Business Information</h3>
      <p style="font-size: 13px; color: #666; margin-bottom: 24px;">Tell us about your company or brand</p>
      
      <div id="wizardError" style="display: none; background: #fee; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;"></div>
      
      <!-- Company Name -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Company / Brand Name *</label>
        <input type="text" id="companyName" value="${data.companyName || ''}" placeholder="Enter your business name" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;" />
      </div>
      
      <!-- Business Type -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Business Type *</label>
        <div style="display: flex; gap: 12px;">
          ${['individual', 'firm', 'company'].map(type => `
            <label style="flex: 1; padding: 12px; border: 2px solid ${data.businessType === type ? '#3b82f6' : '#e5e7eb'}; border-radius: 8px; text-align: center; cursor: pointer; background: ${data.businessType === type ? '#f0f4ff' : 'white'};">
              <input type="radio" name="businessType" value="${type}" ${data.businessType === type ? 'checked' : ''} style="display: none;" />
              <div style="font-size: 14px; font-weight: 600; color: ${data.businessType === type ? '#3b82f6' : '#333'}; text-transform: capitalize;">${type}</div>
            </label>
          `).join('')}
        </div>
      </div>
      
      <!-- City -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">City *</label>
        <input type="text" id="city" value="${data.city || ''}" placeholder="e.g., Bangalore" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;" />
      </div>
      
      <!-- Address -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Address (Optional)</label>
        <textarea id="address" rows="2" placeholder="Enter your business address"  style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; resize: vertical;">${data.address || ''}</textarea>
      </div>
      
      <!-- Business Description -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Business Description *</label>
        <textarea id="businessDescription" rows="4" placeholder="Tell customers about your business (min 20 characters)" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; resize: vertical;">${data.businessDescription || ''}</textarea>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">
          <span id="descCount">${(data.businessDescription || '').length}</span>/20 minimum
        </div>
      </div>
      
      <!-- Location Capture (Required for all providers) -->
      <div id="wizardLocationSection" style="margin-bottom: 0; padding: 16px; background: #f0f9ff; border-radius: 12px; border: 2px solid rgba(59, 130, 246, 0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label style="font-size: 13px; font-weight: 700; color: #333;">
            Business Location * 
            <span style="color: #dc2626; font-size: 11px;">(Required)</span>
          </label>
          <span id="wizardLocationStatus" style="font-size: 11px; font-weight: 600; color: ${data.location ? '#10b981' : '#999'};">
            ${data.location ? '✅ Captured' : 'Not captured'}
          </span>
        </div>
        <button type="button" id="wizardGetLocationBtn" style="width: 100%; padding: 12px; background: ${data.location ? '#10b981' : 'white'}; color: ${data.location ? 'white' : '#3b82f6'}; border: 2px solid ${data.location ? '#10b981' : '#3b82f6'}; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${data.location ? 'white' : '#3b82f6'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span id="wizardLocationBtnText">${data.location ? '✓ Location Captured' : 'Get Location'}</span>
        </button>
        <div id="wizardLocationError" style="display: none; margin-top: 8px; font-size: 12px; color: #dc2626;"></div>
      </div>
    </div>
  `;
}

// ============================================================================
// WIZARD STEP 2: SERVICES & PRICING
// ============================================================================
function getWizardStep2() {
  const selectedServices = wizardData.step2.services || [];
  
  return `
    <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">Services Offered</h3>
      <p style="font-size: 13px; color: #666; margin-bottom: 20px;">Select service categories and add pricing for each subcategory.</p>
      
      <div id="wizardError" style="display: none; background: #fee; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;"></div>
      
      <!-- Experience -->
      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Years of Experience</label>
        <select id="experience" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; background: white;">
          <option value="">Select experience</option>
          <option value="0-1 years" ${wizardData.step2.experience === '0-1 years' ? 'selected' : ''}>0-1 years</option>
          <option value="1-3 years" ${wizardData.step2.experience === '1-3 years' ? 'selected' : ''}>1-3 years</option>
          <option value="3-5 years" ${wizardData.step2.experience === '3-5 years' ? 'selected' : ''}>3-5 years</option>
          <option value="5-10 years" ${wizardData.step2.experience === '5-10 years' ? 'selected' : ''}>5-10 years</option>
          <option value="10+ years" ${wizardData.step2.experience === '10+ years' ? 'selected' : ''}>10+ years</option>
        </select>
      </div>
      
      <!-- Service Categories (Expandable) -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 12px;">Services Offered *</label>
        <p style="font-size: 12px; color: #666; margin-bottom: 12px;">Select service categories and set prices.</p>
        
        <div id="serviceCategoriesContainer">
          ${Object.keys(SERVICE_CATEGORIES).map(category => {
            const categoryService = selectedServices.find(s => s.category === category);
            const isExpanded = expandedCategories.includes(category);
            const hasSelectedSubcategories = categoryService && categoryService.subcategories.length > 0;
            
            return `
              <div style="background: ${hasSelectedSubcategories ? '#f0f4ff' : '#f9fafb'}; border: 2px solid ${hasSelectedSubcategories ? '#3b82f6' : '#e5e7eb'}; border-radius: 12px; margin-bottom: 12px; overflow: hidden;">
                <!-- Category Header -->
                <div onclick="window.mobileApp.toggleWizardCategory('${category}')" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <input type="checkbox" ${hasSelectedSubcategories ? 'checked' : ''} onclick="event.stopPropagation(); window.mobileApp.toggleCategorySelection('${category}')" style="width: 18px; height: 18px; cursor: pointer;" />
                    <div>
                      <div style="font-size: 15px; font-weight: 700; color: #333;">${category}</div>
                      ${hasSelectedSubcategories ? `<div style="font-size: 12px; color: #3b82f6; margin-top: 2px;">${categoryService.subcategories.length} selected</div>` : ''}
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${isExpanded ? '180' : '0'}deg); transition: transform 0.3s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                
                <!-- Subcategories (Expandable) -->
                ${isExpanded ? `
                  <div style="border-top: 1px solid ${hasSelectedSubcategories ? '#3b82f6' : '#e5e7eb'}; padding: 12px 16px; background: white;">
                    <p style="font-size: 12px; color: #666; margin-bottom: 12px;">Select services and set prices:</p>
                    ${SERVICE_CATEGORIES[category].map((subcategory, idx) => {
                      const subcatData = categoryService?.subcategories.find(s => s.name === subcategory);
                      const isSelected = !!subcatData;
                      const price = subcatData?.price || 500;
                      
                      return `
                        <div style="display: flex; align-items: center; gap: 12px; padding: 10px; margin-bottom: 8px; background: ${isSelected ? '#f0f4ff' : '#f9fafb'}; border: 1px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}; border-radius: 8px;">
                          <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="window.mobileApp.toggleSubcategory('${category}', '${subcategory}')" style="width: 16px; height: 16px; cursor: pointer; flex-shrink: 0;" />
                          <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 13px; color: #333; font-weight: ${isSelected ? '600' : '500'};">${subcategory}</div>
                          </div>
                          <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                            <span style="font-size: 13px; color: #666;">₹</span>
                            <input type="number" value="${price}" ${!isSelected ? 'disabled' : ''} onchange="window.mobileApp.updateSubcategoryPrice('${category}', '${subcategory}', this.value)" style="width: 70px; padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; outline: none; background: ${isSelected ? 'white' : '#f3f4f6'};" />
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// WIZARD STEP 3: AVAILABILITY & HOURS
// ============================================================================
function getWizardStep3() {
  const data = wizardData.step3;
  const availability = data.availability || [];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return `
    <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">Availability & Pricing</h3>
      <p style="font-size: 13px; color: #666; margin-bottom: 24px;">Set your working days and hours</p>
      
      <div id="wizardError" style="display: none; background: #fee; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;"></div>
      
      <!-- Working Days -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 12px;">Working Days * (select at least one)</label>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          ${weekDays.map(day => {
            const isSelected = availability.includes(day);
            return `
              <label style="padding: 12px; border: 2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}; border-radius: 8px; text-align: center; cursor: pointer; background: ${isSelected ? '#f0f4ff' : 'white'};">
                <input type="checkbox" name="availability" value="${day}" ${isSelected ? 'checked' : ''} style="display: none;" />
                <div style="font-size: 13px; font-weight: 600; color: ${isSelected ? '#3b82f6' : '#333'};">${day}</div>
              </label>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Working Hours -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Working Hours *</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">Start Time</label>
            <input type="time" id="workStart" value="${data.workingHours?.start || '09:00'}" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;" />
          </div>
          <div>
            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">End Time</label>
            <input type="time" id="workEnd" value="${data.workingHours?.end || '18:00'}" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;" />
          </div>
        </div>
      </div>
      
      <!-- Price Range -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Price Range *</label>
        <select id="priceRange" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;">
          <option value="">Select price range</option>
          <option value="₹0-500" ${data.priceRange === '₹0-500' ? 'selected' : ''}>₹0-500</option>
          <option value="₹500-1000" ${data.priceRange === '₹500-1000' ? 'selected' : ''}>₹500-1000</option>
          <option value="₹1000-2000" ${data.priceRange === '₹1000-2000' ? 'selected' : ''}>₹1000-2000</option>
          <option value="₹2000-5000" ${data.priceRange === '₹2000-5000' ? 'selected' : ''}>₹2000-5000</option>
          <option value="₹5000+" ${data.priceRange === '₹5000+' ? 'selected' : ''}>₹5000+</option>
        </select>
      </div>
    </div>
  `;
}

// ============================================================================
// WIZARD STEP 4: DOCUMENTS & TERMS
// ============================================================================
function getWizardStep4() {
  return `
    <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">Documents & Terms</h3>
      <p style="font-size: 13px; color: #666; margin-bottom: 24px;">Upload documents and accept terms</p>
      
      <div id="wizardError" style="display: none; background: #fee; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;"></div>
      
      <div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="font-size: 24px;">ℹ️</div>
          <div style="flex: 1;">
            <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 4px;">Document Upload Coming Soon</div>
            <div style="font-size: 13px; color: #666; line-height: 1.5;">
              For now, you can complete registration without documents. Our team will contact you for verification.
            </div>
          </div>
        </div>
      </div>
      
      <!-- Terms & Conditions -->
      <div style="margin-bottom: 16px;">
        <label style="display: flex; align-items: start; gap: 12px; cursor: pointer; padding: 16px; border: 2px solid #e5e7eb; border-radius: 8px; background: white;">
          <input type="checkbox" id="termsAccepted" ${wizardData.step4.termsAccepted ? 'checked' : ''} style="margin-top: 2px;" />
          <div style="flex: 1; font-size: 13px; color: #666; line-height: 1.6;">
            I agree to the <a href="#" style="color: #3b82f6; text-decoration: underline;">Terms & Conditions</a> and <a href="#" style="color: #3b82f6; text-decoration: underline;">Privacy Policy</a>. I understand that UrbanEzii will verify my details before activating my account.
          </div>
        </label>
      </div>
      
      <!-- Summary -->
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <h4 style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px;">📋 Profile Summary</h4>
        <div style="font-size: 13px; color: #666; line-height: 2;">
          <div>✓ Business: ${wizardData.step1.companyName || 'Not set'}</div>
          <div>✓ Services: ${wizardData.step2.services?.length || 0} selected</div>
          <div>✓ Availability: ${wizardData.step3.availability?.length || 0} days</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// ABOUT US SCREEN
// ============================================================================
function getAboutScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 20px 16px;">
        <button onclick="window.mobileApp.showScreen('home')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; cursor: pointer;">← Back</button>
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">About UrbanEzii</h1>
        <p style="font-size: 14px; opacity: 0.95;">Your trusted platform for home services</p>
      </div>
      
      <div style="padding: 20px;">
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
          <h2 style="font-size: 22px; font-weight: 700; color: #333; margin-bottom: 12px;">Our Mission</h2>
          <p style="font-size: 15px; color: #666; line-height: 1.6;">
            At UrbanEzii, we believe that finding reliable home services should be simple, safe, and stress-free. 
            Our mission is to connect homeowners with trusted local professionals, making everyday life easier for everyone.
          </p>
        </div>
        
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
          <h2 style="font-size: 22px; font-weight: 700; color: #333; margin-bottom: 12px;">Our Story</h2>
          <p style="font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 12px;">
            Founded in 2024, UrbanEzii was born out of a simple frustration: why is it so hard to find a reliable plumber, electrician, or cleaner? 
            We set out to create a platform that would solve this problem once and for all.
          </p>
          <p style="font-size: 15px; color: #666; line-height: 1.6;">
            Today, we're proud to serve thousands of customers across the city, connecting them with verified, skilled professionals for all their home service needs.
          </p>
        </div>
        
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
          <div style="display: flex; align-items: start; gap: 16px; margin-bottom: 20px;">
            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">👥</div>
            <div>
              <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 6px;">Who We Are</h3>
              <p style="font-size: 14px; color: #666; line-height: 1.6;">We are a team of innovators passionate about solving everyday urban challenges with technology.</p>
            </div>
          </div>
          
          <div style="display: flex; align-items: start; gap: 16px;">
            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">🎯</div>
            <div>
              <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 6px;">What We Do</h3>
              <p style="font-size: 14px; color: #666; line-height: 1.6;">We bridge the gap between skilled local professionals and residents in need of their services.</p>
            </div>
          </div>
        </div>
      </div>
      
      ${getBottomNav('about')}
    </div>
  `;
}

// ============================================================================
// FEATURES SCREEN
// ============================================================================
function getFeaturesScreen() {
  const features = [
    { icon: '🔍', title: 'Wide Range of Services', desc: 'From plumbing and electrical work to cleaning and cooking, find trusted professionals for all your home needs in one place.' },
    { icon: '⚡', title: 'Quick & Easy Booking', desc: 'Our streamlined booking process lets you schedule a service in just a few clicks. No more endless phone calls.' },
    { icon: '🤖', title: 'AI-Powered Suggestions', desc: 'Not happy with a provider? Our smart assistant suggests the best alternatives based on ratings, distance, and your preferences.' },
    { icon: '🛡️', title: 'Verified Professionals', desc: 'Every service provider on our platform is background-checked and verified to ensure your safety and peace of mind.' }
  ];
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 20px 16px;">
        <button onclick="window.mobileApp.showScreen('home')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; cursor: pointer;">← Back</button>
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Why Choose UrbanEzii?</h1>
        <p style="font-size: 14px; opacity: 0.95;">Everything you need to manage your home services, simplified.</p>
      </div>
      
      <div style="padding: 20px;">
        ${features.map(f => `
          <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
            <div style="display: flex; align-items: start; gap: 16px;">
              <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;">${f.icon}</div>
              <div style="flex: 1;">
                <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">${f.title}</h3>
                <p style="font-size: 14px; color: #666; line-height: 1.6;">${f.desc}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${getBottomNav('features')}
    </div>
  `;
}

// ============================================================================
// PRICING SCREEN
// ============================================================================
function getPricingScreen() {
  const plans = [
    {
      name: 'For Users',
      price: 'Free',
      desc: 'Access a world of convenience with no hidden fees.',
      features: ['Browse unlimited services', 'Book verified professionals', 'Use AI Assistant for suggestions', 'Secure and easy payments']
    },
    {
      name: 'For Providers',
      price: 'Commission-Based',
      desc: 'Grow your business by only paying for the work you get.',
      features: ['List your services', 'Reach thousands of customers', 'Easy booking management', 'Secure and timely payouts']
    }
  ];
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 20px 16px;">
        <button onclick="window.mobileApp.showScreen('home')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; cursor: pointer;">← Back</button>
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Simple, Transparent Pricing</h1>
        <p style="font-size: 14px; opacity: 0.95;">No surprises. Just great service at a fair price.</p>
      </div>
      
      <div style="padding: 20px;">
        ${plans.map(plan => `
          <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px;">
            <h2 style="font-size: 22px; font-weight: 700; color: #333; margin-bottom: 8px;">${plan.name}</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 16px;">${plan.desc}</p>
            <div style="font-size: 32px; font-weight: 700; color: #3b82f6; margin-bottom: 4px;">${plan.price}</div>
            ${plan.name === 'For Providers' ? '<p style="font-size: 13px; color: #999; margin-bottom: 20px;">/ per completed job</p>' : '<div style="margin-bottom: 20px;"></div>'}
            <ul style="list-style: none; padding: 0;">
              ${plan.features.map(f => `
                <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 12px;">
                  <span style="color: #10b981; font-size: 20px;">✓</span>
                  <span style="font-size: 14px; color: #333;">${f}</span>
                </li>
              `).join('')}
            </ul>
            <button style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; margin-top: 20px; cursor: pointer;">
              ${plan.name === 'For Users' ? 'Sign Up Now' : 'Join as a Provider'}
            </button>
          </div>
        `).join('')}
      </div>
      
      ${getBottomNav('pricing')}
    </div>
  `;
}

// ============================================================================
// FAQ SCREEN
// ============================================================================
function getFAQScreen() {
  const faqs = [
    { q: 'How do I book a service?', a: 'Booking a service is easy! Simply browse our service categories, choose a provider, and select a time that works for you. You\'ll receive a confirmation once the provider accepts your booking.' },
    { q: 'Are the service providers verified?', a: 'Yes, absolutely. We take your safety very seriously. All service providers on the UrbanEzii platform undergo a rigorous background check and verification process before they can offer services.' },
    { q: 'What if I\'m not satisfied with the service?', a: 'Your satisfaction is our priority. If you\'re unhappy with the service, you can raise a dispute through the app. Our support team will investigate and help resolve the issue. You can also use our AI Assistant to find a higher-rated provider for next time.' },
    { q: 'How does payment work?', a: 'Payments are handled securely through our platform. You can pay using a credit/debit card, net banking, or other digital wallets. Payment is only released to the provider after you confirm the service has been completed to your satisfaction.' },
    { q: 'Can I cancel a booking?', a: 'Yes, you can cancel a booking. Please refer to our cancellation policy for details on any applicable charges, which may vary depending on how close to the appointment time you cancel.' }
  ];
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 20px 16px;">
        <button onclick="window.mobileApp.showScreen('home')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; cursor: pointer;">← Back</button>
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Frequently Asked Questions</h1>
        <p style="font-size: 14px; opacity: 0.95;">Find answers to common questions about UrbanEzii.</p>
      </div>
      
      <div style="padding: 20px;">
        ${faqs.map((faq, i) => `
          <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
            <div onclick="window.mobileApp.toggleFAQ(${i})" style="cursor: pointer;">
              <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
                <h3 style="font-size: 16px; font-weight: 700; color: #333; flex: 1;">${faq.q}</h3>
                <span id="faqIcon${i}" style="font-size: 20px; color: #3b82f6; flex-shrink: 0;">▼</span>
              </div>
              <div id="faqAnswer${i}" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f3f4f6; font-size: 14px; color: #666; line-height: 1.6;">
                ${faq.a}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${getBottomNav('faq')}
    </div>
  `;
}

// ============================================================================
// BLOG SCREEN
// ============================================================================
function getBlogScreen() {
  const posts = [
    { title: '5 Tips for a Sparkling Clean Home', desc: 'Discover professional cleaning tips that will make your home shine. From the kitchen to the bathroom, we\'ve got you covered.', author: 'Jane Doe', date: 'August 15, 2024', image: '🧹' },
    { title: 'DIY vs. Professional Plumbers: When to Call for Help', desc: 'Some plumbing issues are a quick fix, but others require a professional. Learn when to tackle the job yourself and when to call in the experts.', author: 'John Smith', date: 'August 10, 2024', image: '🔧' },
    { title: 'The Benefits of Hiring a Personal Cook', desc: 'Tired of takeout? Explore the advantages of hiring a personal cook for healthy, delicious, and convenient home-cooked meals.', author: 'Emily White', date: 'August 5, 2024', image: '👨‍🍳' }
  ];
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 20px 16px;">
        <button onclick="window.mobileApp.showScreen('home')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; cursor: pointer;">← Back</button>
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Our Blog</h1>
        <p style="font-size: 14px; opacity: 0.95;">Tips, tricks, and insights for modern urban living.</p>
      </div>
      
      <div style="padding: 20px;">
        ${posts.map(post => `
          <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); height: 120px; display: flex; align-items: center; justify-content: center; font-size: 60px;">
              ${post.image}
            </div>
            <div style="padding: 20px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">${post.title}</h2>
              <p style="font-size: 12px; color: #999; margin-bottom: 12px;">By ${post.author} on ${post.date}</p>
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 16px;">${post.desc}</p>
              <button style="color: #3b82f6; background: none; border: none; font-size: 14px; font-weight: 600; cursor: pointer; padding: 0;">Read More →</button>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${getBottomNav('blog')}
    </div>
  `;
}

// ============================================================================
// CONTACT US SCREEN
// ============================================================================
function getContactScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 20px 16px;">
        <button onclick="window.mobileApp.showScreen('home')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; cursor: pointer;">← Back</button>
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Get In Touch</h1>
        <p style="font-size: 14px; opacity: 0.95;">We'd love to hear from you. Drop us a line!</p>
      </div>
      
      <div style="padding: 20px;">
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #333; margin-bottom: 20px;">Send us a Message</h2>
          <form id="contactForm" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px;">Name</label>
              <input type="text" id="contactName" required style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;" />
            </div>
            <div>
              <label style="display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px;">Email</label>
              <input type="email" id="contactEmail" required style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;" />
            </div>
            <div>
              <label style="display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px;">Message</label>
              <textarea id="contactMessage" required rows="5" style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
            </div>
            <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
              Submit
            </button>
          </form>
        </div>
        
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <div style="width: 40px; height: 40px; background: #f0f9ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">📧</div>
              <div>
                <h3 style="font-size: 16px; font-weight: 700; color: #333;">Email</h3>
              </div>
            </div>
            <p style="font-size: 14px; color: #3b82f6; margin-left: 52px;">support@urbanezii.com</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <div style="width: 40px; height: 40px; background: #f0f9ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">📞</div>
              <div>
                <h3 style="font-size: 16px; font-weight: 700; color: #333;">Phone</h3>
              </div>
            </div>
            <p style="font-size: 14px; color: #3b82f6; margin-left: 52px;">+91 7676615394</p>
          </div>
          
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <div style="width: 40px; height: 40px; background: #f0f9ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">📍</div>
              <div>
                <h3 style="font-size: 16px; font-weight: 700; color: #333;">Address</h3>
              </div>
            </div>
            <p style="font-size: 14px; color: #666; margin-left: 52px;">123 Urban Lane, Tech City, 560100</p>
          </div>
        </div>
      </div>
      
      ${getBottomNav('contact')}
    </div>
  `;
}

// ============================================================================
// PROVIDER DASHBOARD SCREEN
// ============================================================================
function getProviderDashboardScreen() {
  const userName = localStorage.getItem('userName') || 'Provider';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userInitial = userName.charAt(0).toUpperCase();
  
  return `
    <div style="min-height: 100vh; background: #f5f7fa; padding-bottom: 90px;">
      <!-- Professional Provider Header -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 20px 16px 36px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15); position: relative; overflow: hidden;">
        <!-- Background Pattern -->
        <div style="position: absolute; top: -20px; right: -20px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -30px; left: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
        
        <div style="display: flex; align-items: center; gap: 14px; position: relative; z-index: 2;">
          <div style="width: 54px; height: 54px; background: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; padding: 10px; box-shadow: 0 6px 16px rgba(0,0,0,0.2); flex-shrink: 0;">
            <img src="logo.png" alt="UrbanEzii" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <div style="flex: 1;">
            <div style="font-size: 20px; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.3px;">Hey ${userName}! 👋</div>
            <div style="font-size: 13px; opacity: 0.9; font-weight: 500;">Manage your business at your fingertips</div>
          </div>
          <button onclick="window.mobileApp.navigateProvider('provider-profile')" style="width: 46px; height: 46px; background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.4); border-radius: 50%; color: white; font-size: 18px; font-weight: 700; cursor: pointer; flex-shrink: 0; backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            ${userInitial}
          </button>
        </div>
      </div>
      
      <!-- Profile Completion Reminder (for incomplete profiles) -->
      <div id="profileReminder" style="display: none; padding: 16px; margin-top: -30px;">
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; flex-shrink: 0;">
              ⚠️
            </div>
            <div style="flex: 1;">
              <h4 style="font-size: 14px; font-weight: 700; color: #92400e; margin-bottom: 4px;">Complete Your Profile</h4>
              <p style="font-size: 12px; color: #92400e; margin-bottom: 8px;">Add your services and pricing to get more bookings</p>
              <button onclick="window.mobileApp.showScreen('setup-wizard')" style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">
                Complete Now
              </button>
            </div>
            <button onclick="document.getElementById('profileReminder').style.display='none'" style="background: none; border: none; color: #92400e; font-size: 18px; cursor: pointer; padding: 4px;">
              ×
            </button>
          </div>
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div style="padding: 16px; margin-top: -30px;">
        <div id="statsContainer" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
          <div style="background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #3b82f6;">-</div>
            <div style="font-size: 11px; color: #666;">Total Jobs</div>
          </div>
          <div style="background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #f59e0b;">-</div>
            <div style="font-size: 11px; color: #666;">Active</div>
          </div>
          <div style="background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #10b981;">-</div>
            <div style="font-size: 11px; color: #666;">Completed</div>
          </div>
        </div>
        
        <!-- Earnings Trend Section -->
        <div style="background: white; border-radius: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 16px; font-weight: 700; color: #333; display: flex; align-items: center; gap: 8px;">
                <span style="color: #10b981;">📈</span> Earnings Trend
              </h3>
              <p style="font-size: 12px; color: #666; margin-top: 4px;">Last 6 months earnings</p>
            </div>
            <div id="totalEarningsDisplay" style="text-align: right;">
              <div style="font-size: 20px; font-weight: 700; color: #10b981;">₹0</div>
              <div style="font-size: 11px; color: #666;">Total</div>
            </div>
          </div>
          <div id="earningsChartContainer" style="min-height: 120px;">
            <div style="text-align: center; padding: 20px;">
              <p style="color: #999; font-size: 13px;">Loading earnings data...</p>
            </div>
          </div>
        </div>
        
        <!-- Upcoming Appointments Section -->
        <div style="background: white; border-radius: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #333;">Upcoming Appointments</h3>
            <span id="todayCount" style="padding: 4px 12px; background: #f0f9ff; color: #3b82f6; border-radius: 12px; font-size: 12px; font-weight: 600;">- Today</span>
          </div>
          <div id="recentBookingsContainer">
            <div style="text-align: center; padding: 40px 20px;">
              <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
              <p style="color: #666; font-size: 14px;">Loading appointments...</p>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity Section -->
        <div style="background: white; border-radius: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <h3 style="font-size: 16px; font-weight: 700; color: #333; margin-bottom: 12px;">Recent Activity</h3>
          <div style="font-size: 13px; color: #666; margin-bottom: 12px;">Latest bookings and updates</div>
          <div id="recentActivityContainer">
            <div style="text-align: center; padding: 20px;">
              <p style="color: #999; font-size: 13px;">Loading activity...</p>
            </div>
          </div>
        </div>
      </div>
      
      ${getProviderBottomNav('dashboard')}
    </div>
  `;
}

// Provider Bottom Navigation
function getProviderBottomNav(active) {
  const isDashboard = active === 'dashboard';
  const isBookings = active === 'bookings';
  const isServices = active === 'services';
  const isMore = active === 'more';
  
  return `
    <!-- Professional Floating Bottom Nav (Provider) -->
    <div style="position: fixed; bottom: 16px; left: 16px; right: 16px; background: white; border-radius: 24px; display: flex; justify-content: space-around; padding: 12px 8px; z-index: 100; box-shadow: 0 8px 32px rgba(0,0,0,0.12); backdrop-filter: blur(10px);">
      <!-- Dashboard -->
      <div onclick="window.mobileApp.navigateProvider('provider-dashboard')" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        ${isDashboard ? '<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 3px;"></div>' : ''}
        <div style="width: 48px; height: 36px; background: ${isDashboard ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isDashboard ? 'white' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </div>
        <div style="font-size: 11px; font-weight: ${isDashboard ? '700' : '600'}; color: ${isDashboard ? '#3b82f6' : '#999'};">Dashboard</div>
      </div>
      
      <!-- Bookings -->
      <div onclick="window.mobileApp.navigateProvider('provider-bookings')" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        ${isBookings ? '<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 3px;"></div>' : ''}
        <div style="width: 48px; height: 36px; background: ${isBookings ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isBookings ? 'white' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div style="font-size: 11px; font-weight: ${isBookings ? '700' : '600'}; color: ${isBookings ? '#3b82f6' : '#999'};">Bookings</div>
      </div>
      
      <!-- Services -->
      <div onclick="window.mobileApp.navigateProvider('provider-services')" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        ${isServices ? '<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 3px;"></div>' : ''}
        <div style="width: 48px; height: 36px; background: ${isServices ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isServices ? 'white' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        </div>
        <div style="font-size: 11px; font-weight: ${isServices ? '700' : '600'}; color: ${isServices ? '#3b82f6' : '#999'};">Services</div>
      </div>
      
      <!-- More -->
      <div onclick="window.mobileApp.toggleProviderMenu()" style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        ${isMore ? '<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 3px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 3px;"></div>' : ''}
        <div style="width: 48px; height: 36px; background: ${isMore ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isMore ? 'white' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </div>
        <div style="font-size: 11px; font-weight: ${isMore ? '700' : '600'}; color: ${isMore ? '#3b82f6' : '#999'};">More</div>
      </div>
    </div>
  `;
}

// Provider Menu Overlay
function getProviderMenuOverlay() {
  const userName = localStorage.getItem('userName') || 'Provider';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  return `
    <div id="providerMenuOverlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none;" onclick="window.mobileApp.toggleProviderMenu()">
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: white; max-width: 85%; height: 100%; box-shadow: 2px 0 20px rgba(0,0,0,0.3); overflow-y: auto;" onclick="event.stopPropagation()">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 40px 20px 24px;">
          <button onclick="window.mobileApp.toggleProviderMenu()" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; background: rgba(255,255,255,0.2); border: none; border-radius: 50%; color: white; font-size: 20px; cursor: pointer;">×</button>
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
            <div style="width: 60px; height: 60px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px;">👤</div>
            <div style="flex: 1;">
              <div style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">${userName}</div>
              <div style="font-size: 13px; opacity: 0.9;">${userEmail}</div>
            </div>
          </div>
        </div>
        
        <!-- Menu Items -->
        <div style="padding: 8px 0;">
          <div onclick="window.mobileApp.navigateProvider('provider-dashboard'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 22px;">📊</div>
            <div style="font-size: 15px; font-weight: 500; color: #333;">Dashboard</div>
          </div>
          
          <div onclick="window.mobileApp.navigateProvider('provider-profile'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 22px;">👤</div>
            <div style="font-size: 15px; font-weight: 500; color: #333;">My Profile</div>
          </div>
          
          <div onclick="window.mobileApp.navigateProvider('provider-services'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 22px;">🛠️</div>
            <div style="font-size: 15px; font-weight: 500; color: #333;">My Services</div>
          </div>
          
          <div onclick="window.mobileApp.navigateProvider('provider-bookings'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 22px;">📋</div>
            <div style="font-size: 15px; font-weight: 500; color: #333;">My Bookings</div>
          </div>
          
          <div onclick="window.mobileApp.navigateProvider('provider-earnings'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 22px;">💰</div>
            <div style="font-size: 15px; font-weight: 500; color: #333;">Earnings</div>
          </div>
          
          <div onclick="window.mobileApp.navigateProvider('provider-reviews'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 22px;">⭐</div>
            <div style="font-size: 15px; font-weight: 500; color: #333;">Reviews</div>
          </div>
          
          <div onclick="window.mobileApp.navigateProvider('provider-documents'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 22px;">📄</div>
            <div style="font-size: 15px; font-weight: 500; color: #333;">Documents</div>
          </div>
          
          <div onclick="window.mobileApp.navigateProvider('provider-settings'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 22px;">⚙️</div>
            <div style="font-size: 15px; font-weight: 500; color: #333;">Settings</div>
          </div>
          
          <!-- Admin Panel (Only for sandeshsb25260@gmail.com) -->
          ${currentUser && currentUser.email === 'sandeshsb25260@gmail.com' ? `
          <div onclick="window.mobileApp.showScreen('admin-panel'); window.mobileApp.toggleProviderMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); margin: 8px 0; border-radius: 12px;">
            <div style="font-size: 22px;">🔔</div>
            <div style="font-size: 15px; font-weight: 600; color: white;">Admin Panel</div>
          </div>
          ` : ''}
          
          <div onclick="window.mobileApp.handleLogout()" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; margin-top: 16px;">
            <div style="font-size: 22px;">🚪</div>
            <div style="font-size: 15px; font-weight: 600; color: #dc2626;">Logout</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function toggleProviderMenu() {
  const overlay = document.getElementById('providerMenuOverlay');
  if (!overlay) {
    // Create and append overlay
    const div = document.createElement('div');
    div.innerHTML = getProviderMenuOverlay();
    document.body.appendChild(div.firstElementChild);
    setTimeout(() => {
      document.getElementById('providerMenuOverlay').style.display = 'block';
    }, 10);
  } else {
    const isVisible = overlay.style.display === 'block';
    overlay.style.display = isVisible ? 'none' : 'block';
  }
}

function navigateProvider(screen) {
  showScreen(screen);
}

// ============================================================================
// PROVIDER BOOKINGS SCREEN
// ============================================================================
function getProviderBookingsScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px;">
        <h2 style="font-size: 20px; font-weight: 700;">My Bookings</h2>
      </div>
      
      <div style="padding: 16px;">
        <div style="display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto;">
          <button id="filterAll" onclick="window.mobileApp.filterProviderBookings('all')" style="padding: 8px 16px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap; cursor: pointer;">All</button>
          <button id="filterPending" onclick="window.mobileApp.filterProviderBookings('pending')" style="padding: 8px 16px; background: #e5e7eb; color: #666; border: none; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap; cursor: pointer;">Pending</button>
          <button id="filterConfirmed" onclick="window.mobileApp.filterProviderBookings('confirmed')" style="padding: 8px 16px; background: #e5e7eb; color: #666; border: none; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap; cursor: pointer;">Confirmed</button>
          <button id="filterCompleted" onclick="window.mobileApp.filterProviderBookings('completed')" style="padding: 8px 16px; background: #e5e7eb; color: #666; border: none; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap; cursor: pointer;">Completed</button>
        </div>
        
        <div id="providerBookingsContainer">
          ${getBeautifulLoader('Loading bookings...', false, 'small')}
        </div>
      </div>
      
      ${getProviderBottomNav('bookings')}
    </div>
  `;
}
// ============================================================================
// PROVIDER SERVICES SCREEN (FULL CRUD)
// ============================================================================

// Global state for services management
let providerServices = [];
let expandedServiceIndex = null;

function getProviderServicesScreen() {
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-size: 20px; font-weight: 700;">My Services</h2>
          <button onclick="window.mobileApp.openAddServiceDialog()" style="padding: 8px 16px; background: white; color: #3b82f6; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">+</span> Add Category
          </button>
        </div>
        <p style="font-size: 13px; opacity: 0.9; margin-top: 8px;">Manage your service offerings and pricing</p>
      </div>
      
      <div style="padding: 16px;">
        <div id="providerServicesContainer">
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
            <p style="color: #666;">Loading services...</p>
          </div>
        </div>
      </div>
      
      ${getProviderBottomNav('services')}
    </div>
  `;
}

// Render services list
function renderProviderServices() {
  const container = document.getElementById('providerServicesContainer');
  if (!container) return;
  
  if (providerServices.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 60px; margin-bottom: 16px;">🛠️</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">No services yet</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 24px;">Add your first service category to get started</p>
        <button onclick="window.mobileApp.openAddServiceDialog()" style="padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;">
          + Add Service Category
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = providerServices.map((service, idx) => {
    const isExpanded = expandedServiceIndex === idx;
    const subcategoryCount = service.subcategories?.length || 0;
    
    return `
      <div style="background: white; border-radius: 16px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <!-- Category Header -->
        <div onclick="window.mobileApp.toggleServiceExpand(${idx})" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: ${isExpanded ? '#f0f4ff' : 'white'};">
          <div style="flex: 1;">
            <h4 style="font-size: 16px; font-weight: 700; color: #333; margin-bottom: 4px;">${service.category}</h4>
            <p style="font-size: 12px; color: #666;">${subcategoryCount} subcategor${subcategoryCount === 1 ? 'y' : 'ies'}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button onclick="event.stopPropagation(); window.mobileApp.deleteServiceCategory(${idx})" style="width: 32px; height: 32px; background: #fee; color: #dc2626; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">🗑️</button>
            <div style="font-size: 18px; transform: rotate(${isExpanded ? '180' : '0'}deg); transition: transform 0.3s;">▼</div>
          </div>
        </div>
        
        <!-- Subcategories (Expanded) -->
        ${isExpanded ? `
          <div style="border-top: 1px solid #eee; padding: 12px;">
            ${service.subcategories && service.subcategories.length > 0 ? service.subcategories.map((sub, subIdx) => `
              <div style="padding: 12px; margin-bottom: 8px; background: #f9fafb; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                  <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 4px;">${sub.name}</div>
                  <div style="font-size: 13px; color: #3b82f6; font-weight: 600;">₹ ${sub.price}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button onclick="window.mobileApp.editSubcategory(${idx}, ${subIdx})" style="width: 32px; height: 32px; background: #eff6ff; color: #3b82f6; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">✏️</button>
                  <button onclick="window.mobileApp.deleteSubcategory(${idx}, ${subIdx})" style="width: 32px; height: 32px; background: #fee; color: #dc2626; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">🗑️</button>
                </div>
              </div>
            `).join('') : '<p style="text-align: center; color: #999; padding: 20px; font-size: 13px;">No subcategories yet</p>'}
            
            <!-- Add Subcategory Button -->
            <button onclick="window.mobileApp.openAddSubcategoryDialog(${idx})" style="width: 100%; padding: 12px; background: #f0f9ff; color: #3b82f6; border: 2px dashed #3b82f6; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 8px;">
              + Add Subcategory
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// ============================================================================
// PROVIDER PROFILE SCREEN
// ============================================================================
function getProviderProfileScreen() {
  const userName = localStorage.getItem('userName') || 'Provider';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userPhone = localStorage.getItem('userPhone') || '';
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 40px 16px;">
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto 16px;">🏢</div>
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">${userName}</h2>
          <p style="font-size: 14px; opacity: 0.9;">Service Provider</p>
        </div>
      </div>
      
      <div style="padding: 16px;">
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
          <div style="padding: 16px; border-bottom: 1px solid #eee;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Email</div>
            <div style="font-size: 14px; color: #333; font-weight: 500;">${userEmail}</div>
          </div>
          ${userPhone ? `
          <div style="padding: 16px; border-bottom: 1px solid #eee;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Phone</div>
            <div style="font-size: 14px; color: #333; font-weight: 500;">${userPhone}</div>
          </div>
          ` : ''}
        </div>
        
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <button onclick="window.mobileApp.handleLogout()" style="width: 100%; padding: 16px; border: none; background: white; display: flex; align-items: center; gap: 12px; cursor: pointer; color: #dc2626;">
            <span style="font-size: 20px;">🚪</span>
            <span style="flex: 1; text-align: left; font-size: 14px; font-weight: 500;">Logout</span>
          </button>
        </div>
      </div>
      
      ${getProviderBottomNav('profile')}
    </div>
  `;
}
// ============================================================================
// BOOKING FORM SCREEN
// ============================================================================
function getBookingFormScreen() {
  if (!selectedProvider || !selectedService) return '';
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get provider name (EXACT SAME AS WEB APP)
  const providerName = selectedProvider.businessName || selectedProvider.name || 'Provider';
  
  // Extract service options from provider's services data (EXACT SAME AS WEB APP)
  const getProviderServices = () => {
    if (!selectedProvider?.services || !selectedService.name) {
      return [];
    }
    
    const categoryServices = selectedProvider.services[selectedService.name];
    if (!categoryServices) {
      return [];
    }
    
    return Object.entries(categoryServices).map(([subService, price]) => ({
      name: subService,
      price: price,
      displayText: `${subService} - ₹${price}`,
    }));
  };

  const availableServices = getProviderServices();
  
  console.log('📋 Booking form data:', {
    providerName,
    providerId: selectedProvider.id || selectedProvider.uid,
    services: availableServices
  });
  
  // Time slots (SAME AS WEB APP)
  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
  ];
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 20px;">
      <!-- Professional Header -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px 16px 20px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <button onclick="window.mobileApp.showScreen('service-detail')" class="back-btn" style="background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.3); color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.3s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div>
            <h2 style="font-size: 20px; font-weight: 800;">Book Service</h2>
            <p style="font-size: 12px; opacity: 0.9;">Complete the details below</p>
          </div>
        </div>
      </div>
      
      <div style="padding: 16px;">
        <!-- Provider Info Card -->
        <div style="background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%); border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 2px solid rgba(59, 130, 246, 0.2);">
          <div style="font-size: 12px; color: #3b82f6; font-weight: 600; margin-bottom: 6px;">BOOKING WITH</div>
          <div style="font-size: 16px; font-weight: 700; color: #333;">${providerName}</div>
        </div>
        
        <!-- Booking Form -->
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <div id="bookingError" style="display: none; background: #fee; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; font-weight: 500;"></div>
          
          <!-- Service Type Dropdown (EXACT SAME AS WEB APP) -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Service Type *</label>
            <select id="bookingServiceType" required style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; background: white; transition: border-color 0.3s;">
              <option value="">Select a service</option>
              ${availableServices.map(service => `
                <option value="${service.name}" data-price="${service.price}">${service.displayText}</option>
              `).join('')}
            </select>
          </div>
          
          <!-- Date Picker (EXACT WEB APP) -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Service Date *</label>
            <input type="date" id="bookingDate" min="${today}" required style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; transition: border-color 0.3s;" />
          </div>
          
          <!-- Time Slot (EXACT WEB APP) -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Preferred Time Slot *</label>
            <select id="bookingTime" required style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; background: white; transition: border-color 0.3s;">
              <option value="">Select a time slot</option>
              ${timeSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('')}
            </select>
          </div>
          
          <!-- Service Address (EXACT WEB APP) -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Service Address *</label>
            <textarea id="bookingAddress" rows="3" placeholder="Enter your complete address..." required style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; resize: vertical; transition: border-color 0.3s;"></textarea>
            <button onclick="window.mobileApp.getCurrentLocation()" type="button" style="margin-top: 8px; padding: 8px 14px; background: #f0f9ff; color: #3b82f6; border: 1px solid #3b82f6; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Use Current Location
            </button>
          </div>
          
          <!-- Contact Number (EXACT WEB APP) -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Contact Number *</label>
            <input type="tel" id="bookingPhone" value="${localStorage.getItem('userPhone') || ''}" placeholder="+91 98765 43210" required style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; transition: border-color 0.3s;" />
          </div>
          
          <!-- Additional Notes (EXACT WEB APP) -->
          <div style="margin-bottom: 24px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Additional Notes (Optional)</label>
            <textarea id="bookingNotes" rows="2" placeholder="Any special requirements?" style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; resize: vertical; transition: border-color 0.3s;"></textarea>
          </div>
          
          <!-- Submit Button -->
          <button id="submitBookingBtn" onclick="window.mobileApp.submitBooking()" class="book-now-btn" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            Confirm Booking
          </button>
        </div>
      </div>
      
      ${getInteractiveStyles()}
    </div>
  `;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================
function attachHomeHandlers() {
  console.log('Home screen loaded');
}

function attachServicesHandlers() {
  console.log('Services screen loaded');
}

function attachServiceDetailHandlers() {
  loadProviders();
}

async function loadProviders() {
  const container = document.getElementById('providersContainer');
  if (!container || !selectedService) return;
  
  try {
    const category = selectedService.category;
    const providersRef = collection(db, 'providers');
    const querySnapshot = await getDocs(providersRef);
    
    // Filter providers (EXACT web app logic)
    const filteredDocs = querySnapshot.docs.filter(doc => {
      const data = doc.data();
      if (data.active === false) return false;
      if (Array.isArray(data.serviceCategories) && data.serviceCategories.includes(category)) return true;
      if (Array.isArray(data.services)) {
        const hasMatch = data.services.some(s => s.category === category);
        if (hasMatch) return true;
      }
      if (data.category && data.category.toLowerCase() === category.toLowerCase()) return true;
      return false;
    });
    
    if (filteredDocs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 60px; margin-bottom: 16px;">😔</div>
          <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">No providers available</h3>
          <p style="font-size: 14px; color: #666;">Check back soon</p>
        </div>
      `;
      return;
    }
    
    const providers = filteredDocs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.businessName || '',
        rating: data.rating || 4.8,
        reviews: data.reviews || 0,
        address: data.address || data.city || '',
      };
    });
    
    container.innerHTML = providers.map((provider, index) => `
      <div class="provider-card" onclick="window.mobileApp.selectProvider('${provider.id}')" style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 16px; box-shadow: 0 6px 24px rgba(0,0,0,0.08); cursor: pointer; position: relative; overflow: hidden; animation: fadeInUp 0.5s ease ${index * 0.1}s backwards;">
        <!-- Top Gradient Accent -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);"></div>
        
        <!-- Provider Name & Badge -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <h4 style="font-size: 18px; font-weight: 800; color: #1a1a2e; line-height: 1.3; flex: 1;">${provider.name}</h4>
          ${provider.rating >= 4.5 ? '<div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; white-space: nowrap;">⚡ TOP RATED</div>' : ''}
        </div>
        
        <!-- Rating & Reviews - Enhanced -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 6px 12px; border-radius: 10px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span style="font-size: 14px; font-weight: 700;">${provider.rating}</span>
          </div>
          ${provider.reviews > 0 ? `<div style="font-size: 13px; color: #666; font-weight: 500;">${provider.reviews} reviews</div>` : '<div style="font-size: 12px; color: #999;">New provider</div>'}
        </div>
        
        <!-- Address with Icon -->
        ${provider.address ? `
        <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px; padding: 10px; background: #f5f7fa; border-radius: 12px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span style="font-size: 13px; color: #555; font-weight: 500; line-height: 1.4;">${provider.address}</span>
        </div>
        ` : ''}
        
        <!-- Professional Book Button -->
        <button class="book-now-btn" onclick="event.stopPropagation(); window.mobileApp.bookProvider('${provider.id}')" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 14px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>Book Now</span>
        </button>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading providers:', error);
    container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: #dc2626;">Error loading providers</div>`;
  }
}

function attachBookingFormHandlers() {
  console.log('Booking form loaded');
}

async function submitBooking() {
  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('bookingTime').value;
  const address = document.getElementById('bookingAddress').value.trim();
  const phone = document.getElementById('bookingPhone').value.trim();
  const notes = document.getElementById('bookingNotes').value.trim();
  const errorDiv = document.getElementById('bookingError');
  const btn = document.getElementById('submitBookingBtn');
  
  // Get selected service type and price (EXACT SAME AS WEB APP)
  const serviceTypeSelect = document.getElementById('bookingServiceType');
  const serviceType = serviceTypeSelect.value;
  
  if (!serviceType) {
    errorDiv.textContent = 'Please select a service type';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Get the price for the selected service (EXACT SAME AS WEB APP)
  const selectedOption = serviceTypeSelect.options[serviceTypeSelect.selectedIndex];
  const amount = parseInt(selectedOption.getAttribute('data-price')) || 500;
  
  if (!date || !time || !address || !phone) {
    errorDiv.textContent = 'Please fill in all required fields';
    errorDiv.style.display = 'block';
    return;
  }
  
  btn.textContent = 'Creating booking...';
  btn.disabled = true;
  errorDiv.style.display = 'none';
  
  try {
    // Get all customer details from localStorage (EXACT SAME AS WEB APP)
    const customerName = localStorage.getItem('userName') || 'Customer';
    const customerEmail = localStorage.getItem('userEmail') || '';
    const customerPhone = phone;
    
    // Create booking data (EXACT SAME AS WEB APP)
    const bookingData = {
      providerId: selectedProvider.uid || selectedProvider.id,
      providerName: selectedProvider.businessName || selectedProvider.name,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      serviceType: serviceType,
      date: Timestamp.fromDate(new Date(date)),
      timeSlot: time,
      address: address,
      phone: phone,
      notes: notes,
      amount: amount,
      status: 'pending',
      createdAt: serverTimestamp()
    };
    
    console.log('📤 Creating booking:', bookingData);
    
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    
    // Send booking confirmation notification
    if (window.notificationService) {
      await window.notificationService.sendBookingConfirmation({
        ...bookingData,
        id: docRef.id
      });
    }
    
    alert(`✅ Booking Confirmed!\n\nService: ${serviceType}\nAmount: ₹${amount}\nDate: ${date}\nTime: ${time}\n\nCheck your bookings page.`);
    showScreen('customer-bookings');
    
  } catch (error) {
    console.error('Booking error:', error);
    errorDiv.textContent = 'Failed to create booking. Please try again.';
    errorDiv.style.display = 'block';
    btn.textContent = 'Confirm Booking';
    btn.disabled = false;
  }
}
function attachCustomerBookingsHandlers() {
  loadCustomerBookings();
}

async function loadCustomerBookings() {
  const container = document.getElementById('bookingsContainer');
  if (!container) return;
  
  try {
    const userPhone = localStorage.getItem('userPhone');
    console.log('📱 Loading bookings for phone:', userPhone);
    
    if (!userPhone) {
      container.innerHTML = `<div style="text-align: center; padding: 60px 20px;"><p>Please update your phone number in profile</p></div>`;
      return;
    }
    
    const bookingsRef = collection(db, 'bookings');
    // Remove orderBy to avoid Firebase index requirement - sort in JavaScript instead (SAME AS WEB APP)
    const q = query(bookingsRef, where('customerPhone', '==', userPhone));
    const querySnapshot = await getDocs(q);
    
    console.log('📊 Found bookings:', querySnapshot.size);
    
    if (querySnapshot.empty) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 60px; margin-bottom: 16px;">📅</div>
          <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">No bookings yet</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 24px;">Book a service to see your bookings here</p>
          <button onclick="window.mobileApp.showScreen('services')" style="padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;">Browse Services</button>
        </div>
      `;
      return;
    }
    
    const bookings = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });
    
    // Sort by createdAt in JavaScript instead of Firestore (SAME AS WEB APP)
    bookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    container.innerHTML = bookings.map(booking => {
      const statusColors = {
        pending: '#f59e0b',
        confirmed: '#3b82f6',
        completed: '#10b981',
        cancelled: '#ef4444'
      };
      const statusColor = statusColors[booking.status] || '#666';
      
      return `
        <div style="background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <div>
              <h4 style="font-size: 16px; font-weight: 700; color: #333; margin-bottom: 4px;">${booking.serviceType}</h4>
              <p style="font-size: 13px; color: #666;">${booking.providerName}</p>
            </div>
            <span style="padding: 4px 12px; background: ${statusColor}20; color: ${statusColor}; border-radius: 12px; font-size: 12px; font-weight: 600;">${booking.status}</span>
          </div>
          <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
            📅 ${booking.date.toLocaleDateString()} • ${booking.timeSlot}
          </div>
          <div style="font-size: 13px; color: #666;">
            📍 ${booking.address}
          </div>
        </div>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading bookings:', error);
    container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: #dc2626;">Error loading bookings</div>`;
  }
}
function attachCustomerProfileHandlers() {
  console.log('Customer profile loaded');
  
  // Add notification toggle handlers with proper event delegation
  setTimeout(() => {
    const notificationToggle = document.getElementById('notificationToggle');
    const bookingNotificationToggle = document.getElementById('bookingNotificationToggle');
    const promoNotificationToggle = document.getElementById('promoNotificationToggle');
    
    console.log('Setting up toggle handlers:', {
      notificationToggle: !!notificationToggle,
      bookingNotificationToggle: !!bookingNotificationToggle,
      promoNotificationToggle: !!promoNotificationToggle
    });
    
    if (notificationToggle) {
      notificationToggle.addEventListener('change', handleNotificationToggle);
      // Also add click handler to the label
      const label = notificationToggle.closest('label');
      if (label) {
        label.addEventListener('click', (e) => {
          e.preventDefault();
          notificationToggle.checked = !notificationToggle.checked;
          updateToggleVisual('notificationToggle', notificationToggle.checked);
          handleNotificationToggle({ target: notificationToggle });
        });
      }
    }
    
    if (bookingNotificationToggle) {
      bookingNotificationToggle.addEventListener('change', handleBookingNotificationToggle);
      const label = bookingNotificationToggle.closest('label');
      if (label) {
        label.addEventListener('click', (e) => {
          e.preventDefault();
          bookingNotificationToggle.checked = !bookingNotificationToggle.checked;
          updateToggleVisual('bookingNotificationToggle', bookingNotificationToggle.checked);
          handleBookingNotificationToggle({ target: bookingNotificationToggle });
        });
      }
    }
    
    if (promoNotificationToggle) {
      promoNotificationToggle.addEventListener('change', handlePromoNotificationToggle);
      const label = promoNotificationToggle.closest('label');
      if (label) {
        label.addEventListener('click', (e) => {
          e.preventDefault();
          promoNotificationToggle.checked = !promoNotificationToggle.checked;
          updateToggleVisual('promoNotificationToggle', promoNotificationToggle.checked);
          handlePromoNotificationToggle({ target: promoNotificationToggle });
        });
      }
    }
  }, 100);
}

// ============================================================================
// NEW CUSTOMER SCREEN HANDLERS
// ============================================================================
function toggleFAQ(index) {
  const answer = document.getElementById(`faqAnswer${index}`);
  const icon = document.getElementById(`faqIcon${index}`);
  if (answer && icon) {
    if (answer.style.display === 'none' || answer.style.display === '') {
      answer.style.display = 'block';
      icon.textContent = '▲';
    } else {
      answer.style.display = 'none';
      icon.textContent = '▼';
    }
  }
}

function attachContactHandlers() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;
      
      console.log('📧 Contact form submitted:', { name, email, message });
      
      // Show success message
      alert('✅ Message Sent!\n\nThanks for reaching out. We\'ll get back to you shortly.');
      
      // Reset form
      form.reset();
    });
  }
}

function toggleCustomerMenu() {
  const existing = document.getElementById('customerMenuOverlay');
  if (existing) {
    existing.remove();
  } else {
    const overlay = document.createElement('div');
    overlay.id = 'customerMenuOverlay';
    overlay.innerHTML = getCustomerMenuOverlay();
    document.body.appendChild(overlay);
  }
}

function getCustomerMenuOverlay() {
  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  return `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; animation: fadeIn 0.3s ease-out;" onclick="if(event.target === this) window.mobileApp.toggleCustomerMenu()">
      <div style="position: absolute; top: 0; right: 0; bottom: 0; width: 85%; max-width: 320px; background: white; box-shadow: -4px 0 20px rgba(0,0,0,0.2); animation: slideInRight 0.3s ease-out; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 24px 20px; color: white;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
            <div style="width: 56px; height: 56px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 18px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${userName}</div>
              <div style="font-size: 13px; opacity: 0.95; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${userEmail}</div>
            </div>
          </div>
        </div>
        
        <!-- Menu Items -->
        <div style="flex: 1; overflow-y: auto; padding: 8px 0;">
          <div onclick="window.mobileApp.showScreen('home'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">Home</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('services'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">Services</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('about'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">About Us</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('features'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">Features</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('pricing'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">Pricing</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('faq'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">FAQs</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('blog'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">Blog</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('contact'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">Contact Us</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('customer-bookings'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">My Bookings</span>
          </div>
          
          <div onclick="window.mobileApp.showScreen('customer-profile'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #333;">Profile</span>
          </div>
          
          <!-- Admin Panel (Only for sandeshsb25260@gmail.com) -->
          ${currentUser && currentUser.email === 'sandeshsb25260@gmail.com' ? `
          <div onclick="window.mobileApp.showScreen('admin-panel'); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); margin: 8px 0; border-radius: 12px;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: white;">🔔 Admin Panel</span>
          </div>
          ` : ''}
          
          <!-- Notification Settings -->
          <div style="padding: 16px 20px; border-top: 2px solid #f3f4f6; margin-top: 8px;">
            <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px;">🔔 Notification Settings</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #666;">Push Notifications</span>
              <label style="position: relative; display: inline-block; width: 50px; height: 24px; cursor: pointer;">
                <input type="checkbox" id="notificationToggle" style="opacity: 0; width: 0; height: 0; position: absolute;">
                <span id="notificationToggleSlider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px;"></span>
                <span id="notificationToggleThumb" style="position: absolute; content: ''; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%;"></span>
              </label>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #666;">Booking Updates</span>
              <label style="position: relative; display: inline-block; width: 50px; height: 24px; cursor: pointer;">
                <input type="checkbox" id="bookingNotificationToggle" checked style="opacity: 0; width: 0; height: 0; position: absolute;">
                <span id="bookingNotificationToggleSlider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3b82f6; transition: .4s; border-radius: 24px;"></span>
                <span id="bookingNotificationToggleThumb" style="position: absolute; content: ''; height: 18px; width: 18px; left: 29px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%;"></span>
              </label>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 14px; color: #666;">Promotional Offers</span>
              <label style="position: relative; display: inline-block; width: 50px; height: 24px; cursor: pointer;">
                <input type="checkbox" id="promoNotificationToggle" checked style="opacity: 0; width: 0; height: 0; position: absolute;">
                <span id="promoNotificationToggleSlider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3b82f6; transition: .4s; border-radius: 24px;"></span>
                <span id="promoNotificationToggleThumb" style="position: absolute; content: ''; height: 18px; width: 18px; left: 29px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%;"></span>
              </label>
            </div>
            
            <!-- Manual Permission Request Button -->
            <button onclick="window.mobileApp.requestNotificationPermission()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              Request Notification Permission
            </button>
          </div>
          
          <div onclick="window.mobileApp.handleLogout(); window.mobileApp.toggleCustomerMenu();" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; border-top: 2px solid #f3f4f6; margin-top: 8px;">
            <div style="width: 32px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <span style="font-size: 16px; font-weight: 600; color: #ef4444;">Logout</span>
          </div>
        </div>
        
        <!-- Close Button -->
        <button onclick="window.mobileApp.toggleCustomerMenu()" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; background: rgba(255,255,255,0.2); border: none; border-radius: 50%; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          ×
        </button>
      </div>
      
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      </style>
    </div>
  `;
}

// ============================================================================
// PROVIDER HANDLERS
// ============================================================================
function attachProviderDashboardHandlers() {
  loadProviderDashboardDataRealtime();
}

// ============================================================================
// REAL-TIME DASHBOARD WITH NOTIFICATIONS
// ============================================================================
async function loadProviderDashboardDataRealtime() {
  const providerId = auth.currentUser?.uid;
  if (!providerId) return;
  
  console.log('🔥 Setting up real-time listener for provider dashboard...');
  
  // Check if profile is incomplete and show reminder
  try {
    const providerRef = doc(db, 'providers', providerId);
    const providerDoc = await getDoc(providerRef);
    
    if (providerDoc.exists()) {
      const providerData = providerDoc.data();
      const profileReminder = document.getElementById('profileReminder');
      
      if (profileReminder) {
        // Show reminder if profile is not complete (SAME LOGIC AS WEB APP)
        const isProfileComplete = providerData.businessName && 
                                providerData.services && 
                                providerData.services.length > 0 &&
                                providerData.termsAccepted === true;
        
        if (!isProfileComplete) {
          profileReminder.style.display = 'block';
          console.log('⚠️ Profile incomplete - showing reminder');
        } else {
          profileReminder.style.display = 'none';
          console.log('✅ Profile complete - hiding reminder');
        }
      }
    }
  } catch (error) {
    console.error('Error checking profile status:', error);
  }
  
  try {
    // Clean up any existing listener
    if (providerBookingsListener) {
      providerBookingsListener();
      providerBookingsListener = null;
    }
    
    // Set up real-time listener with onSnapshot
    const bookingsRef = collection(db, 'bookings');
    // Remove orderBy to avoid Firebase index requirement - sort in JavaScript (SAME AS WEB APP)
    const q = query(bookingsRef, where('providerId', '==', providerId));
    
    providerBookingsListener = onSnapshot(q, (querySnapshot) => {
      console.log('📊 Real-time update received:', querySnapshot.size, 'bookings');
      
      const bookings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📋 Booking data from DB:', data); // Debug log
        bookings.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      
      // Sort by createdAt in JavaScript (SAME AS WEB APP)
      bookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Check for new bookings and show notification
      if (!isFirstLoad && bookings.length > lastBookingCount) {
        console.log('🎉 NEW BOOKING DETECTED!');
        showNewBookingNotification();
        
        // Vibrate if available
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
      
      lastBookingCount = bookings.length;
      isFirstLoad = false;
      
      const totalJobs = bookings.length;
      const activeJobs = bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length;
      const completedJobs = bookings.filter(b => b.status === 'completed').length;
      
      // Calculate monthly earnings (matching web app)
      let monthlyEarnings = 0;
      bookings.forEach(b => {
        if (b.status === 'completed' && b.amount) {
          monthlyEarnings += b.amount;
        }
      });
      
      // Calculate "today" bookings (using date field, matching web app)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayBookings = bookings.filter(b => {
        const bookingDate = b.date?.toDate ? b.date.toDate() : (b.date instanceof Date ? b.date : null);
        if (!bookingDate) return false;
        const compareDate = new Date(bookingDate);
        compareDate.setHours(0, 0, 0, 0);
        return compareDate >= today;
      });
      
      // Update stats with animated colors
      const statsContainer = document.getElementById('statsContainer');
      if (statsContainer) {
        statsContainer.innerHTML = `
          <div style="background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #3b82f6;">${totalJobs}</div>
            <div style="font-size: 11px; color: #666;">Total Jobs</div>
          </div>
          <div style="background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #f59e0b;">${activeJobs}</div>
            <div style="font-size: 11px; color: #666;">Active</div>
          </div>
          <div style="background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #10b981;">${completedJobs}</div>
            <div style="font-size: 11px; color: #666;">Completed</div>
          </div>
        `;
      }
      
      // Update "Today" count
      const todayCountEl = document.getElementById('todayCount');
      if (todayCountEl) {
        todayCountEl.textContent = `${todayBookings.length} Today`;
      }
      
      // Show recent bookings (last 5 upcoming/active)
      const recentBookings = bookings
        .filter(b => ['pending', 'confirmed'].includes(b.status))
        .slice(0, 5);
    
    const recentContainer = document.getElementById('recentBookingsContainer');
    if (recentContainer) {
      if (recentBookings.length === 0) {
        recentContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 60px; margin-bottom: 16px;">📋</div>
            <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">No bookings yet</h3>
            <p style="font-size: 14px; color: #666;">New bookings will appear here</p>
          </div>
        `;
      } else {
        recentContainer.innerHTML = recentBookings.map(booking => {
          const statusColors = {
            pending: '#f59e0b',
            confirmed: '#3b82f6',
            completed: '#10b981',
            cancelled: '#ef4444'
          };
          const statusColor = statusColors[booking.status] || '#666';
          const date = booking.date?.toDate() || new Date();
          
          // Use booking data directly from DB (EXACT SAME AS WEB APP)
          console.log('📋 Displaying booking:', {
            customerName: booking.customerName,
            phone: booking.phone,
            customerPhone: booking.customerPhone,
            address: booking.address,
            customerEmail: booking.customerEmail
          });
          
          return `
            <div style="background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                  <h4 style="font-size: 16px; font-weight: 700; color: #333; margin-bottom: 4px;">${booking.serviceType || 'Service'}</h4>
                  <p style="font-size: 13px; color: #666; font-weight: 600;">${booking.customerName || 'Customer'}</p>
                </div>
                <span style="padding: 4px 12px; background: ${statusColor}20; color: ${statusColor}; border-radius: 12px; font-size: 12px; font-weight: 600;">${booking.status}</span>
              </div>
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
                📅 ${date.toLocaleDateString()} • ${booking.timeSlot || 'N/A'}
              </div>
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
                📞 ${booking.phone || 'N/A'}
              </div>
              ${booking.customerEmail ? `
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
                📧 ${booking.customerEmail}
              </div>
              ` : ''}
              ${booking.address ? `
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
                📍 ${booking.address}
              </div>
              ` : ''}
              ${booking.status === 'pending' ? `
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                  <button onclick="window.mobileApp.updateBookingStatus('${booking.id}', 'confirmed')" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Accept</button>
                  <button onclick="window.mobileApp.updateBookingStatus('${booking.id}', 'cancelled')" style="flex: 1; padding: 10px; background: #ef4444; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Reject</button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }
    }
    
    // Update Earnings Trend (last 6 months - matching web app)
    const earningsChartContainer = document.getElementById('earningsChartContainer');
    const totalEarningsDisplay = document.getElementById('totalEarningsDisplay');
    
    if (earningsChartContainer && totalEarningsDisplay) {
      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyEarnings = [];
      let totalEarnings = 0;
      
      // Calculate earnings for last 6 months
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthNames[targetDate.getMonth()];
        
        const monthlyTotal = bookings
          .filter(b => {
            const bookingDate = b.date?.toDate ? b.date.toDate() : (b.date instanceof Date ? b.date : null);
            if (!bookingDate) return false;
            return (
              b.status === 'completed' &&
              bookingDate.getMonth() === targetDate.getMonth() &&
              bookingDate.getFullYear() === targetDate.getFullYear()
            );
          })
          .reduce((sum, b) => sum + (b.amount || 0), 0);
        
        monthlyEarnings.push({ name: monthName, total: monthlyTotal });
        totalEarnings += monthlyTotal;
      }
      
      // Update total earnings display
      totalEarningsDisplay.innerHTML = `
        <div style="font-size: 20px; font-weight: 700; color: #10b981;">₹${totalEarnings.toLocaleString()}</div>
        <div style="font-size: 11px; color: #666;">Total</div>
      `;
      
      // Create simple bar chart
      const maxEarning = Math.max(...monthlyEarnings.map(m => m.total), 1);
      
      earningsChartContainer.innerHTML = `
        <div style="display: flex; align-items: end; gap: 8px; height: 120px; padding: 10px 0;">
          ${monthlyEarnings.map(month => {
            const heightPercent = (month.total / maxEarning) * 100;
            return `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <div style="font-size: 10px; color: #666; font-weight: 600;">₹${(month.total / 1000).toFixed(1)}k</div>
                <div style="width: 100%; height: ${heightPercent}%; min-height: 4px; background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%); border-radius: 4px 4px 0 0; transition: height 0.3s;"></div>
                <div style="font-size: 11px; color: #888; font-weight: 600;">${month.name}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
    
    // Update Recent Activity section
    const activityContainer = document.getElementById('recentActivityContainer');
    if (activityContainer) {
      const recentActivity = bookings.slice(0, 5);
      
      if (recentActivity.length === 0) {
        activityContainer.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <p style="color: #999; font-size: 13px;">No activity yet</p>
          </div>
        `;
      } else {
        activityContainer.innerHTML = recentActivity.map(booking => {
          const statusIcons = {
            pending: '⏳',
            confirmed: '✅',
            completed: '🎉',
            cancelled: '❌'
          };
          const statusColors = {
            pending: '#f59e0b',
            confirmed: '#3b82f6',
            completed: '#10b981',
            cancelled: '#ef4444'
          };
          const icon = statusIcons[booking.status] || '📋';
          const statusColor = statusColors[booking.status] || '#666';
          const date = booking.createdAt?.toDate() || new Date();
          const customerInitial = (booking.customerName || 'C').charAt(0).toUpperCase();
          
          return `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
              <div style="width: 40px; height: 40px; background: ${statusColor}20; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: ${statusColor}; flex-shrink: 0;">
                ${customerInitial}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 2px;">${booking.customerName || 'Customer'}</div>
                <div style="font-size: 12px; color: #666;">${booking.serviceType}</div>
                <div style="font-size: 11px; color: #999;">${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              </div>
              <div style="text-align: right;">
                <div style="padding: 4px 8px; background: ${statusColor}20; color: ${statusColor}; border-radius: 8px; font-size: 11px; font-weight: 600; white-space: nowrap; margin-bottom: 4px;">
                  ${booking.status}
                </div>
                ${booking.amount ? `<div style="font-size: 12px; font-weight: 600; color: #333;">₹${booking.amount}</div>` : ''}
              </div>
            </div>
          `;
        }).join('');
      }
    }
    
    }, (error) => {
      console.error('❌ Error in real-time listener:', error);
    });
    
  } catch (error) {
    console.error('Error setting up provider dashboard:', error);
  }
}

// ============================================================================
// NEW BOOKING NOTIFICATION POPUP
// ============================================================================
function showNewBookingNotification() {
  // Remove existing notification if any
  const existing = document.getElementById('newBookingNotification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification popup (mirroring web app style)
  const notification = document.createElement('div');
  notification.id = 'newBookingNotification';
  notification.innerHTML = `
    <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; width: 90%; max-width: 400px; animation: slideDown 0.3s ease-out;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 16px 20px; border-radius: 16px; box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4); display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 32px; animation: bounce 1s infinite;">🎉</div>
        <div style="flex: 1;">
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">New Booking!</div>
          <div style="font-size: 13px; opacity: 0.95;">You have a new booking for service</div>
        </div>
        <button onclick="document.getElementById('newBookingNotification').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; font-size: 16px; cursor: pointer; flex-shrink: 0;">✕</button>
      </div>
    </div>
    <style>
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
    </style>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    const notif = document.getElementById('newBookingNotification');
    if (notif) {
      notif.style.animation = 'slideDown 0.3s ease-out reverse';
      setTimeout(() => notif.remove(), 300);
    }
  }, 5000);
  
  console.log('✅ New booking notification shown');
}

function attachProviderBookingsHandlers() {
  loadProviderBookings('all');
}

let currentProviderBookings = [];

async function loadProviderBookings(status = 'all') {
  const providerId = auth.currentUser?.uid;
  if (!providerId) return;
  
  const container = document.getElementById('providerBookingsContainer');
  if (!container) return;
  
  try {
    const bookingsRef = collection(db, 'bookings');
    // Remove orderBy to avoid Firebase index requirement - sort in JavaScript (SAME AS WEB APP)
    const q = query(bookingsRef, where('providerId', '==', providerId));
    const querySnapshot = await getDocs(q);
    
    currentProviderBookings = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      currentProviderBookings.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });
    
    // Sort by createdAt in JavaScript (SAME AS WEB APP)
    currentProviderBookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    filterProviderBookings(status);
    
  } catch (error) {
    console.error('Error loading provider bookings:', error);
    container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: #dc2626;">Error loading bookings</div>`;
  }
}

function filterProviderBookings(status) {
  const container = document.getElementById('providerBookingsContainer');
  if (!container) return;
  
  // Update filter buttons
  ['All', 'Pending', 'Confirmed', 'Completed'].forEach(filter => {
    const btn = document.getElementById(`filter${filter}`);
    if (btn) {
      const isActive = filter.toLowerCase() === status;
      btn.style.background = isActive ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : '#e5e7eb';
      btn.style.color = isActive ? 'white' : '#666';
    }
  });
  
  // Filter bookings
  const filtered = status === 'all' 
    ? currentProviderBookings 
    : currentProviderBookings.filter(b => b.status === status);
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 60px; margin-bottom: 16px;">📋</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">No ${status !== 'all' ? status : ''} bookings</h3>
        <p style="font-size: 14px; color: #666;">Check back later for new bookings</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(booking => {
    const statusColors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    const statusColor = statusColors[booking.status] || '#666';
    const date = booking.date?.toDate() || new Date();
    
    return `
      <div style="background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
          <div>
            <h4 style="font-size: 16px; font-weight: 700; color: #333; margin-bottom: 4px;">${booking.serviceType}</h4>
            <p style="font-size: 13px; color: #666;">${booking.customerName}</p>
          </div>
          <span style="padding: 4px 12px; background: ${statusColor}20; color: ${statusColor}; border-radius: 12px; font-size: 12px; font-weight: 600;">${booking.status}</span>
        </div>
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
          📅 ${date.toLocaleDateString()} • ${booking.timeSlot}
        </div>
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
          📞 ${booking.customerPhone}
        </div>
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
          📍 ${booking.address}
        </div>
        ${booking.notes ? `<div style="font-size: 13px; color: #666; margin-bottom: 8px;">📝 ${booking.notes}</div>` : ''}
        ${booking.status === 'pending' ? `
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button onclick="window.mobileApp.updateBookingStatus('${booking.id}', 'confirmed')" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Accept</button>
            <button onclick="window.mobileApp.updateBookingStatus('${booking.id}', 'cancelled')" style="flex: 1; padding: 10px; background: #ef4444; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Reject</button>
          </div>
        ` : booking.status === 'confirmed' ? `
          <button onclick="window.mobileApp.updateBookingStatus('${booking.id}', 'completed')" style="width: 100%; padding: 10px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; margin-top: 12px; cursor: pointer;">Mark as Completed</button>
        ` : ''}
      </div>
    `;
  }).join('');
}

async function updateBookingStatus(bookingId, newStatus) {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status: newStatus });
    
    // Refresh current screen
    const userType = localStorage.getItem('userType');
    if (userType === 'provider') {
      if (currentScreen === 'provider-dashboard') {
        loadProviderDashboardData();
      } else if (currentScreen === 'provider-bookings') {
        loadProviderBookings('all');
      }
    }
    
    alert(`Booking ${newStatus === 'confirmed' ? 'accepted' : newStatus === 'completed' ? 'completed' : 'cancelled'} successfully!`);
  } catch (error) {
    console.error('Error updating booking:', error);
    alert('Failed to update booking status');
  }
}

// ============================================================================
// PROVIDER SERVICES HANDLERS (FULL CRUD)
// ============================================================================
function attachProviderServicesHandlers() {
  loadProviderServices();
}

async function loadProviderServices() {
  const providerId = auth.currentUser?.uid;
  if (!providerId) return;
  
  console.log('🔍 Loading provider services for ID:', providerId);
  
  try {
    const providerDoc = await getDoc(doc(db, 'providers', providerId));
    
    if (!providerDoc.exists()) {
      console.log('❌ Provider document not found for ID:', providerId);
      providerServices = [];
      renderProviderServices();
      return;
    }
    
    const data = providerDoc.data();
    console.log('✅ Provider document found:', {
      name: data.name,
      businessName: data.businessName,
      servicesCount: data.services?.length || 0,
      services: data.services
    });
    
    providerServices = data.services || [];
    console.log('📋 Services loaded:', providerServices);
    renderProviderServices();
    
  } catch (error) {
    console.error('❌ Error loading provider services:', error);
    const container = document.getElementById('providerServicesContainer');
    if (container) {
      container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: #dc2626;">Error loading services: ${error.message}</div>`;
    }
  }
}

function toggleServiceExpand(idx) {
  expandedServiceIndex = expandedServiceIndex === idx ? null : idx;
  renderProviderServices();
}

// Add Service Category Dialog
function openAddServiceDialog() {
  const availableCategories = Object.keys(SERVICE_CATEGORIES);
  const usedCategories = providerServices.map(s => s.category);
  const unusedCategories = availableCategories.filter(cat => !usedCategories.includes(cat));
  
  if (unusedCategories.length === 0) {
    alert('All service categories have been added!');
    return;
  }
  
  const dialogHTML = `
    <div id="serviceDialog" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px;" onclick="window.mobileApp.closeDialog('serviceDialog')">
      <div style="background: white; border-radius: 16px; padding: 24px; max-width: 400px; width: 100%; max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
        <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px;">Add Service Category</h3>
        
        <div style="margin-bottom: 20px;">
          ${unusedCategories.map(cat => `
            <div onclick="window.mobileApp.addServiceCategory('${cat}')" style="padding: 14px; margin-bottom: 8px; background: white; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">${SERVICES.find(s => s.category === cat)?.icon || '🛠️'}</div>
              <div style="font-size: 14px; font-weight: 600; color: #333;">${cat}</div>
            </div>
          `).join('')}
        </div>
        
        <button onclick="window.mobileApp.closeDialog('serviceDialog')" style="width: 100%; padding: 12px; background: #e5e7eb; color: #333; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
          Cancel
        </button>
      </div>
    </div>
  `;
  
  const div = document.createElement('div');
  div.innerHTML = dialogHTML;
  document.body.appendChild(div.firstElementChild);
}

async function addServiceCategory(category) {
  providerServices.push({
    category: category,
    subcategories: []
  });
  
  await saveProviderServices();
  closeDialog('serviceDialog');
  expandedServiceIndex = providerServices.length - 1;
  renderProviderServices();
}

// Add Subcategory Dialog
function openAddSubcategoryDialog(categoryIdx) {
  const category = providerServices[categoryIdx].category;
  const availableSubcategories = SERVICE_CATEGORIES[category] || [];
  const usedSubcategories = providerServices[categoryIdx].subcategories.map(s => s.name);
  const unusedSubcategories = availableSubcategories.filter(sub => !usedSubcategories.includes(sub));
  
  if (unusedSubcategories.length === 0) {
    alert('All subcategories for this category have been added!');
    return;
  }
  
  const dialogHTML = `
    <div id="subcategoryDialog" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px;" onclick="window.mobileApp.closeDialog('subcategoryDialog')">
      <div style="background: white; border-radius: 16px; padding: 24px; max-width: 400px; width: 100%;" onclick="event.stopPropagation()">
        <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px;">Add Subcategory</h3>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Service Name</label>
          <select id="subName" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; background: white;">
            <option value="">Select service</option>
            ${unusedSubcategories.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
          </select>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Price (₹)</label>
          <input type="number" id="subPrice" value="500" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;" />
        </div>
        
        <div style="display: flex; gap: 12px;">
          <button onclick="window.mobileApp.closeDialog('subcategoryDialog')" style="flex: 1; padding: 12px; background: #e5e7eb; color: #333; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
            Cancel
          </button>
          <button onclick="window.mobileApp.addSubcategory(${categoryIdx})" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
            Add
          </button>
        </div>
      </div>
    </div>
  `;
  
  const div = document.createElement('div');
  div.innerHTML = dialogHTML;
  document.body.appendChild(div.firstElementChild);
}

async function addSubcategory(categoryIdx) {
  const name = document.getElementById('subName').value.trim();
  const price = parseInt(document.getElementById('subPrice').value);
  
  if (!name || !price) {
    alert('Please enter both name and price');
    return;
  }
  
  providerServices[categoryIdx].subcategories.push({ name, price });
  await saveProviderServices();
  closeDialog('subcategoryDialog');
  renderProviderServices();
}

// Edit Subcategory Dialog
function editSubcategory(categoryIdx, subIdx) {
  const sub = providerServices[categoryIdx].subcategories[subIdx];
  
  const dialogHTML = `
    <div id="editDialog" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px;" onclick="window.mobileApp.closeDialog('editDialog')">
      <div style="background: white; border-radius: 16px; padding: 24px; max-width: 400px; width: 100%;" onclick="event.stopPropagation()">
        <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px;">Edit Subcategory</h3>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Service Name</label>
          <input type="text" id="editSubName" value="${sub.name}" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;" />
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Price (₹)</label>
          <input type="number" id="editSubPrice" value="${sub.price}" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;" />
        </div>
        
        <div style="display: flex; gap: 12px;">
          <button onclick="window.mobileApp.closeDialog('editDialog')" style="flex: 1; padding: 12px; background: #e5e7eb; color: #333; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
            Cancel
          </button>
          <button onclick="window.mobileApp.saveEditSubcategory(${categoryIdx}, ${subIdx})" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
            Save
          </button>
        </div>
      </div>
    </div>
  `;
  
  const div = document.createElement('div');
  div.innerHTML = dialogHTML;
  document.body.appendChild(div.firstElementChild);
}

async function saveEditSubcategory(categoryIdx, subIdx) {
  const name = document.getElementById('editSubName').value.trim();
  const price = parseInt(document.getElementById('editSubPrice').value);
  
  if (!name || !price) {
    alert('Please enter both name and price');
    return;
  }
  
  providerServices[categoryIdx].subcategories[subIdx] = { name, price };
  await saveProviderServices();
  closeDialog('editDialog');
  renderProviderServices();
}

// Delete Subcategory
async function deleteSubcategory(categoryIdx, subIdx) {
  if (confirm('Are you sure you want to delete this subcategory?')) {
    providerServices[categoryIdx].subcategories.splice(subIdx, 1);
    await saveProviderServices();
    renderProviderServices();
  }
}

// Delete Service Category
async function deleteServiceCategory(categoryIdx) {
  const category = providerServices[categoryIdx].category;
  if (confirm(`Are you sure you want to delete ${category} and all its subcategories?`)) {
    providerServices.splice(categoryIdx, 1);
    expandedServiceIndex = null;
    await saveProviderServices();
    renderProviderServices();
  }
}

// Save to Firebase
async function saveProviderServices() {
  const providerId = auth.currentUser?.uid;
  if (!providerId) return;
  
  try {
    const serviceCategories = providerServices.map(s => s.category);
    await updateDoc(doc(db, 'providers', providerId), {
      services: providerServices,
      serviceCategories: serviceCategories
    });
    console.log('✅ Services saved successfully');
  } catch (error) {
    console.error('Error saving services:', error);
    alert('Failed to save services. Please try again.');
  }
}

// Close Dialog
function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog) dialog.remove();
}

function attachProviderProfileHandlers() {
  console.log('Provider profile loaded');
}

// ============================================================================
// PROVIDER EARNINGS HANDLERS
// ============================================================================
function attachProviderEarningsHandlers() {
  loadProviderEarnings();
}

async function loadProviderEarnings() {
  const providerId = auth.currentUser?.uid;
  if (!providerId) return;
  
  const container = document.getElementById('earningsContainer');
  if (!container) return;
  
  try {
    // Query all completed bookings for this provider
    const bookingsRef = collection(db, 'bookings');
    // Remove orderBy to avoid Firebase index requirement - sort in JavaScript (SAME AS WEB APP)
    const q = query(bookingsRef, where('providerId', '==', providerId), where('status', '==', 'completed'));
    const querySnapshot = await getDocs(q);
    
    const bookings = [];
    let totalEarnings = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date()
      });
      totalEarnings += data.amount || 0;
    });
    
    // Sort by createdAt in JavaScript (SAME AS WEB APP)
    bookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Calculate monthly earnings
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyEarnings = bookings.filter(b => {
      const bookingDate = b.createdAt;
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    }).reduce((sum, b) => sum + (b.amount || 0), 0);
    
    container.innerHTML = `
      <!-- Earnings Stats -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 16px; padding: 20px; color: white;">
          <div style="font-size: 13px; opacity: 0.9; margin-bottom: 8px;">Total Earnings</div>
          <div style="font-size: 28px; font-weight: 700;">₹${totalEarnings}</div>
        </div>
        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <div style="font-size: 13px; color: #666; margin-bottom: 8px;">This Month</div>
          <div style="font-size: 28px; font-weight: 700; color: #10b981;">₹${monthlyEarnings}</div>
        </div>
      </div>
      
      <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 4px;">Completed Jobs</div>
        <div style="font-size: 24px; font-weight: 700; color: #333;">${bookings.length}</div>
      </div>
      
      <!-- Payment History -->
      <h3 style="font-size: 16px; font-weight: 700; color: #333; margin-bottom: 12px;">Payment History</h3>
      
      ${bookings.length === 0 ? `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 60px; margin-bottom: 16px;">💰</div>
          <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">No earnings yet</h3>
          <p style="font-size: 14px; color: #666;">Complete jobs to start earning</p>
        </div>
      ` : bookings.map(booking => `
        <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div>
              <h4 style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 4px;">${booking.serviceType}</h4>
              <p style="font-size: 12px; color: #666;">${booking.customerName}</p>
            </div>
            <div style="font-size: 16px; font-weight: 700; color: #10b981;">₹${booking.amount || 0}</div>
          </div>
          <div style="font-size: 12px; color: #999;">${booking.createdAt.toLocaleDateString()}</div>
        </div>
      `).join('')}
    `;
    
  } catch (error) {
    console.error('Error loading earnings:', error);
    container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: #dc2626;">Error loading earnings</div>`;
  }
}

// ============================================================================
// PROVIDER REVIEWS HANDLERS
// ============================================================================
function attachProviderReviewsHandlers() {
  loadProviderReviews();
}

async function loadProviderReviews() {
  const providerId = auth.currentUser?.uid;
  if (!providerId) return;
  
  const container = document.getElementById('reviewsContainer');
  if (!container) return;
  
  try {
    const providerDoc = await getDoc(doc(db, 'providers', providerId));
    
    if (!providerDoc.exists()) {
      container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: #666;">Provider data not found</div>`;
      return;
    }
    
    const data = providerDoc.data();
    const rating = data.rating || 0;
    const reviews = data.reviews || 0;
    const totalRatings = data.totalRatings || 0;
    
    container.innerHTML = `
      <!-- Overall Rating -->
      <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px; text-align: center;">
        <div style="font-size: 48px; font-weight: 700; color: #3b82f6; margin-bottom: 8px;">${rating.toFixed(1)}</div>
        <div style="display: flex; justify-content: center; gap: 4px; margin-bottom: 8px;">
          ${[1,2,3,4,5].map(star => `
            <span style="font-size: 24px; color: ${star <= rating ? '#fbbf24' : '#e5e7eb'};">⭐</span>
          `).join('')}
        </div>
        <p style="font-size: 14px; color: #666;">${totalRatings} ratings • ${reviews} reviews</p>
      </div>
      
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 60px; margin-bottom: 16px;">⭐</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px;">No reviews yet</h3>
        <p style="font-size: 14px; color: #666;">Customer reviews will appear here</p>
      </div>
    `;
    
  } catch (error) {
    console.error('Error loading reviews:', error);
    container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: #dc2626;">Error loading reviews</div>`;
  }
}

// ============================================================================
// PROVIDER DOCUMENTS HANDLERS
// ============================================================================
function attachProviderDocumentsHandlers() {
  console.log('Documents screen loaded');
}

// ============================================================================
// PROVIDER SETTINGS HANDLERS
// ============================================================================
function attachProviderSettingsHandlers() {
  console.log('Settings screen loaded');
}

// ============================================================================
// SETUP WIZARD HANDLERS
// ============================================================================
function attachSetupWizardHandlers() {
  console.log('Setup wizard loaded - Step', wizardStep);
  
  // Character counter for description
  const descField = document.getElementById('businessDescription');
  if (descField) {
    descField.addEventListener('input', (e) => {
      const count = document.getElementById('descCount');
      if (count) count.textContent = e.target.value.length;
    });
  }
  
  // Business type radio buttons
  document.querySelectorAll('input[name="businessType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      wizardData.step1.businessType = radio.value;
      showScreen('setup-wizard'); // Refresh to show selection
    });
  });
  
  // Location capture in wizard (Step 1)
  const wizardLocationBtn = document.getElementById('wizardGetLocationBtn');
  if (wizardLocationBtn) {
    wizardLocationBtn.addEventListener('click', captureWizardLocation);
  }
  
  // Availability checkboxes
  document.querySelectorAll('input[name="availability"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const availability = Array.from(document.querySelectorAll('input[name="availability"]:checked'))
        .map(cb => cb.value);
      wizardData.step3.availability = availability;
      showScreen('setup-wizard'); // Refresh to show selection
    });
  });
}

// Capture location in Setup Wizard (SAME AS WEB APP)
function captureWizardLocation() {
  const locationBtn = document.getElementById('wizardGetLocationBtn');
  const locationBtnText = document.getElementById('wizardLocationBtnText');
  const locationStatus = document.getElementById('wizardLocationStatus');
  const locationError = document.getElementById('wizardLocationError');
  
  locationError.style.display = 'none';
  
  if (!navigator.geolocation) {
    locationError.textContent = 'Geolocation is not supported by your device';
    locationError.style.display = 'block';
    return;
  }
  
  locationBtnText.textContent = 'Getting location...';
  locationBtn.disabled = true;
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      // Store in wizard data
      wizardData.step1.location = location;
      
      // Also update global variable
      userLocation = location;
      localStorage.setItem('userLocation', JSON.stringify(location));
      
      locationStatus.textContent = '✅ Captured';
      locationStatus.style.color = '#10b981';
      locationBtnText.textContent = '✓ Location Captured';
      locationBtn.style.background = '#10b981';
      locationBtn.style.color = 'white';
      locationBtn.style.borderColor = '#10b981';
      
      console.log('📍 Wizard location captured:', location);
    },
    (error) => {
      console.error('Location error:', error);
      locationError.textContent = 'Could not get location. Please enable location access in settings.';
      locationError.style.display = 'block';
      locationBtnText.textContent = 'Retry';
      locationBtn.disabled = false;
    }
  );
}

// Wizard navigation functions
function wizardNextStep() {
  const errorDiv = document.getElementById('wizardError');
  const btn = document.getElementById('wizardNextBtn');
  
  if (errorDiv) errorDiv.style.display = 'none';
  
  // Validate current step
  try {
    if (wizardStep === 1) {
      const companyName = document.getElementById('companyName').value.trim();
      const businessType = document.querySelector('input[name="businessType"]:checked')?.value;
      const city = document.getElementById('city').value.trim();
      const address = document.getElementById('address').value.trim();
      const businessDescription = document.getElementById('businessDescription').value.trim();
      
      if (!companyName) throw new Error('Company name is required');
      if (!businessType) throw new Error('Please select business type');
      if (!city) throw new Error('City is required');
      if (businessDescription.length < 20) throw new Error('Business description must be at least 20 characters');
      
      // Validate location (SAME AS WEB APP)
      if (!wizardData.step1.location) {
        throw new Error('Business location is required. Please click "Get Location"');
      }
      
      wizardData.step1 = {
        companyName,
        businessType,
        city,
        address,
        businessDescription,
        location: wizardData.step1.location // Keep location
      };
      
    } else if (wizardStep === 2) {
      const experience = document.getElementById('experience').value;
      
      if (!experience) throw new Error('Experience is required');
      if (wizardData.step2.services.length === 0) throw new Error('Please select at least one service');
      
      wizardData.step2.experience = experience;
      
    } else if (wizardStep === 3) {
      const availability = Array.from(document.querySelectorAll('input[name="availability"]:checked'))
        .map(cb => cb.value);
      const workStart = document.getElementById('workStart').value;
      const workEnd = document.getElementById('workEnd').value;
      const priceRange = document.getElementById('priceRange').value;
      
      if (availability.length === 0) throw new Error('Please select at least one working day');
      if (!workStart || !workEnd) throw new Error('Working hours are required');
      if (!priceRange) throw new Error('Price range is required');
      
      wizardData.step3 = {
        availability,
        workingHours: { start: workStart, end: workEnd },
        priceRange
      };
      
    } else if (wizardStep === 4) {
      const termsAccepted = document.getElementById('termsAccepted').checked;
      
      if (!termsAccepted) throw new Error('Please accept the terms and conditions');
      
      wizardData.step4 = { termsAccepted };
      
      // Submit the wizard
      btn.disabled = true;
      btn.textContent = 'Saving...';
      submitWizard();
      return;
    }
    
    // Move to next step
    wizardStep++;
    showScreen('setup-wizard');
    window.scrollTo(0, 0);
    
  } catch (error) {
    if (errorDiv) {
      errorDiv.textContent = error.message;
      errorDiv.style.display = 'block';
    }
  }
}

function wizardPrevStep() {
  if (wizardStep > 1) {
    wizardStep--;
    showScreen('setup-wizard');
    window.scrollTo(0, 0);
  }
}

// Service management functions
// Toggle category expand/collapse
function toggleWizardCategory(category) {
  const index = expandedCategories.indexOf(category);
  if (index > -1) {
    expandedCategories.splice(index, 1);
  } else {
    expandedCategories.push(category);
  }
  showScreen('setup-wizard');
}

// Toggle entire category selection (select/deselect all subcategories)
function toggleCategorySelection(category) {
  const categoryService = wizardData.step2.services.find(s => s.category === category);
  
  if (categoryService && categoryService.subcategories.length > 0) {
    // Remove category
    wizardData.step2.services = wizardData.step2.services.filter(s => s.category !== category);
  } else {
    // Add category with all subcategories
    if (!SERVICE_CATEGORIES[category]) return;
    
    const subcategories = SERVICE_CATEGORIES[category].map(name => ({
      name,
      price: 500
    }));
    
    wizardData.step2.services.push({
      category,
      subcategories
    });
    
    // Auto-expand
    if (!expandedCategories.includes(category)) {
      expandedCategories.push(category);
    }
  }
  
  showScreen('setup-wizard');
}

// Toggle individual subcategory
function toggleSubcategory(category, subcategory) {
  let categoryService = wizardData.step2.services.find(s => s.category === category);
  
  if (!categoryService) {
    // Create category if doesn't exist
    categoryService = {
      category,
      subcategories: []
    };
    wizardData.step2.services.push(categoryService);
  }
  
  const subcatIndex = categoryService.subcategories.findIndex(s => s.name === subcategory);
  
  if (subcatIndex > -1) {
    // Remove subcategory
    categoryService.subcategories.splice(subcatIndex, 1);
    
    // Remove category if no subcategories left
    if (categoryService.subcategories.length === 0) {
      wizardData.step2.services = wizardData.step2.services.filter(s => s.category !== category);
    }
  } else {
    // Add subcategory with default price
    categoryService.subcategories.push({
      name: subcategory,
      price: 500
    });
  }
  
  showScreen('setup-wizard');
}

// Update subcategory price
function updateSubcategoryPrice(category, subcategory, newPrice) {
  const categoryService = wizardData.step2.services.find(s => s.category === category);
  if (categoryService) {
    const subcat = categoryService.subcategories.find(s => s.name === subcategory);
    if (subcat) {
      subcat.price = parseFloat(newPrice) || 500;
    }
  }
}

// Submit wizard to Firebase
async function submitWizard() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    // Prepare profile data (EXACT web app structure)
    const providerData = {
      // User info
      uid: user.uid,
      email: user.email,
      name: wizardData.step1.companyName,
      phone: user.phoneNumber || '',
      role: 'provider',
      userType: 'provider',
      
      // Business Information (Step 1)
      businessName: wizardData.step1.companyName,
      companyName: wizardData.step1.companyName,
      businessType: wizardData.step1.businessType,
      city: wizardData.step1.city,
      address: wizardData.step1.address || '',
      businessDescription: wizardData.step1.businessDescription,
      companyLogo: '',
      location: wizardData.step1.location || null, // SAME AS WEB APP
      
      // Services & Pricing (Step 2)
      services: wizardData.step2.services,
      serviceCategories: wizardData.step2.services.map(s => s.category),
      experience: wizardData.step2.experience,
      specialization: '',
      
      // Availability (Step 3)
      availability: wizardData.step3.availability,
      workingHours: wizardData.step3.workingHours,
      priceRange: wizardData.step3.priceRange,
      
      // Documents (Step 4)
      documents: {
        idProof: null,
        addressProof: null,
        certifications: null,
        bankDetails: null
      },
      termsAccepted: true, // Always true when wizard is completed
      
      // Profile completion flag
      isProfileComplete: true,
      profileCompletedAt: serverTimestamp(),
      
      // Additional fields
      verified: false,
      active: true,
      rating: 0,
      totalRatings: 0,
      reviews: 0,
      totalBookings: 0,
      completedJobs: 0,
      monthlyEarnings: 0,
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Save to Firebase
    const providerRef = doc(db, 'providers', user.uid);
    await setDoc(providerRef, providerData);
    
    // Update localStorage
    localStorage.setItem('userName', providerData.businessName);
    localStorage.setItem('userType', 'provider');
    
    alert('🎉 Profile completed successfully! Redirecting to dashboard...');
    
    // Reset wizard
    wizardStep = 1;
    wizardData = {
      step1: {},
      step2: { services: [] },
      step3: {},
      step4: {}
    };
    
    // Redirect to dashboard
    showScreen('provider-dashboard');
    
  } catch (error) {
    console.error('Error submitting wizard:', error);
    alert('Failed to save profile. Please try again.');
    const btn = document.getElementById('wizardNextBtn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Complete Setup';
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function selectService(serviceId) {
  selectedService = SERVICES.find(s => s.id === serviceId);
  if (selectedService) {
    showScreen('service-detail');
  }
}

function bookProvider(providerId) {
  selectedProvider = providerId;
  showScreen('booking-form');
}

async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    try {
      await signOut(auth);
      localStorage.clear();
      showScreen('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================

// Test notification function
async function testNotification() {
  if (window.notificationService) {
    await window.notificationService.sendPromotionalNotification(
      'Test Notification',
      'This is a test notification from UrbanEzii mobile app!',
      '/logo.png'
    );
  } else {
    alert('Notification service not available');
  }
}

// Send promotional notification
async function sendPromotionalNotification(type) {
  if (window.sendPromotionalNotification) {
    const result = await window.sendPromotionalNotification(type);
    if (result.success) {
      alert(`✅ ${type} notification sent to ${result.sentTo} users!`);
    } else {
      alert(`❌ Failed to send notification: ${result.error}`);
    }
  } else {
    alert('Notification API not available');
  }
}

// ============================================================================
// NOTIFICATION TOGGLE HANDLERS
// ============================================================================

// Update toggle visual state
function updateToggleVisual(toggleId, isChecked) {
  const slider = document.getElementById(toggleId + 'Slider');
  const thumb = document.getElementById(toggleId + 'Thumb');
  
  if (slider && thumb) {
    if (isChecked) {
      slider.style.backgroundColor = '#3b82f6';
      thumb.style.left = '29px';
    } else {
      slider.style.backgroundColor = '#ccc';
      thumb.style.left = '3px';
    }
  }
}

// Handle main notification toggle
async function handleNotificationToggle(event) {
  const isEnabled = event.target.checked;
  console.log('🔔 Notification toggle changed:', isEnabled);
  
  if (isEnabled) {
    // Request notification permissions
    try {
      if (window.notificationService) {
        const success = await window.notificationService.initialize();
        if (success) {
          alert('✅ Notifications enabled! You will now receive push notifications.');
        } else {
          alert('❌ Notification permission denied. Please enable in device settings.');
          event.target.checked = false;
        }
      } else {
        // Fallback for web notifications
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          alert('✅ Notifications enabled! You will now receive push notifications.');
        } else {
          alert('❌ Notification permission denied. Please enable in browser settings.');
          event.target.checked = false;
        }
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      alert('❌ Failed to enable notifications. Please try again.');
      event.target.checked = false;
    }
  } else {
    alert('🔕 Notifications disabled. You can re-enable them anytime from settings.');
  }
  
  // Save preference to localStorage
  localStorage.setItem('notificationsEnabled', isEnabled);
}

// Handle booking notification toggle
function handleBookingNotificationToggle(event) {
  const isEnabled = event.target.checked;
  console.log('📋 Booking notifications:', isEnabled);
  localStorage.setItem('bookingNotificationsEnabled', isEnabled);
  
  if (isEnabled) {
    alert('✅ You will receive booking confirmation notifications.');
  } else {
    alert('🔕 Booking notifications disabled.');
  }
}

// Handle promotional notification toggle
function handlePromoNotificationToggle(event) {
  const isEnabled = event.target.checked;
  console.log('🎉 Promotional notifications:', isEnabled);
  localStorage.setItem('promoNotificationsEnabled', isEnabled);
  
  if (isEnabled) {
    alert('✅ You will receive promotional offers and updates.');
  } else {
    alert('🔕 Promotional notifications disabled.');
  }
}

// Manual notification permission request
async function requestNotificationPermission() {
  console.log('🔔 Manual notification permission request');
  
  try {
    // Check if we're on mobile
    if (typeof Capacitor === 'undefined') {
      alert('❌ This feature is only available on mobile devices');
      return;
    }
    
    // Import PushNotifications dynamically
    const { PushNotifications } = await import('@capacitor/push-notifications');
    
    console.log('🔔 Requesting notification permission manually...');
    
    // Request permissions with explicit options
    const permissionStatus = await PushNotifications.requestPermissions({
      permissions: ['receive']
    });
    
    console.log('🔔 Manual permission result:', permissionStatus);
    
    if (permissionStatus.receive === 'granted') {
      console.log('✅ Notification permission granted!');
      
      // Register for push notifications
      await PushNotifications.register();
      console.log('✅ Registered for push notifications');
      
      alert('✅ Notification permission granted! You will now receive push notifications on your lock screen.');
      
      // Update the toggle to show enabled
      const notificationToggle = document.getElementById('notificationToggle');
      if (notificationToggle) {
        notificationToggle.checked = true;
        updateToggleVisual('notificationToggle', true);
      }
      
    } else {
      console.log('❌ Notification permission denied');
      alert('❌ Notification permission denied. You can enable it later in Settings > Apps > UrbanEzii > Notifications');
    }
    
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    alert('❌ Error requesting notification permission: ' + error.message);
  }
}

// ============================================================================
// INTERACTIVE STYLES & ANIMATIONS
// ============================================================================
function getInteractiveStyles() {
  return `
    <style>
      /* ========== RESPONSIVE STYLES ========== */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      /* ========== ANIMATIONS ========== */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes logoFloat {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) translateY(-8px) scale(1.05); }
      }
      
      @keyframes logoBreathe {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(0.95); }
      }
      
      @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(30px, -30px); }
      }
      
      @keyframes orbit {
        0% { transform: translateX(-50%) rotate(0deg) translateX(60px) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg) translateX(60px) rotate(-360deg); }
      }
      
      /* ========== SERVICE CARD HOVER/TOUCH EFFECTS ========== */
      .service-card {
        will-change: transform, box-shadow;
      }
      
      .service-card:active {
        transform: scale(0.95) !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
      }
      
      @media (hover: hover) {
        .service-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.25) !important;
        }
        
        .service-card:hover .service-icon {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
        }
        
        .service-card:hover .service-card-bg {
          height: 100% !important;
          opacity: 0.15;
        }
        
        .service-card:hover .service-arrow {
          transform: translate(4px, -4px) scale(1.2);
          background: rgba(59, 130, 246, 0.25);
        }
      }
      
      /* ========== BUTTON EFFECTS ========== */
      .back-btn:active {
        transform: scale(0.9);
        background: rgba(255,255,255,0.4) !important;
      }
      
      @media (hover: hover) {
        .back-btn:hover {
          background: rgba(255,255,255,0.35) !important;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      }
      
      /* ========== PROVIDER CARD EFFECTS ========== */
      .provider-card {
        will-change: transform, box-shadow;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .provider-card:active {
        transform: scale(0.97);
      }
      
      @media (hover: hover) {
        .provider-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
        }
      }
      
      /* ========== BOTTOM NAV EFFECTS ========== */
      .nav-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }
      
      .nav-item:active {
        transform: scale(0.85);
      }
      
      @media (hover: hover) {
        .nav-item:hover {
          transform: translateY(-4px) scale(1.1);
        }
        
        .nav-item:hover svg {
          filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4));
        }
      }
      
      .nav-item.active {
        animation: pulse 2s ease-in-out infinite;
      }
      
      /* ========== BOOKING BUTTON EFFECTS ========== */
      .book-now-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      
      .book-now-btn:active {
        transform: scale(0.95);
      }
      
      @media (hover: hover) {
        .book-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
        }
        
        .book-now-btn:hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 1.5s infinite;
        }
      }
      
      @keyframes shimmer {
        to {
          left: 100%;
        }
      }
      
      /* ========== INPUT FOCUS EFFECTS ========== */
      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        transform: translateY(-1px);
        transition: all 0.3s ease;
      }
      
      /* ========== RIPPLE EFFECT ========== */
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      }
      
      /* ========== SMOOTH SCROLLING ========== */
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
      }
      
      ::-webkit-scrollbar {
        width: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      }
      
      /* ========== LOADING SHIMMER ========== */
      .shimmer {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer-loading 1.5s infinite;
      }
      
      @keyframes shimmer-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      
      /* ========== STAT CARDS ANIMATION ========== */
      .stat-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .stat-card:active {
        transform: scale(0.95);
      }
      
      @media (hover: hover) {
        .stat-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
        }
      }
      
      /* ========== HAMBURGER MENU EFFECTS ========== */
      .menu-item {
        transition: all 0.2s ease;
      }
      
      .menu-item:active {
        transform: translateX(4px);
        background: rgba(59, 130, 246, 0.15) !important;
      }
      
      @media (hover: hover) {
        .menu-item:hover {
          transform: translateX(8px);
          background: rgba(59, 130, 246, 0.1) !important;
        }
      }
      
      /* ========== SUBTLE FLOAT ANIMATION ========== */
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      
      .float-animation {
        animation: float 3s ease-in-out infinite;
      }
    </style>
  `;
}

// ============================================================================
// EXPORTS & INITIALIZATION
// ============================================================================
// Get Current Location for booking form
async function getCurrentLocation() {
  const addressField = document.getElementById('bookingAddress');
  if (!addressField) return;
  
  if (!navigator.geolocation) {
    alert('Location services are not supported by your device');
    return;
  }
  
  addressField.placeholder = 'Getting location...';
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        
        if (data.display_name) {
          addressField.value = data.display_name;
          alert('✅ Location set successfully!');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        addressField.placeholder = 'Enter your complete address...';
        alert('Could not fetch address. Please enter manually.');
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
      addressField.placeholder = 'Enter your complete address...';
      alert('Please enable location access or enter your address manually.');
    }
  );
}

// Skip setup wizard and go to dashboard
async function skipWizard() {
  const confirmed = confirm('Skip profile setup?\n\nYou can complete it later from your profile settings.');
  if (!confirmed) return;
  
  try {
    const user = auth.currentUser;
    if (!user) {
      alert('User not authenticated');
      return;
    }
    
    // Mark as skipped (not complete) so they can access dashboard but will be reminded later
    await updateDoc(doc(db, 'providers', user.uid), {
      isProfileComplete: false,
      profileSkipped: true,
      profileSkippedAt: new Date()
    });
    
    // Reset wizard data
    wizardStep = 1;
    wizardData = {
      step1: {},
      step2: { services: [] },
      step3: {},
      step4: {}
    };
    
    alert('✅ Profile setup skipped! You can complete it later from your profile settings.');
    showScreen('provider-dashboard');
    
  } catch (error) {
    console.error('Error skipping wizard:', error);
    alert('Failed to skip setup. Please try again.');
  }
}

// Select provider and load full data for booking
async function selectProvider(providerId) {
  try {
    console.log('🔍 Loading provider data for:', providerId);
    
    // Show loading
    const container = document.getElementById('providersContainer');
    if (container) {
      container.innerHTML = getBeautifulLoader('Loading provider details...', false, 'small');
    }
    
    // Load full provider data from Firebase
    const providerRef = doc(db, 'providers', providerId);
    const providerDoc = await getDoc(providerRef);
    
    if (!providerDoc.exists()) {
      alert('Provider not found');
      return;
    }
    
    const providerData = providerDoc.data();
    selectedProvider = {
      id: providerId,
      uid: providerId,
      ...providerData
    };
    
    console.log('✅ Provider loaded:', {
      name: selectedProvider.businessName || selectedProvider.name,
      services: selectedProvider.services,
      category: selectedProvider.category
    });
    
    // Show booking form
    showScreen('booking-form');
    
  } catch (error) {
    console.error('Error loading provider:', error);
    alert('Failed to load provider details');
  }
}

// Update user location and save to database
async function updateLocation() {
  if (!navigator.geolocation) {
    alert('Location services are not supported by your device');
    return;
  }
  
  const confirmed = confirm('Update your location?\n\nThis will capture your current location and save it to your profile.');
  if (!confirmed) return;
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      // Store in localStorage
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
      
      // Update in Firebase
      try {
        const user = auth.currentUser;
        if (user) {
          const userType = localStorage.getItem('userType');
          const collectionName = userType === 'provider' ? 'providers' : 'customers';
          await updateDoc(doc(db, collectionName, user.uid), {
            location: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }
          });
          
          alert('✅ Location updated successfully!');
          
          // Refresh the screen to show new location
          if (userType === 'provider') {
            showScreen('provider-dashboard');
          } else {
            showScreen('home');
          }
          
          console.log('📍 Location updated in database:', userLocation);
        }
      } catch (error) {
        console.error('Error updating location:', error);
        alert('Location captured but failed to save to database. Please try again.');
      }
    },
    (error) => {
      console.error('Location error:', error);
      alert('Could not get location. Please enable location access in settings.');
    }
  );
}

window.mobileApp = { 
  showScreen, 
  selectService, 
  selectProvider,
  bookProvider, 
  handleLogout,
  logout: handleLogout, // Alias for wizard screen
  submitBooking,
  getCurrentLocation,
  updateLocation,
  navigateProvider,
  filterProviderBookings,
  updateBookingStatus,
  // Setup Wizard
  wizardNextStep,
  wizardPrevStep,
  skipWizard,
  toggleWizardCategory,
  // Notifications
  testNotification,
  sendPromotionalNotification,
  requestNotificationPermission,
  toggleCategorySelection,
  toggleSubcategory,
  updateSubcategoryPrice,
  // Provider Menu
  toggleProviderMenu,
  // Provider Services CRUD
  toggleServiceExpand,
  openAddServiceDialog,
  addServiceCategory,
  openAddSubcategoryDialog,
  addSubcategory,
  editSubcategory,
  saveEditSubcategory,
  deleteSubcategory,
  deleteServiceCategory,
  closeDialog,
  // Real-time Notifications
  showNewBookingNotification,
  // Customer Menu & Handlers
  toggleCustomerMenu,
  toggleFAQ
};

// Initialize app
console.log('🚀 Initializing mobile app...');
initApp();

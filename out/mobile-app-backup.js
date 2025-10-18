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
  query,
  where,
  addDoc,
  serverTimestamp,
  orderBy,
  Timestamp
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

// Services configuration (hardcoded as per requirement)
const SERVICES = [
  { id: 'water-can-delivery', name: 'Water Can', icon: '💧', category: 'Water Can Delivery' },
  { id: 'house-maids', name: 'House Maids', icon: '🏠', category: 'House Maids' },
  { id: 'electricians', name: 'Electricians', icon: '⚡', category: 'Electricians' },
  { id: 'plumbers', name: 'Plumbers', icon: '🔧', category: 'Plumbers' },
  { id: 'doctor-on-call', name: 'Doctor', icon: '🩺', category: 'Doctor on Call' },
  { id: 'cylinder-delivery', name: 'Cylinder', icon: '🔥', category: 'Cylinder Delivery' },
  { id: 'cleaners', name: 'Cleaners', icon: '✨', category: 'Cleaners' },
  { id: 'personal-cooks', name: 'Cooks', icon: '👨‍🍳', category: 'Personal Cooks' },
  { id: 'local-buddy', name: 'Local Buddy', icon: '🤝', category: 'Local Buddy' },
  { id: 'shifters-and-movers', name: 'Movers', icon: '🚚', category: 'Shifters & Movers' },
  { id: 'painters', name: 'Painters', icon: '🎨', category: 'Painters' },
];

// ============================================================================
// INITIALIZATION
// ============================================================================
function initApp() {
  console.log('🚀 Initializing UrbanEzii Mobile App...');
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✅ User authenticated:', user.uid);
      currentUser = user;
      loadUserData(user.uid);
    } else {
      console.log('❌ No user authenticated');
      currentUser = null;
      showScreen('login');
    }
  });
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
    console.log('✅ User found:', userData);
    
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
    
    console.log('✅ User type:', userType);
    
    // Redirect based on userType (SAME AS WEB APP)
    if (userType === 'provider') {
      console.log('🔄 Redirecting to provider dashboard');
      showScreen('provider-dashboard');
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
    default:
      appContainer.innerHTML = getLoadingScreen();
  }
}

// ============================================================================
// SCREEN HTML: LOADING
// ============================================================================
function getLoadingScreen() {
  return `
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="width: 100px; height: 100px; background: white; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 50px; margin-bottom: 24px; animation: pulse 2s ease-in-out infinite;">
        🏠
      </div>
      <h1 style="color: white; font-size: 28px; font-weight: 700; margin-bottom: 8px;">UrbanEzii</h1>
      <p style="color: rgba(255,255,255,0.8); font-size: 14px;">Your Local Service Bridge</p>
    </div>
  `;
}

// EVENT HANDLERS & MORE SCREENS TO BE ADDED...
// Continuing the build:

// ============================================================================
// SCREEN HTML: LOGIN
// ============================================================================
function getLoginScreen() {
  return `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; display: flex; flex-direction: column; overflow-y: auto;">
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 400px; margin: 0 auto; width: 100%;">
        <div style="text-align: center; margin-bottom: 48px;">
          <div style="width: 80px; height: 80px; background: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto 16px;">
            🏠
          </div>
          <h1 style="color: white; font-size: 32px; font-weight: 700; margin-bottom: 8px;">Welcome Back!</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px;">Sign in to continue</p>
        </div>
        
        <div style="background: white; border-radius: 24px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <div id="loginError" style="display: none; background: #fee; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;"></div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Email</label>
            <input type="email" id="loginEmail" placeholder="your@email.com" style="width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; outline: none;" />
          </div>
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">Password</label>
            <div style="position: relative;">
              <input type="password" id="loginPassword" placeholder="Enter your password" style="width: 100%; padding: 14px 50px 14px 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; outline: none;" />
              <button type="button" id="toggleLoginPassword" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 20px; cursor: pointer; padding: 4px;">👁️</button>
            </div>
          </div>
          
          <button id="loginBtn" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; margin-bottom: 16px;">
            Sign In
          </button>
          
          <div style="text-align: center; font-size: 14px; color: #666;">
            Don't have an account? 
            <button id="goToSignup" style="color: #667eea; font-weight: 700; background: none; border: none; cursor: pointer; padding: 0;">
              Sign Up
            </button>
          </div>
        </div>
      </div>
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
    <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; display: flex; flex-direction: column; overflow-y: auto;">
      <button id="backBtn" style="align-self: flex-start; background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; cursor: pointer;">
        ← Back
      </button>
      
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 400px; margin: 0 auto; width: 100%;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 80px; height: 80px; background: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto 16px;">
            🏠
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
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">I am a</label>
            <select id="signupRole" style="width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; outline: none;">
              <option value="customer">Customer</option>
              <option value="provider">Service Provider</option>
            </select>
          </div>
          
          <button id="signupBtn" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer;">
            Create Account
          </button>
        </div>
      </div>
    </div>
  `;
}

// EVENT HANDLERS & MORE SCREENS TO BE ADDED...
// Continuing the build:


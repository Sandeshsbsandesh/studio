# UrbanEzii Setup Guide

Complete step-by-step guide to set up UrbanEzii on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "UrbanEzii" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get Started"
3. Enable **Email/Password** authentication
4. Click "Save"

### 3. Set Up Firestore Database

1. Go to **Build > Firestore Database**
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select your preferred location
5. Click "Enable"

### 4. Configure Security Rules

Replace the default Firestore rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /providers/{providerId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>) to add a web app
4. Register app name: "UrbanEzii Web"
5. Copy the configuration values:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

## 🤖 Google AI Setup

### Get Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

## 💻 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI
GOOGLE_API_KEY=your_google_ai_api_key

# Environment
NODE_ENV=development
```

Replace the placeholder values with your actual Firebase and Google AI credentials.

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3001](http://localhost:3001)

### 5. Start AI Development Server (Optional)

In a separate terminal:

```bash
npm run genkit:watch
```

## 🗄️ Database Initial Setup

### Add Sample Providers

1. Go to Firestore in Firebase Console
2. Create a new collection named `providers`
3. Add sample documents:

**Example Provider Document:**
```json
{
  "businessName": "QuickClean Co.",
  "category": "House Maids",
  "address": "0.8 km away - Koramangala",
  "rating": 4.9,
  "reviews": 300,
  "phone": "+91 9876543210",
  "email": "contact@quickclean.com",
  "verified": true,
  "location": {
    "latitude": 12.9352,
    "longitude": 77.6245
  }
}
```

Create similar documents for other service categories:
- Water Can Delivery
- Electricians
- Plumbers
- Doctor on Call
- Cylinder Delivery
- Cleaners
- Personal Cooks
- Local Buddy
- Shifters & Movers
- Painters

## 🚀 Deployment to Firebase

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase

```bash
firebase init
```

Select:
- ✅ Hosting
- ✅ Firestore
- Choose your existing project
- Set public directory to `out`
- Configure as single-page app: Yes
- Don't overwrite files: No

### 4. Build the Project

```bash
npm run build
```

### 5. Deploy

```bash
firebase deploy
```

Your app will be live at: `https://your-project.web.app`

## 🔍 Verification Steps

After setup, verify everything works:

### ✅ Check Homepage
- Visit `http://localhost:3001`
- Verify all sections load correctly
- Check hero section, services grid, and footer

### ✅ Test Authentication
- Click "Login" in header
- Sign up as a customer
- Sign up as a provider
- Verify login/logout works

### ✅ Test Service Booking
- Go to any service page (e.g., `/service/plumbers`)
- Verify providers list appears
- Click "Book Now"
- Fill out the booking form
- Check console for success message

### ✅ Test Provider Dashboard
- Login as a provider
- Visit `/provider/dashboard`
- Verify dashboard loads with stats
- Check sidebar navigation

### ✅ Test AI Assistant
- Visit `/ai-assistant`
- Fill out the form
- Verify AI suggestions appear

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001

# Or run on different port
npm run dev -- -p 3002
```

### Firebase Connection Issues
- Verify `.env.local` values are correct
- Check Firebase project is active
- Verify Firestore database is created

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### TypeScript Errors
```bash
# Check for errors
npm run typecheck

# Fix with proper types
```

## 📞 Support

If you encounter issues:

1. Check the [README.md](./README.md)
2. Review [CONTRIBUTING.md](./CONTRIBUTING.md)
3. Search existing issues on GitHub
4. Create a new issue with details

## 🎉 You're All Set!

Your UrbanEzii development environment is ready. Happy coding!

---

For more information, visit:
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)


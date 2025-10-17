# Location Implementation Plan for Mobile App

## Overview
Implement location capture and storage exactly like the web app does.

## Changes Needed:

### 1. Global State Variables (Add at top of mobile-app.js)
```javascript
let userLocation = null; // Store user location globally
```

### 2. Signup Screen Updates
- Add "Get Location" button (required for providers, optional for customers)
- Show location status indicator
- Store location during signup in Firebase

### 3. Login Flow Updates
- Load location from Firebase after login
- Store in localStorage and global variable
- Display on home screen

### 4. Home Screen Updates
- Show user's location at top
- Allow editing/updating location

### 5. Setup Wizard Updates (Provider)
- Step 1: Add location capture button
- Store location in provider profile

### 6. Database Schema
```javascript
// customers/{uid} or providers/{uid}
{
  name: string,
  email: string,
  phone: string,
  role: string,
  location: {
    latitude: number,
    longitude: number
  },
  createdAt: timestamp
}
```

### 7. localStorage Keys
- `userLocation`: JSON string of {latitude, longitude}

## Implementation Order:
1. ✅ Add global state variable
2. ✅ Update signup screen with location button
3. ✅ Update signup handler to capture & store location
4. ✅ Update loadUserData to load location from DB
5. ✅ Update home screen to display location
6. ✅ Add location to setup wizard
7. ✅ Add location update function

## Web App References:
- src/app/login/page.tsx (lines 69-101)
- src/app/login/actions.ts (lines 33-84)


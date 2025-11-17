# Google Maps API Setup - Fix REQUEST_DENIED Error

## Problem
The Distance Matrix API is returning `REQUEST_DENIED` error because:
1. ✅ **Distance Matrix API is enabled** (FIXED)
2. ✅ **Billing is enabled** (FIXED)
3. ⚠️ **API key has HTTP referrer restrictions that block server-side requests** (CURRENT ISSUE)

## Root Cause
Your current API key has **HTTP referrer restrictions** (e.g., `*.urbanezii.com/*`), which means it can only be used from browsers/websites. The Distance Matrix API **must be called from your server** (backend), not from the browser, so it gets blocked.

## Solution: Create Two Separate API Keys

You need **TWO API keys** for security:
1. **Client-side key** (with HTTP referrer restrictions) - for Maps displayed in browser
2. **Server-side key** (with NO referrer restrictions) - for Distance Matrix API

### Step 1: Create a NEW Server-Side API Key

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. A new key will be generated - **COPY IT!** (e.g., `AIzaSyXXXXXXXXXXXXXXXXXXXXXXX`)
4. Click **"Edit API key"** (or the pencil icon)
5. **Name**: `Server-Side API Key` (so you can identify it)

6. **Application restrictions**:
   - For **Development**: Select **"None"**
   - For **Production**: Select **"IP addresses"** and add your server IPs

7. **API restrictions**:
   - Select **"Restrict key"**
   - Check ONLY these APIs:
     - ✅ Distance Matrix API
     - ✅ Directions API
     - ✅ Geocoding API
   - **DO NOT** check Maps JavaScript API (that's for client-side)

8. Click **"Save"**

### Step 2: Add the New Key to Your Environment

You need to create a `.env.local` file in your project root with BOTH keys:

```env
# Client-side key (for Maps in browser) - with referrer restrictions
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q

# Server-side key (for Distance Matrix) - NO referrer restrictions
GOOGLE_MAPS_SERVER_API_KEY=YOUR_NEW_SERVER_KEY_HERE
```

**Replace `YOUR_NEW_SERVER_KEY_HERE` with the key you just created!**

### Step 3: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 4: Keep Your OLD Key
**DO NOT DELETE** your existing key `AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q`!
- This key should keep its **HTTP referrer restrictions**
- It's used for the Maps JavaScript API in the browser
- The referrer restrictions protect it from unauthorized use

### Step 5: Test
Visit any service page and check if the distance feature works.

## Currently Enabled APIs (Check These)
Based on your project, these should be enabled:
- ✅ Maps JavaScript API (for map display)
- ✅ Geocoding API (for address → coordinates)
- ✅ Places API (for place search)
- ⚠️ **Distance Matrix API** ← **THIS IS PROBABLY MISSING!**

## Quick Check
Run this command in your terminal to test the API directly:

```bash
curl "https://maps.googleapis.com/maps/api/distancematrix/json?origins=12.9716,77.5946&destinations=12.9352,77.6245&key=AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q"
```

If you see `"status" : "REQUEST_DENIED"`, the API is not enabled.
If you see `"status" : "OK"`, the API is working!

## Alternative Quick Test (TEMPORARY - Not Secure for Production)

If you want to test immediately without creating a new key:

1. Go to your existing API key: `AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q`
2. Temporarily change **Application restrictions** to **"None"**
3. Test the distance feature
4. **IMPORTANT**: Change it back to HTTP referrer restrictions after testing!

⚠️ **This is NOT recommended for production** as it removes security, but it's fine for quick testing.

## Why Two Keys?

**Security Best Practice:**
- **Client-side keys** (NEXT_PUBLIC_*) are visible in browser code
  - Must have HTTP referrer restrictions to prevent abuse
  - If someone copies your key, they can only use it from your domain
  
- **Server-side keys** are hidden in your backend
  - Should use IP restrictions (for production) or no restrictions (for development)
  - Never exposed to users, so it's safe

## Summary

**Problem:** Your API key has HTTP referrer restrictions that block server-side usage.

**Solution:**
1. Create a new API key without referrer restrictions
2. Add it to `.env.local` as `GOOGLE_MAPS_SERVER_API_KEY`
3. Restart your dev server
4. Test the distance feature

**Cost:** Still covered by Google's $200/month free credit! 💰

---

After you create the new key and add it to `.env.local`, the distance feature will work perfectly! 🚀


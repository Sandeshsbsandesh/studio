# Google Maps Not Showing in Production - Fix Guide

## Problem
Google Maps displays correctly on localhost but not in deployed production environment.

## Root Causes

### 1. **API Key Domain Restrictions** (Most Common)
Your Google Maps API key might be restricted to `localhost` only.

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your API key
4. Under **Application restrictions**, check **HTTP referrers (web sites)**
5. Add your production domain:
   ```
   http://localhost:3001/*
   https://urbanezii.com/*
   https://*.urbanezii.com/*
   ```
6. Save changes

### 2. **Environment Variable Not Available at Build Time**
Next.js needs `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` at build time to embed it in the client bundle.

**Solution:**
The `apphosting.yaml` file has been updated to include the environment variable in both runtime and build sections. After updating, redeploy your app.

### 3. **API Not Enabled**
Ensure these APIs are enabled in Google Cloud Console:
- Maps JavaScript API
- Geocoding API
- Directions API
- Distance Matrix API

## Verification Steps

1. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for errors like:
     - "RefererNotAllowedMapError" → API key domain restriction
     - "ApiNotActivatedMapError" → API not enabled
     - "InvalidKeyMapError" → Invalid API key

2. **Check Environment Variable**
   - In production, check if the API key is loaded:
   ```javascript
   console.log('API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 10))
   ```

3. **Test API Key Directly**
   - Visit: `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`
   - If you see an error, the API key has issues

## Deployment Checklist

- [ ] API key has production domain in HTTP referrer restrictions
- [ ] All required Google Maps APIs are enabled
- [ ] `apphosting.yaml` includes `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in build.env
- [ ] Redeploy after making changes
- [ ] Check browser console for specific error messages

## Quick Fix

If maps still don't work after checking restrictions:

1. **Temporarily remove restrictions** (for testing only):
   - In Google Cloud Console → API Key settings
   - Set Application restrictions to "None"
   - Test if maps work
   - If yes, add proper domain restrictions
   - If no, check API enablement

2. **Verify API key in production**:
   - Check network tab in DevTools
   - Look for requests to `maps.googleapis.com`
   - Check if they include your API key
   - Check response for errors

## Security Note

⚠️ **Never commit API keys to public repositories!**
- The API key in `apphosting.yaml` should be stored as a secret in Firebase
- Use Firebase App Hosting secrets management instead of hardcoding


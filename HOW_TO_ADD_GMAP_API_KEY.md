# How to Add/Configure Google Maps API Key

## Step-by-Step Guide

### 1. Navigate to Google Cloud Console

**Option A: Direct Link**
- Go to: https://console.cloud.google.com/

**Option B: From Firebase Console**
- In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
- Select "Project settings"
- Scroll down to find "Your apps" section
- Click on "Google Cloud Platform" link (opens Google Cloud Console)

### 2. Select Your Project

- In Google Cloud Console, make sure you're in the correct project
- If you see "CityAssist" or "studio-9158883051-f75ec", that's your Firebase project
- If not, click the project dropdown at the top and select your Firebase project

### 3. Navigate to APIs & Services → Credentials

**Path:**
1. Click the hamburger menu (☰) in the top left
2. Go to **APIs & Services** → **Credentials**
   OR
   Direct link: https://console.cloud.google.com/apis/credentials

### 4. Find or Create API Key

**If API key already exists:**
- Look for an API key in the list (it might show as "API key" or have a name)
- Click on the API key to edit it

**If you need to create a new one:**
- Click **"+ CREATE CREDENTIALS"** button at the top
- Select **"API key"**
- Copy the generated key

### 5. Configure API Key Restrictions

**IMPORTANT:** Click on your API key to configure it:

#### Application restrictions:
- Select **"HTTP referrers (web sites)"**
- Click **"ADD AN ITEM"** and add:
  ```
  http://localhost:3001/*
  https://urbanezii.com/*
  https://*.urbanezii.com/*
  ```
- Click **"SAVE"**

#### API restrictions:
- Select **"Restrict key"**
- Check these APIs:
  - ✅ Maps JavaScript API
  - ✅ Geocoding API
  - ✅ Directions API
  - ✅ Distance Matrix API
- Click **"SAVE"**

### 6. Enable Required APIs

If APIs aren't enabled yet:

1. Go to **APIs & Services** → **Library**
2. Search and enable each:
   - **Maps JavaScript API** - https://console.cloud.google.com/apis/library/maps-javascript-backend.googleapis.com
   - **Geocoding API** - https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com
   - **Directions API** - https://console.cloud.google.com/apis/library/directions-backend.googleapis.com
   - **Distance Matrix API** - https://console.cloud.google.com/apis/library/distancematrix-backend.googleapis.com

### 7. Update Your Code

After getting the API key:

1. **For localhost** - Add to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. **For production** - Update `apphosting.yaml`:
   ```yaml
   build:
     env:
       - variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
         secret: your_api_key_here
   ```

## Quick Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **Credentials Page**: https://console.cloud.google.com/apis/credentials
- **API Library**: https://console.cloud.google.com/apis/library

## Common Issues

### "RefererNotAllowedMapError"
- Your production domain is not in the HTTP referrer restrictions
- Add `https://urbanezii.com/*` to allowed referrers

### "ApiNotActivatedMapError"
- Required APIs are not enabled
- Enable Maps JavaScript API, Geocoding API, Directions API

### API Key Not Working
- Wait 5-10 minutes after saving changes (propagation time)
- Clear browser cache
- Check if API key is correctly set in environment variables

## Security Best Practices

⚠️ **Important:**
- Never commit API keys to public repositories
- Use Firebase App Hosting secrets for production
- Restrict API key to specific domains
- Restrict API key to only required APIs
- Monitor API usage in Google Cloud Console


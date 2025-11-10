# Steps to Fix Google Maps in Deployed Version

## ✅ What You've Done Correctly:
1. ✅ Added HTTP referrer restrictions in Google Cloud Console
2. ✅ `apphosting.yaml` is in the root directory (correct location)
3. ✅ API key is configured in `apphosting.yaml`

## 🔴 What You Need to Do Now:

### Step 1: Redeploy Your Application (CRITICAL!)

After making changes to `apphosting.yaml` or API key restrictions, you **MUST redeploy**:

**Option A: Using Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"App Hosting"** in the left menu
4. Click **"Redeploy"** or trigger a new deployment
5. Wait for deployment to complete (usually 5-10 minutes)

**Option B: Using Git (If connected)**
1. Commit your changes:
   ```bash
   git add apphosting.yaml
   git commit -m "Update Google Maps API key configuration"
   git push
   ```
2. Firebase App Hosting will automatically redeploy

**Option C: Using Firebase CLI**
```bash
firebase deploy --only hosting
```

### Step 2: Verify APIs Are Enabled

1. Go to: https://console.cloud.google.com/apis/library
2. Make sure these APIs are **ENABLED**:
   - ✅ **Maps JavaScript API**
   - ✅ **Geocoding API**
   - ✅ **Directions API**
   - ✅ **Distance Matrix API**

### Step 3: Check Billing

Google Maps requires billing to be enabled:
1. Go to: https://console.cloud.google.com/billing
2. Ensure billing account is active and linked to your project

### Step 4: Test After Redeployment

1. **Wait 5-10 minutes** after redeployment completes
2. Open your deployed site: `https://urbanezii.com/bookings`
3. Open browser DevTools (F12) → **Console** tab
4. Look for errors:
   - ✅ If you see "Google Maps API Key check" log → API key is loaded
   - ❌ If you see "RefererNotAllowedMapError" → Domain restriction issue
   - ❌ If you see "ApiNotActivatedMapError" → API not enabled
   - ❌ If you see "InvalidKeyMapError" → Wrong API key

### Step 5: Check Network Tab

1. Open DevTools → **Network** tab
2. Filter by "maps.googleapis.com"
3. Check if requests are being made
4. Check response status codes:
   - ✅ 200 = Success
   - ❌ 403 = Domain restriction or API not enabled
   - ❌ 400 = Invalid API key

## 🔍 Debugging Checklist

After redeployment, check:

- [ ] Deployment completed successfully
- [ ] APIs are enabled in Google Cloud Console
- [ ] Billing is active
- [ ] HTTP referrers include `https://urbanezii.com/*`
- [ ] API key matches in both `apphosting.yaml` and Google Cloud Console
- [ ] Browser console shows no errors
- [ ] Network requests to maps.googleapis.com succeed

## ⚠️ Common Issues:

### Maps still not showing after redeployment?

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Try incognito/private window**
3. **Wait 10-15 minutes** (API restrictions can take time to propagate)
4. **Check API key restrictions** - Make sure `https://urbanezii.com/*` is exactly as shown (with wildcard)

### Still not working?

Check the browser console for the exact error message and share it for further troubleshooting.


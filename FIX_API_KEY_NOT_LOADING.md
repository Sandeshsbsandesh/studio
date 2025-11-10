# Fix: Google Maps API Key Not Working After Deployment

## 🔴 Problem
After deploying, you see: "Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable the live map preview."

This means the environment variable is **not being picked up** in production.

## ✅ Solution: Use `value:` Instead of `secret:`

I've updated `apphosting.yaml` to use `value:` instead of `secret:` for the API key.

**Why?**
- `secret:` expects a reference to a secret stored in Firebase App Hosting
- `value:` sets the environment variable directly
- For `NEXT_PUBLIC_` variables, `value:` works better

## 📋 Steps to Fix:

### Step 1: Verify the Change
Check that `apphosting.yaml` now has:
```yaml
env:
  - variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    value: AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q
```

### Step 2: Commit and Push
```bash
git add apphosting.yaml
git commit -m "Fix Google Maps API key - use value instead of secret"
git push
```

### Step 3: Wait for Auto-Deployment
- Firebase App Hosting will automatically redeploy
- Wait 5-10 minutes for deployment to complete

### Step 4: Test
1. Open: `https://urbanezii.com/bookings`
2. Press F12 → Console tab
3. Look for: "Google Maps API Key check" log
4. Map should now appear!

## 🔍 Alternative: Use Firebase App Hosting Secrets (More Secure)

If you want better security, create a secret in Firebase:

### Option A: Firebase Console
1. Go to Firebase Console → App Hosting
2. Click on your backend
3. Go to "Secrets" tab
4. Create secret: `GOOGLE_MAPS_API_KEY` with value: `AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q`
5. Update `apphosting.yaml`:
   ```yaml
   env:
     - variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
       secret: GOOGLE_MAPS_API_KEY
   ```

### Option B: Firebase CLI
```bash
firebase apphosting:secrets:set GOOGLE_MAPS_API_KEY
# Enter the API key when prompted
```

Then update `apphosting.yaml` to reference the secret name.

## ⚠️ Important Notes:

1. **API Key Restrictions**: Make sure your API key allows:
   - `http://localhost:3001/*`
   - `https://urbanezii.com/*`
   - `https://*.urbanezii.com/*`

2. **APIs Enabled**: Verify these are enabled:
   - Maps JavaScript API
   - Geocoding API
   - Directions API

3. **Billing**: Google Maps requires active billing

## 🐛 Still Not Working?

Check browser console for:
- `RefererNotAllowedMapError` → Domain restriction issue
- `ApiNotActivatedMapError` → API not enabled
- `InvalidKeyMapError` → Wrong API key

If you see these errors, fix them in Google Cloud Console.


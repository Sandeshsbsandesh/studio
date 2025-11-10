# Where to Set Environment Variables in Firebase App Hosting

## ❌ What You're Looking At (Environment Name)
The "Environment" section you see is ONLY for:
- Naming your environment (like "master", "staging", "production")
- NOT for setting environment variables

## ✅ Where Environment Variables Are Actually Set

### Option 1: apphosting.yaml File (What We Did)
Environment variables are set in the `apphosting.yaml` file in your project root.

**Current configuration:**
```yaml
runConfig:
  env:
    - variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      value: AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q
```

This is already done! ✅

### Option 2: Firebase Console (Alternative)
If you want to set it via console:

1. **Go to Firebase Console → App Hosting**
2. **Click on your backend** (the one you're looking at)
3. **Look for "Configuration" or "Environment Variables"** section
   - It might be under "Settings" → "Configuration"
   - Or in a different tab
4. **Add the variable there**

**Note:** Not all Firebase App Hosting setups show this UI. The `apphosting.yaml` method is more reliable.

## 🚀 What You Need to Do Now

Since we already updated `apphosting.yaml`, you just need to:

### Step 1: Commit and Push (If using Git)
```bash
git add apphosting.yaml
git commit -m "Fix Google Maps API key"
git push
```

### Step 2: Trigger Redeployment

**Option A: Via Git Push**
- If your repo is connected to Firebase App Hosting
- Pushing will auto-trigger deployment
- Check the "Rollouts" tab to see deployment progress

**Option B: Manual Redeploy**
- Go to Firebase Console → App Hosting
- Click "Rollouts" tab
- Click "Create rollout" or "Redeploy"

**Option C: Firebase CLI**
```bash
firebase deploy --only hosting
```

### Step 3: Wait and Test
- Wait 5-10 minutes for deployment
- Test at: `https://urbanezii.com/bookings`
- Check browser console (F12) for errors

## 🔍 How to Verify It's Working

1. **Check Deployment Logs:**
   - Go to "Logs" tab in Firebase App Hosting
   - Look for build logs
   - Check if environment variable is being set

2. **Check Browser Console:**
   - Open your deployed site
   - Press F12 → Console
   - Look for: "Google Maps API Key check" log
   - If you see it, the variable is loaded!

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Filter by "maps.googleapis.com"
   - Check if requests include your API key

## 📝 Summary

✅ **Already Done:**
- Updated `apphosting.yaml` with correct format
- Changed `secret:` to `value:`

⏳ **What's Next:**
- Commit and push (or manually redeploy)
- Wait for deployment
- Test the map

The "Environment" section you're looking at is just for naming, not for variables. The variables are in `apphosting.yaml` which we already fixed!


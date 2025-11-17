# 🚨 Distance Matrix API Fix - QUICK GUIDE

## The Problem
Your API key has **HTTP referrer restrictions** that block server-side API calls.

Error: `"API keys with referer restrictions cannot be used with this API."`

## 🎯 The Solution (5 minutes)

### Option 1: Quick Test (Remove Restrictions Temporarily)
**For immediate testing only - NOT for production!**

1. Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your key: `AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q`
3. Under **Application restrictions**, change to **"None"**
4. Click **"Save"**
5. Restart dev server: `npm run dev`
6. Test the distance feature
7. ⚠️ **CHANGE IT BACK** to HTTP referrer restrictions after testing!

### Option 2: Proper Solution (Create Server-Side Key)
**Recommended for production!**

#### Step 1: Create New API Key
1. Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. **Copy the new key!**
4. Click **"Edit API key"**
5. Name it: `Server-Side API Key`
6. **Application restrictions**: Select **"None"** (for dev)
7. **API restrictions**: Select **"Restrict key"** and check:
   - ✅ Distance Matrix API
   - ✅ Directions API
   - ✅ Geocoding API
8. Click **"Save"**

#### Step 2: Create `.env.local` File
Create a file called `.env.local` in your project root (next to `package.json`):

```env
# Client-side key (existing - keep referrer restrictions)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q

# Server-side key (new - no referrer restrictions)
GOOGLE_MAPS_SERVER_API_KEY=YOUR_NEW_KEY_HERE
```

Replace `YOUR_NEW_KEY_HERE` with the key you just created!

#### Step 3: Restart Dev Server
```bash
npm run dev
```

#### Step 4: Test
Visit any service page (e.g., `/service/electrician`) and the distance should show!

## How It Works Now

```
┌─────────────────────────────────────────────────────┐
│  OLD (Broken)                                       │
├─────────────────────────────────────────────────────┤
│  Frontend → Google Distance Matrix API             │
│             ❌ BLOCKED by referrer restrictions     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  NEW (Fixed)                                        │
├─────────────────────────────────────────────────────┤
│  Frontend → /api/distance-matrix (Your Backend)    │
│            → Google Distance Matrix API             │
│              ✅ Works with server-side key          │
└─────────────────────────────────────────────────────┘
```

## What I Fixed in the Code

✅ Created `/api/distance-matrix` route to proxy requests
✅ Updated code to use `GOOGLE_MAPS_SERVER_API_KEY` for backend
✅ Added fallback to existing key for backward compatibility
✅ Added detailed error messages

## Security Note

**Why two keys?**
- **Client key** (NEXT_PUBLIC_*): Visible in browser → needs referrer restrictions
- **Server key**: Hidden in backend → can work without referrer restrictions

## Cost
Still **FREE** with Google's $200/month credit! 💰

---

**Choose Option 1 for quick testing, then do Option 2 for production!** 🚀


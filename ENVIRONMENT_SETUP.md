# Environment Variables Setup

This project requires Google Maps API keys to function properly.

## Required Environment Files

### 1. Web App - `.env.local` (root directory)

Create a file `.env.local` in the project root with:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

### 2. Android App - `android/local.properties`

Add to `android/local.properties`:

```
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

## Getting Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
   - Distance Matrix API
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the generated key

## API Key Restrictions (Important!)

### HTTP Referrers (for web):
```
http://localhost:3001/*
https://yourdomain.com/*
```

### Application Restrictions (for Android):
- Add your app's package name: `com.urbanezii.app`
- Add SHA-1 fingerprint (get from Android Studio or keystore)

## Security Notes

⚠️ **NEVER commit .env files to Git!**
- `.env.local` is in `.gitignore` for security
- `android/local.properties` is also ignored
- If you accidentally push keys, regenerate them immediately in Google Cloud Console

## Testing

After adding the keys:
1. Restart dev server: `npm run dev`
2. For mobile: `npm run build:mobile && npx cap sync`
3. Test location features and live tracking

## Troubleshooting

**"RefererNotAllowedMapError"**
- Add `http://localhost:3001/*` to HTTP referrers in Google Cloud Console

**"API key not found"**
- Make sure `.env.local` exists in project root
- Restart the dev server after creating it
- Check the key has `NEXT_PUBLIC_` prefix


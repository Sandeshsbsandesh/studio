# 🔧 Local Environment Setup

## Create `.env.local` File

Since `.env.local` is gitignored, you need to create it manually.

### Steps:

1. **Create a new file** in the project root called `.env.local`
   - Right-click in VS Code → New File → `.env.local`
   - Or run in terminal: `New-Item -Path .env.local -ItemType File`

2. **Add these lines** to the file:

```env
# Google Maps API Keys

# Client-side key (for Maps JavaScript API in browser) - with HTTP referrer restrictions
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC7idf1I8KPAe0BmVIL5fTBEI-FCuXp_8Q

# Server-side key (for Distance Matrix API backend) - NO referrer restrictions
GOOGLE_MAPS_SERVER_API_KEY=AIzaSyAymJO_y2P7J8cmIISq1b8bfXu0Mibtc-Y
```

3. **Save the file**

4. **Restart your dev server**:
   - Press `Ctrl+C` to stop
   - Run: `npm run dev`

5. **Test** by visiting any service page (e.g., `/service/electrician`)

## Verification

To check if the environment variable is loaded, add this to your API route temporarily:

```typescript
console.log('Server API Key:', process.env.GOOGLE_MAPS_SERVER_API_KEY?.substring(0, 10) + '...');
```

You should see `AIzaSyAymJ...` in your server console.

---

**Note:** The `.env.local` file is only for local development. Production uses `apphosting.yaml` (which I've already updated).


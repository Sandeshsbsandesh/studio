# 🚀 Quick Start: Build Your Android APK

## ⚡ Fast Track (5 Minutes)

### Prerequisites Check
```bash
# Check Java (need 17+)
java -version

# Check Android Studio is installed
# Location: C:\Program Files\Android\Android Studio
```

### Build Steps

1. **Deploy your web app first** (e.g., to Firebase, Vercel, etc.)

2. **Configure mobile app to connect to deployed URL**:
   
   Edit `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'https://YOUR-DEPLOYED-URL.com',  // <-- Add your URL here
     cleartext: true
   }
   ```

3. **Sync the configuration**:
   ```bash
   npm run cap:sync
   ```

4. **Open in Android Studio**:
   ```bash
   npm run cap:open:android
   ```

5. **Build APK in Android Studio**:
   - Wait for Gradle sync (5-10 mins first time)
   - Click: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Done! APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🎯 What Just Happened?

Your mobile app is now a **native wrapper** that loads your web app inside it. Think of it like a specialized browser that:
- ✅ Appears as a native app on Android
- ✅ Can access device features (camera, GPS, etc.)
- ✅ Works offline (with proper caching)
- ✅ Can be published to Google Play Store

## 📱 Install and Test

### Transfer APK to your phone:
```bash
# Via USB (with ADB installed)
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or upload to Google Drive/Dropbox and download on phone
```

### Install on phone:
1. Enable "Install from Unknown Sources" in Settings
2. Tap the APK file
3. Install
4. Open "Ezii Studio" app

## 🎨 Next Steps

- [ ] Deploy your web app to production
- [ ] Update `capacitor.config.ts` with production URL
- [ ] Customize app icon (see MOBILE_BUILD_GUIDE.md)
- [ ] Test all features in mobile app
- [ ] Build signed release APK for Play Store
- [ ] Create Play Store listing

## 🆘 Common Issues

**Blank screen in app?**
→ Check if web URL is configured in `capacitor.config.ts`

**Gradle build fails?**
→ Check Java version: `java -version` (need 17+)
→ Set ANDROID_HOME to SDK path

**App not updating?**
→ Run `npm run cap:sync` after changes
→ Rebuild APK

---

For detailed instructions, see **MOBILE_BUILD_GUIDE.md**


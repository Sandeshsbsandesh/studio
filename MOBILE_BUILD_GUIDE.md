# 📱 Mobile App Build Guide - Ezii Studio

This guide will help you build Android APK from your responsive web app using Capacitor.

## 🎯 Overview

Your web app has been configured to work as both:
- **Web Application**: Full-featured Next.js app with server actions
- **Mobile Application**: Native Android app wrapping the web app

## 📋 Prerequisites

Before building the APK, ensure you have:

1. **Java Development Kit (JDK)**
   - Download: [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK 17](https://adoptium.net/)
   - Verify: Run `java -version` in terminal (should show version 17+)

2. **Android Studio**
   - Download: [Android Studio](https://developer.android.com/studio)
   - Install Android SDK (API Level 33 or higher)
   - Install Android SDK Build-Tools
   - Install Android SDK Platform-Tools

3. **Environment Variables** (Windows)
   - `ANDROID_HOME`: Path to Android SDK (e.g., `C:\Users\YourName\AppData\Local\Android\Sdk`)
   - `JAVA_HOME`: Path to JDK (e.g., `C:\Program Files\Java\jdk-17`)
   - Add to PATH: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\tools`

## 🚀 Two Deployment Strategies

### Strategy 1: Connect to Deployed Web App (Recommended)

**Best for:** Apps with server-side features (like yours with Server Actions)

1. **Deploy your web app** to a hosting service:
   ```bash
   # Deploy to Firebase, Vercel, or your preferred hosting
   npm run build
   # Deploy following your hosting provider's instructions
   ```

2. **Configure mobile app to connect to your deployed URL**:
   
   Edit `capacitor.config.ts`:
   ```typescript
   const config: CapacitorConfig = {
     appId: 'com.eziistudio.app',
     appName: 'Ezii Studio',
     webDir: 'out',
     server: {
       url: 'https://your-deployed-app.com', // Update with your URL
       cleartext: true
     }
   };
   ```

3. **Sync changes**:
   ```bash
   npm run cap:sync
   ```

4. **Build APK** (see Building APK section below)

**Advantages:**
- ✅ All server features work (AI assistant, server actions)
- ✅ Easy updates (just redeploy web app)
- ✅ Smaller APK size
- ✅ Single backend to maintain

### Strategy 2: Static Bundle (Limited Features)

**Best for:** Pure static sites without server actions

⚠️ **Note:** Your current app uses Server Actions which won't work in static mode. You'll need to convert them to API routes or remove them.

1. **Modify Next.js config** for static export:
   
   Edit `next.config.ts`:
   ```typescript
   output: 'export'  // Change from 'standalone'
   ```

2. **Remove or convert server actions**:
   - Convert `src/app/ai-assistant/actions.ts` to API routes
   - Or remove AI assistant features

3. **Build and sync**:
   ```bash
   npm run build:mobile
   ```

4. **Build APK** (see Building APK section below)

## 🔨 Building the Android APK

### Method 1: Using Android Studio (Easiest)

1. **Open Android project in Android Studio**:
   ```bash
   npm run cap:open:android
   ```
   Or manually: Open `android/` folder in Android Studio

2. **Wait for Gradle sync** to complete (first time takes 5-10 minutes)

3. **Build APK**:
   - Click: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Or use: `Build` → `Generate Signed Bundle / APK` for release version

4. **Find your APK**:
   - Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `android/app/build/outputs/apk/release/app-release.apk`

### Method 2: Using Command Line

1. **Navigate to android folder**:
   ```bash
   cd android
   ```

2. **Build debug APK**:
   ```bash
   ./gradlew assembleDebug
   ```
   On Windows:
   ```powershell
   .\gradlew.bat assembleDebug
   ```

3. **Build release APK** (unsigned):
   ```bash
   ./gradlew assembleRelease
   ```

4. **Find your APK**:
   - `android/app/build/outputs/apk/debug/app-debug.apk`
   - `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 🔐 Signing Your APK for Production

To publish on Google Play Store, you need a signed APK:

1. **Generate a keystore**:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Create signing configuration**:
   
   Create `android/keystore.properties`:
   ```properties
   storeFile=../my-release-key.keystore
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyAlias=my-key-alias
   keyPassword=YOUR_KEY_PASSWORD
   ```

3. **Update `android/app/build.gradle`**:
   ```gradle
   // Add before android { }
   def keystorePropertiesFile = rootProject.file("keystore.properties")
   def keystoreProperties = new Properties()
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }

   android {
       // ... existing config
       
       signingConfigs {
           release {
               storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
               storePassword keystoreProperties['storePassword']
               keyAlias keystoreProperties['keyAlias']
               keyPassword keystoreProperties['keyPassword']
           }
       }
       
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled false
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

4. **Build signed release APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## 📦 NPM Scripts Available

```bash
# Build web app and sync with mobile
npm run build:mobile

# Sync web assets to mobile
npm run cap:sync

# Open Android Studio
npm run cap:open:android

# Run on connected Android device/emulator
npm run cap:run:android
```

## 🎨 Customizing Your Mobile App

### App Icon and Splash Screen

1. **Replace app icon**:
   - Place your icon: `android/app/src/main/res/mipmap-*/ic_launcher.png`
   - Different sizes: mdpi (48px), hdpi (72px), xhdpi (96px), xxhdpi (144px), xxxhdpi (192px)

2. **Add splash screen**:
   ```bash
   npm install @capacitor/splash-screen
   ```
   
   Then configure in `capacitor.config.ts`:
   ```typescript
   plugins: {
     SplashScreen: {
       launchShowDuration: 2000,
       backgroundColor: "#667eea",
       showSpinner: true,
       spinnerColor: "#ffffff"
     }
   }
   ```

### App Name and Package ID

Edit `capacitor.config.ts`:
```typescript
{
  appId: 'com.eziistudio.app',        // Change package name
  appName: 'Ezii Studio',              // Change app display name
  // ...
}
```

After changing, run:
```bash
npm run cap:sync
```

## 🐛 Troubleshooting

### Gradle build fails
- Ensure JAVA_HOME is set to JDK 17
- Check ANDROID_HOME points to Android SDK
- Run: `cd android && ./gradlew clean`

### App shows blank screen
- Check if you've configured the `server.url` in `capacitor.config.ts`
- Verify your web app is deployed and accessible
- Check browser console in app: Connect device and use `chrome://inspect`

### "Unable to locate SDK"
- Install Android SDK via Android Studio
- Set ANDROID_HOME environment variable
- Restart terminal/IDE after setting environment variables

### Changes not showing in app
- Run `npm run cap:sync` after any web changes
- Rebuild the APK
- Clear app data on device: Settings → Apps → Ezii Studio → Clear Data

## 📱 Testing Your App

### On Physical Device
1. Enable Developer Options on your Android phone
2. Enable USB Debugging
3. Connect via USB
4. Run: `npm run cap:run:android`

### On Emulator
1. Open Android Studio → Device Manager
2. Create a virtual device (e.g., Pixel 5, API 33)
3. Start the emulator
4. Run: `npm run cap:run:android`

### Using Chrome DevTools
1. Connect device or start emulator
2. Open Chrome and navigate to: `chrome://inspect`
3. Select your app to debug

## 🚢 Publishing to Google Play Store

1. **Create Google Play Developer Account**
   - Cost: $25 one-time fee
   - Link: [Google Play Console](https://play.google.com/console)

2. **Prepare store listing**:
   - App screenshots (at least 2)
   - Feature graphic (1024 x 500px)
   - App description
   - Privacy policy URL

3. **Build signed release APK** (or AAB for Play Store):
   ```bash
   cd android
   ./gradlew bundleRelease  # For App Bundle (recommended)
   # or
   ./gradlew assembleRelease  # For APK
   ```

4. **Upload to Play Console**:
   - Create app in Play Console
   - Upload AAB/APK
   - Fill in store listing details
   - Submit for review

## 📚 Additional Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Capacitor logs: `npx cap doctor`
3. Check Android logcat: `adb logcat`
4. Visit [Capacitor Community Forum](https://forum.ionicframework.com/c/capacitor)

---

**Current Configuration:**
- App Name: Ezii Studio
- Package ID: com.eziistudio.app
- Platform: Android (iOS can be added similarly)
- Mode: Configured for remote server connection

Good luck with your mobile app! 🚀


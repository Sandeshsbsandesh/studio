# 📋 Deployment Checklist - Ezii Studio

Use this checklist to ensure smooth deployment of both web and mobile versions.

## 🌐 Web App Deployment

### Before Deployment
- [ ] Test all features locally (`npm run dev`)
- [ ] Fix all TypeScript errors (`npm run typecheck`)
- [ ] Fix all linting errors (`npm run lint`)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Test on different devices (Desktop, Tablet, Mobile)
- [ ] Verify all environment variables are set
- [ ] Check all API integrations work
- [ ] Test AI assistant functionality

### Deployment Steps (Firebase/Vercel)
- [ ] Build succeeds: `npm run build`
- [ ] Configure environment variables in hosting platform
- [ ] Deploy to staging/preview environment first
- [ ] Test staging deployment thoroughly
- [ ] Deploy to production
- [ ] Verify production deployment works
- [ ] Note down the production URL (needed for mobile app)

### Post-Deployment
- [ ] Test all features in production
- [ ] Check performance metrics
- [ ] Monitor error logs
- [ ] Test from different locations/networks

## 📱 Mobile App (Android) Deployment

### Prerequisites Setup
- [ ] Java JDK 17+ installed and configured
- [ ] Android Studio installed
- [ ] Android SDK installed (API 33+)
- [ ] Environment variables set:
  - [ ] `ANDROID_HOME` set correctly
  - [ ] `JAVA_HOME` set correctly
  - [ ] PATH updated with Android tools

### Configuration
- [ ] Web app deployed to production
- [ ] Production URL updated in `capacitor.config.ts`:
  ```typescript
  server: {
    url: 'https://your-production-url.com',
    cleartext: true  // Remove for HTTPS-only
  }
  ```
- [ ] App name finalized in `capacitor.config.ts`
- [ ] Package ID finalized (e.g., `com.eziistudio.app`)
- [ ] App icon added to `android/app/src/main/res/mipmap-*`
- [ ] Splash screen configured (if needed)

### Building Debug APK (for testing)
- [ ] Run: `npm run cap:sync`
- [ ] Open Android Studio: `npm run cap:open:android`
- [ ] Wait for Gradle sync to complete
- [ ] Build APK: `Build` → `Build APK(s)`
- [ ] Locate APK: `android/app/build/outputs/apk/debug/app-debug.apk`

### Testing Debug APK
- [ ] Install on physical device
- [ ] Test all main features
- [ ] Test on different Android versions (minimum API 22)
- [ ] Check app icon displays correctly
- [ ] Verify splash screen (if configured)
- [ ] Test network connectivity
- [ ] Test offline behavior
- [ ] Check app permissions work
- [ ] Verify deep links (if any)

### Building Release APK (for Play Store)

#### Keystore Creation (One-time setup)
- [ ] Generate keystore:
  ```bash
  keytool -genkey -v -keystore ezii-studio-release.keystore \
    -alias ezii-key -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] **BACKUP KEYSTORE SECURELY** (you'll need it for all future updates!)
- [ ] Create `android/keystore.properties`:
  ```properties
  storeFile=../ezii-studio-release.keystore
  storePassword=YOUR_SECURE_PASSWORD
  keyAlias=ezii-key
  keyPassword=YOUR_SECURE_PASSWORD
  ```
- [ ] Add `keystore.properties` to `.gitignore`
- [ ] Configure signing in `android/app/build.gradle`

#### Build Process
- [ ] Update version in `android/app/build.gradle`:
  ```gradle
  versionCode 1  // Increment for each release
  versionName "1.0.0"
  ```
- [ ] Clean build: `cd android && ./gradlew clean`
- [ ] Build release: `./gradlew bundleRelease` (for Play Store)
  - Or: `./gradlew assembleRelease` (for APK)
- [ ] Locate output:
  - AAB: `android/app/build/outputs/bundle/release/app-release.aab`
  - APK: `android/app/build/outputs/apk/release/app-release.apk`

### Pre-Release Testing
- [ ] Install release APK on multiple devices
- [ ] Test all critical features
- [ ] Verify app connects to production backend
- [ ] Check performance (load times, animations)
- [ ] Test on slow network conditions
- [ ] Verify no debug logs/data visible

## 🚀 Google Play Store Submission

### Play Console Setup (One-time)
- [ ] Create Google Play Developer account ($25)
- [ ] Set up payment profile
- [ ] Create app in Play Console

### App Store Listing
- [ ] App screenshots (minimum 2, up to 8)
  - Phone: 16:9 aspect ratio
  - Tablet: 16:9 or 16:10 aspect ratio
- [ ] Feature graphic: 1024 x 500 px
- [ ] App icon: 512 x 512 px
- [ ] App name (30 characters max)
- [ ] Short description (80 characters)
- [ ] Full description (4000 characters max)
- [ ] App category selected
- [ ] Content rating completed
- [ ] Privacy policy URL provided
- [ ] Contact information filled

### Upload and Review
- [ ] Upload AAB file (recommended) or APK
- [ ] Fill in release notes
- [ ] Select countries for distribution
- [ ] Set pricing (free/paid)
- [ ] Review and submit
- [ ] Monitor submission status

### Post-Submission
- [ ] App approved by Google (usually 1-3 days)
- [ ] Test published app from Play Store
- [ ] Share Play Store link with team
- [ ] Monitor reviews and ratings
- [ ] Track crash reports and analytics

## 🔄 Future Updates

### Updating Web App
1. Make changes to code
2. Test locally
3. Deploy to production
4. Mobile app automatically gets updates (if using remote URL)

### Updating Mobile App
1. Make changes to mobile configuration/native code
2. Increment `versionCode` in `build.gradle`
3. Update `versionName` if needed
4. Build new AAB/APK
5. Upload to Play Console
6. Submit for review

## ⚠️ Important Reminders

- **NEVER** commit keystore or keystore.properties to Git
- **BACKUP** your keystore in multiple secure locations
- **TEST** thoroughly on real devices, not just emulator
- **INCREMENT** version codes for each Play Store update
- **MONITOR** crash reports and user feedback
- **UPDATE** app regularly with bug fixes and improvements

## 🆘 Emergency Contacts

- Google Play Support: [support.google.com/googleplay](https://support.google.com/googleplay)
- Capacitor Docs: [capacitorjs.com/docs](https://capacitorjs.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)

---

**Last Updated**: Check this list before each deployment!

**Project**: Ezii Studio
**Package ID**: com.eziistudio.app
**Min Android Version**: API 22 (Android 5.1)
**Target Android Version**: API 33 (Android 13)


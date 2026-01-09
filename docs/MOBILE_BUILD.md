# 📱 Mobile Build Guide - Sturdy App

Complete guide for building and deploying the Sturdy mobile app to iOS and Android platforms.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [EAS Build Setup](#eas-build-setup)
3. [iOS Build](#ios-build)
4. [Android Build](#android-build)
5. [Environment Variables](#environment-variables)
6. [Build Profiles](#build-profiles)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- **Expo Account**: Free account at https://expo.dev
- **Apple Developer Account**: $99/year (for iOS)
- **Google Play Developer Account**: $25 one-time (for Android)

### Required Software

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Verify installation
eas --version
```

### Repository Setup

```bash
cd /path/to/Sturdy-App/sturdy-app

# Ensure all dependencies are installed
npm install

# Verify app.json configuration
cat app.json
```

---

## EAS Build Setup

### Step 1: Configure EAS Build

```bash
cd sturdy-app

# Initialize EAS configuration (creates eas.json)
eas build:configure
```

This creates `eas.json` with build profiles.

### Step 2: Verify eas.json

The `eas.json` file should contain:

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### Step 3: Set Up Environment Secrets

```bash
# Add Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"

# Add Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key"

# Add OpenAI API Key (if using server-side)
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-proj-..."

# List all secrets
eas secret:list
```

---

## iOS Build

### Prerequisites

- Apple Developer account ($99/year)
- App identifier (bundle ID) configured in App Store Connect
- iOS Distribution Certificate (EAS can generate)
- Push Notification certificate (if using push notifications)

### Step 1: Update app.json

Ensure iOS configuration is set:

```json
{
  "expo": {
    "name": "Sturdy",
    "slug": "sturdy-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.sturdy",
      "supportsTablet": true,
      "buildNumber": "1"
    }
  }
}
```

### Step 2: Create App Identifier

1. Go to https://developer.apple.com/account
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+**
4. Select **App IDs** → **App**
5. Enter:
   - **Description**: Sturdy Parenting App
   - **Bundle ID**: `com.yourcompany.sturdy` (explicit)
   - **Capabilities**: Sign in with Apple, Push Notifications
6. Click **Continue** → **Register**

### Step 3: Build for iOS

```bash
# Development build (for testing)
eas build --platform ios --profile development

# Preview build (internal testing)
eas build --platform ios --profile preview

# Production build (App Store)
eas build --platform ios --profile production
```

### Step 4: Download and Test

```bash
# View build status
eas build:list

# Download IPA file
eas build:download --platform ios

# Install on device (development build)
# Scan QR code shown after build completes
```

### Step 5: Submit to App Store

```bash
# Submit to TestFlight / App Store
eas submit --platform ios --latest

# Or specify build ID
eas submit --platform ios --id [build-id]
```

Follow prompts to:
- Provide Apple ID credentials
- Choose App Store Connect app
- Select release track (TestFlight → Production)

---

## Android Build

### Prerequisites

- Google Play Developer account ($25 one-time)
- Google Play Console app created
- Signing key (EAS can generate)

### Step 1: Update app.json

Ensure Android configuration is set:

```json
{
  "expo": {
    "name": "Sturdy",
    "slug": "sturdy-app",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.sturdy",
      "versionCode": 1,
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png"
      }
    }
  }
}
```

### Step 2: Create Google Play App

1. Go to https://play.google.com/console
2. Click **Create app**
3. Enter:
   - **App name**: Sturdy
   - **Default language**: English (US)
   - **App/Game**: App
   - **Free/Paid**: Free
4. Accept declarations → **Create app**

### Step 3: Build for Android

```bash
# Development build (for testing)
eas build --platform android --profile development

# Preview build (APK for testing)
eas build --platform android --profile preview

# Production build (AAB for Play Store)
eas build --platform android --profile production
```

### Step 4: Download and Test

```bash
# View build status
eas build:list

# Download APK/AAB file
eas build:download --platform android

# Install APK on device
adb install sturdy-app.apk
```

### Step 5: Submit to Google Play

```bash
# Submit to Google Play Console
eas submit --platform android --latest

# Or specify build ID
eas submit --platform android --id [build-id]
```

Follow prompts to:
- Provide Google Play credentials
- Choose release track (internal/alpha/beta/production)
- Upload service account key JSON

---

## Environment Variables

### Development (.env file)

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# OpenAI (optional)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

### Production (EAS Secrets)

```bash
# View all secrets
eas secret:list

# Add a secret
eas secret:create --scope project --name VARIABLE_NAME --value "value"

# Update a secret
eas secret:delete --name VARIABLE_NAME
eas secret:create --scope project --name VARIABLE_NAME --value "new-value"

# Delete a secret
eas secret:delete --name VARIABLE_NAME
```

**Important Notes:**
- `EXPO_PUBLIC_` prefix is required for runtime access
- Secrets are encrypted and injected at build time
- Use different projects for dev/staging/production

---

## Build Profiles

### Development Profile

**Purpose**: Internal testing on real devices

```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal",
    "ios": {
      "simulator": true
    }
  }
}
```

**Features:**
- Development client (hot reloading)
- Can run on simulator/emulator
- Internal distribution (no App Store/Play Store)

**Use Cases:**
- Testing on real devices
- Debugging native modules
- QA testing before release

### Preview Profile

**Purpose**: Quick builds for stakeholder review

```json
{
  "preview": {
    "distribution": "internal",
    "android": {
      "buildType": "apk"
    }
  }
}
```

**Features:**
- No development client (production-like)
- APK for Android (easy install)
- Internal distribution

**Use Cases:**
- Stakeholder demos
- User testing
- Pre-release validation

### Production Profile

**Purpose**: App Store / Play Store releases

```json
{
  "production": {
    "autoIncrement": true,
    "ios": {
      "bundleIdentifier": "com.sturdy.app"
    },
    "android": {
      "buildType": "aab"
    }
  }
}
```

**Features:**
- Auto-increment version/build numbers
- AAB for Android (optimized for Play Store)
- Release configuration

**Use Cases:**
- App Store submissions
- Play Store submissions
- Public releases

---

## Troubleshooting

### Build Fails: "Could not authenticate"

**Solution:**
```bash
eas logout
eas login
eas build --platform [ios/android]
```

### Build Fails: "Missing bundle identifier"

**Solution:**
Ensure `app.json` has `ios.bundleIdentifier` or `android.package` set.

### iOS Build Fails: "No provisioning profile"

**Solution:**
```bash
# Let EAS manage credentials
eas build --platform ios --clear-credentials
```

### Android Build Fails: "Invalid keystore"

**Solution:**
```bash
# Generate new keystore
eas build --platform android --clear-credentials
```

### Submit Fails: "Invalid credentials"

**Solution:**
```bash
# Re-authenticate
eas logout
eas login

# For iOS: provide App Store Connect API key
# For Android: provide service account JSON
```

### Environment Variables Not Working

**Solution:**
```bash
# Ensure secrets are set
eas secret:list

# Rebuild after adding secrets
eas build --platform [ios/android] --clear-cache
```

### Build Stuck at "Waiting for build"

**Solution:**
- Check https://status.expo.dev/ for outages
- Free plan has queue limits (upgrade to priority builds)
- Cancel and retry: `eas build:cancel`

---

## Build Commands Reference

```bash
# View all builds
eas build:list

# View specific build
eas build:view [build-id]

# Download build artifact
eas build:download --platform [ios/android] --latest

# Cancel running build
eas build:cancel

# Clear build cache
eas build --platform [ios/android] --clear-cache

# Re-sign build (iOS)
eas build:resign --platform ios

# View credentials
eas credentials

# Delete credentials
eas credentials --platform [ios/android] --clear
```

---

## Deployment Checklist

### Before Building

- [ ] Update version in `app.json`
- [ ] Test app thoroughly on dev server
- [ ] Verify all environment secrets are set
- [ ] Check app icons and splash screens
- [ ] Update app store metadata (screenshots, description)

### After Building

- [ ] Download and test build on real device
- [ ] Verify all features work (auth, database, AI)
- [ ] Test on multiple devices/screen sizes
- [ ] Check performance and load times
- [ ] Submit to TestFlight/Internal Testing first

### Before Release

- [ ] Get feedback from beta testers
- [ ] Fix critical bugs
- [ ] Update release notes
- [ ] Prepare marketing materials
- [ ] Submit for review (iOS: 1-2 days, Android: hours)

---

## Cost Estimates

### EAS Build

- **Free Plan**: 30 builds/month (shared queue)
- **Production Plan**: $29/month (priority queue, unlimited builds)
- **Enterprise Plan**: $99/month (dedicated resources)

### Apple

- **Developer Account**: $99/year
- **App Store fees**: None for free apps
- **Paid apps**: 30% commission (15% for <$1M revenue)

### Google Play

- **Developer Account**: $25 one-time
- **Play Store fees**: None for free apps
- **Paid apps**: 30% commission (15% for <$1M revenue)

---

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [iOS App Distribution Guide](https://developer.apple.com/distribute/)
- [Android App Publishing Guide](https://developer.android.com/studio/publish)
- [Expo Status Page](https://status.expo.dev/)

---

**Last Updated**: January 2026  
**Difficulty**: Intermediate  
**Estimated Time**: 1-2 hours (first time), 15-30 minutes (subsequent builds)

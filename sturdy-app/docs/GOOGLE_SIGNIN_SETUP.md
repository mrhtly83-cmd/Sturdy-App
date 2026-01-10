# Google Sign-In Setup Guide

Complete guide for configuring Google Sign-In authentication in the Sturdy mobile app.

## Overview

Google Sign-In is integrated using:
- **@react-native-google-signin/google-signin** - Native Google Sign-In SDK
- **Supabase Auth** - OAuth provider with `signInWithIdToken()`
- **Google Cloud Console** - OAuth 2.0 credentials

## Architecture

```
User clicks "Continue with Google"
    ↓
React Native Google Sign-In SDK
    ↓
Google OAuth flow (user selects account)
    ↓
ID Token returned to app
    ↓
Supabase `signInWithIdToken()` exchanges token
    ↓
User authenticated & session created
    ↓
Redirect to Dashboard
```

## Prerequisites

- Google Cloud Console account
- Supabase project with Google provider enabled
- React Native app with Expo

## Step 1: Create Google OAuth Credentials

### A. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name (e.g., "Sturdy App")
4. Click **Create**

### B. Enable Google+ API

1. In left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### C. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in required fields:
   - **App name:** Sturdy
   - **User support email:** your@email.com
   - **Developer contact:** your@email.com
4. Click **Save and Continue**
5. Add scopes (optional): `email`, `profile`
6. Click **Save and Continue**
7. Add test users (optional for development)
8. Click **Save and Continue**
9. Click **Back to Dashboard**

### D. Create OAuth 2.0 Client IDs

#### Web Client (Required)

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Select **Web application**
4. Name: "Sturdy Web Client"
5. Add **Authorized redirect URIs:**
   ```
   https://twvqpmwlxilfqmvttfjt.supabase.co/auth/v1/callback
   ```
   (Replace with your Supabase URL)
6. Click **Create**
7. **Copy the Client ID** (e.g., `26234553124-ch542hp71c0qe8rce76alf32vga7lfs4.apps.googleusercontent.com`)
8. **Copy the Client Secret**

#### Android Client (Optional - for Android builds)

1. Click **Create Credentials** → **OAuth 2.0 Client ID**
2. Select **Android**
3. Name: "Sturdy Android"
4. Package name: `com.sturdyapp` (or your package name from `app.json`)
5. Get SHA-1 certificate fingerprint:
   ```bash
   # For debug builds
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # For release builds
   keytool -list -v -keystore /path/to/release.keystore -alias your-key-alias
   ```
6. Enter SHA-1 fingerprint
7. Click **Create**

#### iOS Client (Optional - for iOS builds)

1. Click **Create Credentials** → **OAuth 2.0 Client ID**
2. Select **iOS**
3. Name: "Sturdy iOS"
4. Bundle ID: `com.sturdyapp` (from `app.json`)
5. Click **Create**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Enable **Google** provider
5. Enter credentials from Step 1D (Web Client):
   - **Client ID:** `26234553124-ch542hp71c0qe8rce76alf32vga7lfs4.apps.googleusercontent.com`
   - **Client Secret:** (from Google Console)
6. Click **Save**

## Step 3: Configure App

### A. Update Environment Variables

Edit `.env` file:

```env
# Use the Web Client ID from Google Console
GOOGLE_WEB_CLIENT_ID=26234553124-ch542hp71c0qe8rce76alf32vga7lfs4.apps.googleusercontent.com
```

### B. Update app/_layout.tsx (Already Done)

The Web Client ID is configured in `app/_layout.tsx`:

```typescript
import { configureGoogleSignIn } from '@/lib/google-auth';

const GOOGLE_WEB_CLIENT_ID = '26234553124-ch542hp71c0qe8rce76alf32vga7lfs4.apps.googleusercontent.com';

configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID);
```

**For production:** Replace hardcoded value with environment variable.

### C. Install Dependencies (Already Done)

```bash
npm install @react-native-google-signin/google-signin
```

## Step 4: Test Google Sign-In

### A. Development Testing

1. Start the app:
   ```bash
   npm start
   ```

2. Open app on device/simulator

3. Navigate to **Login** or **Signup** screen

4. Tap **"Continue with Google"** button

5. Select Google account

6. Grant permissions

7. Verify you're redirected to Dashboard

### B. Test Scenarios

**Success Flow:**
- User selects account → Grants permissions → Redirected to Dashboard
- User data saved in Supabase `auth.users` and `profiles` tables

**Cancellation Flow:**
- User closes popup → Alert: "Sign-in cancelled by user"
- User remains on Login/Signup screen

**Error Flow:**
- Network error → Alert: "Google Sign-In failed. Please try again."
- Invalid credentials → Alert with error message

## Step 5: Platform-Specific Configuration

### Android

#### A. Add SHA-1 to Google Console

1. Get debug SHA-1:
   ```bash
   cd android
   ./gradlew signingReport
   ```
   
2. Copy SHA-1 from output

3. Add to Google Console → Android OAuth client

#### B. Update app.json

```json
{
  "expo": {
    "android": {
      "package": "com.sturdyapp",
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

#### C. Download google-services.json

1. Go to Google Cloud Console → **APIs & Services** → **Credentials**
2. Download `google-services.json`
3. Place in root directory
4. Add to `app.json` as shown above

### iOS

#### A. Update app.json

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.sturdyapp",
      "googleServicesFile": "./GoogleService-Info.plist",
      "config": {
        "googleSignIn": {
          "reservedClientId": "com.googleusercontent.apps.26234553124-ch542hp71c0qe8rce76alf32vga7lfs4"
        }
      }
    }
  }
}
```

#### B. Download GoogleService-Info.plist

1. Go to Google Cloud Console → **APIs & Services** → **Credentials**
2. Download `GoogleService-Info.plist`
3. Place in root directory
4. Add to `app.json` as shown above

## Troubleshooting

### "Sign-in cancelled by user"

**Cause:** User closed Google Sign-In popup

**Solution:** This is expected behavior. User can try again.

### "Google Play Services not available"

**Cause:** Android emulator doesn't have Google Play Services

**Solutions:**
- Use a real Android device
- Use an emulator with Play Store (e.g., Pixel with Google APIs)
- Update Google Play Services on device

### "No ID token received from Google"

**Cause:** OAuth configuration mismatch

**Solutions:**
1. Verify Web Client ID in `app/_layout.tsx` matches Google Console
2. Check Supabase Google provider is enabled with correct credentials
3. Ensure OAuth consent screen is published (not in testing mode)
4. Verify authorized redirect URLs in Google Console

### "Invalid OAuth client"

**Cause:** Web Client ID doesn't match or not authorized

**Solutions:**
1. Check Web Client ID is correct in code
2. Verify Supabase redirect URL is added to Google Console
3. Ensure Google+ API is enabled
4. Wait 5-10 minutes for Google to propagate changes

### "Sign-in failed with error code 12501"

**Cause:** SHA-1 mismatch (Android)

**Solutions:**
1. Generate correct SHA-1: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
2. Add SHA-1 to Android OAuth client in Google Console
3. Rebuild app

### "DEVELOPER_ERROR" (Android)

**Cause:** Package name or SHA-1 mismatch

**Solutions:**
1. Verify package name in `app.json` matches Google Console
2. Verify SHA-1 in Google Console matches your keystore
3. Rebuild app: `npx expo run:android`

### Testing in Expo Go

**Note:** Google Sign-In may not work in Expo Go due to package name/bundle ID restrictions.

**Solution:** Build a development build:
```bash
npx expo run:android
# or
npx expo run:ios
```

## Authentication Flow Details

### 1. User Initiation
```typescript
// In login.tsx or signup.tsx
const handleGoogleSignIn = async () => {
  setGoogleLoading(true);
  const { error } = await signInWithGoogleOAuth();
  setGoogleLoading(false);
  
  if (error) {
    Alert.alert('Google Sign-In Failed', error.message);
  }
};
```

### 2. Google Sign-In SDK
```typescript
// In lib/google-auth.ts
export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  const idToken = userInfo.data?.idToken;
  
  // Exchange ID token with Supabase
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });
  
  return { data, error };
}
```

### 3. Supabase Token Exchange

Supabase validates the Google ID token and:
1. Verifies token signature with Google
2. Creates/updates user in `auth.users` table
3. Creates session with JWT
4. Returns session to app

### 4. User Data Storage

After successful authentication:
- **auth.users:** Email, name, avatar from Google
- **profiles:** User profile data
- **Session:** Stored in AsyncStorage for persistence

### 5. Session Management

```typescript
// In lib/auth-context.tsx
useEffect(() => {
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });
  
  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
    setSession(session);
    setUser(session?.user ?? null);
  });
  
  return () => subscription.unsubscribe();
}, []);
```

## Security Considerations

### ✅ Best Practices

1. **Never expose Web Client Secret in client code**
   - Only use in Supabase dashboard
   - Server-side only

2. **Use Web Client ID for React Native**
   - Configured in `app/_layout.tsx`
   - Safe to expose in client

3. **Validate tokens server-side**
   - Supabase handles this automatically
   - Token verification with Google

4. **Use HTTPS for redirects**
   - Supabase URLs are always HTTPS
   - Never use HTTP for OAuth

5. **Store sessions securely**
   - AsyncStorage with encryption
   - Automatic token refresh

### 🚫 Common Security Mistakes

1. ❌ Hardcoding Client Secret in app code
2. ❌ Using HTTP redirect URLs
3. ❌ Exposing service role keys
4. ❌ Not validating tokens server-side
5. ❌ Storing tokens in plain text

## Production Deployment

### 1. Update OAuth Consent Screen

1. Go to Google Cloud Console → **OAuth consent screen**
2. Click **Publish App**
3. Submit for verification (if needed)

### 2. Add Production Redirect URLs

Add production Supabase URL to Google Console:
```
https://your-production-project.supabase.co/auth/v1/callback
```

### 3. Use Environment Variables

Replace hardcoded Web Client ID:

```typescript
// app/_layout.tsx
import Constants from 'expo-constants';

const GOOGLE_WEB_CLIENT_ID = 
  Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || 
  '26234553124-ch542hp71c0qe8rce76alf32vga7lfs4.apps.googleusercontent.com';

configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID);
```

### 4. Generate Production SHA-1

For Android release builds:
```bash
keytool -list -v -keystore /path/to/release.keystore -alias your-key-alias
```

Add to Google Console → Android OAuth client.

### 5. Test Production Build

```bash
# Android
npx eas build --platform android --profile production

# iOS
npx eas build --platform ios --profile production
```

## Resources

- [Google Sign-In for React Native](https://github.com/react-native-google-signin/google-signin)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Expo OAuth Guide](https://docs.expo.dev/guides/authentication/)

## Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review Google Cloud Console configuration
3. Verify Supabase provider settings
4. Check app logs for detailed error messages
5. Create an issue on GitHub with:
   - Error message
   - Platform (iOS/Android)
   - Steps to reproduce

---

**Last Updated:** January 2026  
**Status:** Production Ready  
**Version:** 1.0.0

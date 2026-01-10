# Google Sign-In Testing Checklist

## Manual Testing Required

Since this is a mobile authentication feature with OAuth, automated testing is limited. Use this checklist for manual testing.

## Pre-Testing Setup

- [ ] Supabase Google provider is enabled with correct Web Client ID
- [ ] Google Cloud Console has OAuth 2.0 credentials configured
- [ ] Authorized redirect URLs are set in Google Console
- [ ] `.env` file has `GOOGLE_WEB_CLIENT_ID` (or hardcoded in `app/_layout.tsx`)
- [ ] App is running: `npm start`

## Test Scenarios

### 1. Login Screen - Google Sign-In (Happy Path)

**Steps:**
1. Open app
2. Navigate to Login screen
3. Tap "Continue with Google" button
4. Select Google account
5. Grant permissions if prompted

**Expected Results:**
- ✅ Google account picker appears
- ✅ After selection, loading indicator shows
- ✅ User is signed in
- ✅ Redirected to Dashboard or Onboarding
- ✅ User data saved in Supabase `auth.users` table
- ✅ Profile created in `profiles` table

**Actual Results:**
- [ ] Pass
- [ ] Fail (describe issue):

---

### 2. Signup Screen - Google Sign-In (Happy Path)

**Steps:**
1. Open app
2. Navigate to Signup screen
3. Tap "Sign up with Google" button
4. Select Google account
5. Grant permissions if prompted

**Expected Results:**
- ✅ Google account picker appears
- ✅ After selection, loading indicator shows
- ✅ New user account created
- ✅ Redirected to Onboarding (to add first child)
- ✅ User data saved in Supabase
- ✅ Profile created

**Actual Results:**
- [ ] Pass
- [ ] Fail (describe issue):

---

### 3. User Cancels Google Sign-In

**Steps:**
1. Open app
2. Navigate to Login screen
3. Tap "Continue with Google" button
4. Close Google account picker (back button or cancel)

**Expected Results:**
- ✅ Alert shows: "Sign-in cancelled by user"
- ✅ User remains on Login screen
- ✅ Can try again

**Actual Results:**
- [ ] Pass
- [ ] Fail (describe issue):

---

### 4. Network Error During Sign-In

**Steps:**
1. Turn off Wi-Fi/data
2. Open app
3. Navigate to Login screen
4. Tap "Continue with Google" button

**Expected Results:**
- ✅ Alert shows: "Google Sign-In failed. Please try again."
- ✅ User remains on Login screen
- ✅ Can retry after restoring network

**Actual Results:**
- [ ] Pass
- [ ] Fail (describe issue):

---

### 5. Google Sign-In Button UI

**Visual Check:**

Login Screen:
- [ ] Google button has white background
- [ ] Google "G" logo visible (blue color)
- [ ] Text reads "Continue with Google"
- [ ] Button is below email login
- [ ] Divider says "or" above button
- [ ] Loading spinner appears during auth
- [ ] Button disabled during loading

Signup Screen:
- [ ] Google button matches login screen style
- [ ] Text reads "Sign up with Google"
- [ ] Button is below email signup
- [ ] Divider says "or" above button
- [ ] Loading spinner appears during auth
- [ ] Button disabled during loading

**Screenshots:**
- Attach screenshots if testing

---

### 6. Session Persistence

**Steps:**
1. Sign in with Google
2. Close app completely
3. Reopen app

**Expected Results:**
- ✅ User remains signed in
- ✅ Redirected to Dashboard
- ✅ No login prompt

**Actual Results:**
- [ ] Pass
- [ ] Fail (describe issue):

---

### 7. Sign Out and Sign In Again

**Steps:**
1. Sign in with Google
2. Navigate to Settings
3. Tap "Sign Out"
4. Navigate to Login
5. Tap "Continue with Google"
6. Select same Google account

**Expected Results:**
- ✅ User signed out successfully
- ✅ Second sign-in works without re-prompting permissions
- ✅ User data matches previous session

**Actual Results:**
- [ ] Pass
- [ ] Fail (describe issue):

---

### 8. Multiple Google Accounts

**Steps:**
1. Sign in with Google Account A
2. Sign out
3. Sign in with Google Account B

**Expected Results:**
- ✅ Both accounts work
- ✅ Correct profile data for each account
- ✅ Sessions are independent

**Actual Results:**
- [ ] Pass
- [ ] Fail (describe issue):

---

### 9. Error: Invalid OAuth Client

**Steps:**
1. Change Web Client ID in `app/_layout.tsx` to invalid value
2. Restart app
3. Tap "Continue with Google"

**Expected Results:**
- ✅ Alert shows: "Google Sign-In failed. Please try again."
- ✅ User remains on Login screen

**Actual Results:**
- [ ] Pass
- [ ] Fail (describe issue):

**Note:** Revert Web Client ID after test.

---

### 10. Platform-Specific Testing

#### Android
- [ ] Tested on real device
- [ ] Tested on emulator with Google Play Services
- [ ] SHA-1 configured in Google Console
- [ ] Package name matches `app.json`

#### iOS
- [ ] Tested on real device
- [ ] Tested on simulator
- [ ] Bundle ID configured in Google Console
- [ ] URL scheme configured in `app.json`

---

## Code Review Checklist

### Implementation
- [x] `@react-native-google-signin/google-signin` installed
- [x] `lib/google-auth.ts` created with proper error handling
- [x] `app/_layout.tsx` configures Google Sign-In on mount
- [x] `lib/auth-context.tsx` has `signInWithGoogleOAuth` method
- [x] `app/(auth)/login.tsx` has Google button with proper UI
- [x] `app/(auth)/signup.tsx` has Google button with proper UI
- [x] `.env.example` updated with `GOOGLE_WEB_CLIENT_ID`

### TypeScript
- [x] No TypeScript errors: `npx tsc --noEmit`
- [x] All types properly defined
- [x] No `any` types used

### UI/UX
- [x] Google button has white background
- [x] Google logo visible (blue "G")
- [x] Loading states implemented
- [x] Error alerts show user-friendly messages
- [x] Button disabled during loading
- [x] Dividers separate auth methods

### Security
- [x] Web Client Secret NOT in client code
- [x] ID tokens validated by Supabase
- [x] Sessions stored securely in AsyncStorage
- [x] HTTPS used for all OAuth redirects

### Documentation
- [x] `MOBILE_SETUP.md` updated
- [x] `docs/GOOGLE_SIGNIN_SETUP.md` created
- [x] `.env.example` includes Google config
- [x] Troubleshooting section included

---

## Known Issues

### Expected Limitations

1. **Expo Go Limitation:**
   - Google Sign-In may not work in Expo Go
   - Use development build: `npx expo run:android` or `npx expo run:ios`

2. **Android Emulator Without Play Services:**
   - Error: "Google Play Services not available"
   - Use emulator with Google Play Store or real device

3. **First-Time OAuth Consent:**
   - Users must grant permissions on first sign-in
   - Subsequent sign-ins are seamless

---

## Test Results Summary

**Date Tested:** _________________

**Tester:** _________________

**Platform:** [ ] Android  [ ] iOS  [ ] Both

**Overall Status:** 
- [ ] All tests passed
- [ ] Some tests failed (see notes)
- [ ] Needs further testing

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## Next Steps After Testing

1. **If all tests pass:**
   - [ ] Mark PR as ready for review
   - [ ] Deploy to staging environment
   - [ ] Test on production Supabase instance

2. **If tests fail:**
   - [ ] Document specific failures
   - [ ] Check configuration in Google Console
   - [ ] Verify Supabase provider settings
   - [ ] Review error logs
   - [ ] Fix issues and retest

3. **Production Deployment:**
   - [ ] Publish OAuth consent screen
   - [ ] Add production redirect URLs
   - [ ] Generate production SHA-1 (Android)
   - [ ] Test production build
   - [ ] Monitor error logs

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Status:** Ready for Testing

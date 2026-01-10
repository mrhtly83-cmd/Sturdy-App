# Sturdy Mobile App - Setup Guide

This is the complete React Native mobile version of the Sturdy Parenting Coach app, built with Expo.

## ✅ What's Implemented

All features from the problem statement have been implemented:

### Core Features
- ✅ **Authentication** - Email/password signup and login with Supabase
- ✅ **Google Sign-In** - OAuth authentication with Google (Phase 3)
- ✅ **Onboarding Flow** - Add first child after signup with date picker and neurotype selection
- ✅ **Dashboard** - Welcome screen with quick action cards and recent scripts
- ✅ **SOS Scripts** - Generate AI-powered parenting scripts with OpenAI GPT-4
- ✅ **What If Plans** - Create proactive plans for recurring struggles
- ✅ **Library** - View saved scripts and plans with tabs and pull-to-refresh
- ✅ **Settings** - Manage profile, children, and account settings
- ✅ **Script Details** - View full scripts with copy, feedback, and delete options
- ✅ **Plan Details** - View full plans with copy and delete options

### Technical Implementation
- ✅ Theme system with glassmorphism design
- ✅ Animated components using Moti and Reanimated
- ✅ Supabase integration with RLS policies
- ✅ OpenAI GPT-4o-mini integration
- ✅ TypeScript with strict mode (no errors!)
- ✅ Expo Router for navigation
- ✅ Dark/light mode support

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)
- Supabase account and project
- OpenAI API key

### 1. Install Dependencies

```bash
cd sturdy-app
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` with your actual keys:

```env
# From your Supabase project settings
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# From OpenAI dashboard (for API routes)
OPENAI_API_KEY=sk-your_openai_key_here

# From Supabase project settings > API > service_role key (for API routes)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google OAuth Web Client ID (for Google Sign-In)
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here
```

**Important:** The `EXPO_PUBLIC_` prefix makes variables available to the client. The `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are for server-side API routes only and should never be exposed to the client.

### 3. Setup Google Sign-In (Optional but Recommended)

Google Sign-In is now integrated into the authentication flow. To enable it:

#### A. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. Create **two** OAuth 2.0 Client IDs:
   - **Web application** (for Supabase OAuth)
   - **Android** (if building for Android)
   - **iOS** (if building for iOS)

#### B. Configure Supabase Google OAuth

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your **Web Client ID** and **Web Client Secret** from Google Console
4. Add authorized redirect URLs:
   - `https://twvqpmwlxilfqmvttfjt.supabase.co/auth/v1/callback`

#### C. Update Environment Variables

Add the Web Client ID to your `.env` file:

```env
GOOGLE_WEB_CLIENT_ID=26234553124-ch542hp71c0qe8rce76alf32vga7lfs4.apps.googleusercontent.com
```

**Note:** The Google Web Client ID is already hardcoded in `app/_layout.tsx` for development. For production, use environment variables.

#### D. Test Google Sign-In

1. Start the app: `npm start`
2. Navigate to Login or Signup screen
3. Tap "Continue with Google" button
4. Select Google account
5. Grant permissions
6. You should be automatically signed in and redirected to the dashboard

#### E. Android/iOS Specific Configuration

**For Android:**
1. Get SHA-1 certificate fingerprint: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
2. Add SHA-1 to Google Cloud Console OAuth client (Android)
3. Add Android package name (e.g., `com.sturdyapp`)

**For iOS:**
1. Get iOS URL scheme from Google Cloud Console
2. Add to `app.json` under `ios.bundleIdentifier`
3. Configure URL scheme in `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.sturdyapp",
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

#### F. Troubleshooting Google Sign-In

**"Sign-in cancelled by user":**
- User closed the Google Sign-In popup
- This is normal behavior

**"Google Play Services not available":**
- Android emulator doesn't have Google Play Services
- Use a real device or an emulator with Play Store

**"No ID token received from Google":**
- Check Web Client ID is correct in `app/_layout.tsx`
- Verify Google OAuth consent screen is published
- Ensure all OAuth scopes are granted

**"Invalid OAuth client":**
- Web Client ID doesn't match Google Console
- Check Supabase Google provider configuration
- Verify authorized redirect URLs in Google Console

### 4. Setup Supabase Database

The database schema is already created in your Supabase project. Make sure you have:

- ✅ `profiles` table
- ✅ `children` table
- ✅ `scripts` table
- ✅ `plans` table (uses `user_id`, not `parent_id`!)
- ✅ RLS policies enabled on all tables

See `docs/schema.sql` for the complete schema.

### 5. (Optional) Add Onboarding Video

Enhance the onboarding experience with a video background:

1. Place your video file in `assets/videos/onboarding.mp4`
2. **Recommended specs:**
   - Format: MP4 (H.264)
   - Resolution: 1080p
   - Size: < 10MB
   - Duration: 10-30 seconds
3. Video will loop automatically
4. Users can toggle mute via top-right button

**Note:** App works perfectly without the video - it shows a gradient fallback. See `assets/videos/README.md` for detailed instructions.

### 6. Run the App

```bash
npm start
```

This will open Expo Dev Tools. You can:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your phone

## 📱 App Structure

```
sturdy-app/
├── app/
│   ├── (auth)/           # Login and signup screens
│   ├── (tabs)/           # Main tab navigation
│   │   ├── index.tsx     # Dashboard/Home
│   │   ├── library.tsx   # Library with tabs
│   │   └── explore.tsx   # Settings
│   ├── onboarding/       # First-time user flow
│   ├── scripts/          # SOS Script generation
│   ├── plans/            # What If Plan creation
│   ├── library/          # Script and plan details
│   │   ├── script/[id].tsx
│   │   └── plan/[id].tsx
│   └── api/              # API routes (Expo Router)
│       ├── generate-script+api.ts
│       └── generate-plan+api.ts
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── auth-context.tsx  # Auth provider
│   ├── supabase.ts       # Supabase client
│   ├── queries.ts        # Database queries
│   ├── openai.ts         # OpenAI integration
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Helper functions
│   └── theme.ts          # Theme system
```

## 🎨 Design System

The app uses a calming glassmorphism design with:
- **Primary:** Coral/Orange gradients (#F87171 → #F97316)
- **Secondary:** Teal (#14B8A6 → #0EA5E9)
- **Background:** Dark (#0F172A) with transparent overlays
- **Glass Elements:** White 10-20% opacity with backdrop blur

## 🔐 Security Notes

1. **Environment Variables:**
   - `EXPO_PUBLIC_*` variables are client-accessible
   - Never put API keys or service role keys in `EXPO_PUBLIC_*` variables
   - `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-side only

2. **RLS Policies:**
   - All tables have Row Level Security enabled
   - Users can only access their own data
   - Plans table uses `user_id` (not `parent_id`!)

3. **Child Name Scrubbing:**
   - Child names are scrubbed before sending to OpenAI (feature implemented but not yet called in current version)

## 🧪 Testing

To test the complete flow:

1. **Sign up** with email/password
2. **Add a child** in onboarding (name, birth date, neurotype)
3. **Navigate to Home** and see quick actions
4. **Generate SOS Script:**
   - Tap "Get SOS Script"
   - Select child, describe situation, choose tone
   - Wait for OpenAI to generate script
   - View script with validation, reframe, script text, and insight
5. **Create What If Plan:**
   - Tap "Create What If Plan"
   - Describe struggle, frequency, triggers
   - View plan with prevention, intervention, escalation
6. **View Library:**
   - See all saved scripts and plans
   - Tap to view details
   - Copy to clipboard
   - Mark as helpful/not helpful
   - Delete if needed
7. **Manage Settings:**
   - View profile
   - Add/delete children
   - Sign out

## 🚧 Known Limitations

1. **API Routes:** Expo Router API routes work in development but may need additional configuration for production builds. Consider using Expo Edge Functions or a separate backend API for production.

2. **Environment Variables:** API routes need access to `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`. Make sure these are available in your build environment.

3. **Notifications:** The settings screen has a "Notifications" toggle placeholder but it's not yet functional.

## 📝 Next Steps

To prepare for production:

1. **Add Error Tracking:** Integrate Sentry or similar
2. **Add Analytics:** Track user behavior
3. **Add Rate Limiting:** Prevent API abuse on OpenAI calls
4. **Add Caching:** Cache scripts/plans locally for offline access
5. **Add Tests:** Unit and E2E tests
6. **Build Production:** Use EAS Build for iOS/Android

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
npx expo start --clear
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Supabase connection issues
- Check that your `.env` has correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Verify RLS policies are enabled
- Check Supabase project is not paused

### OpenAI API errors
- Verify `OPENAI_API_KEY` is set correctly in `.env`
- Check OpenAI account has credits
- Check API route is accessible

## 📄 License

Proprietary - Sturdy App

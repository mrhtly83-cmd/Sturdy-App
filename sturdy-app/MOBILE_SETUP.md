# Sturdy Mobile App - Setup Guide

This is the complete React Native mobile version of the Sturdy Parenting Coach app, built with Expo.

## ✅ What's Implemented

All features from the problem statement have been implemented:

### Core Features
- ✅ **Authentication** - Email/password signup and login with Supabase
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
```

**Important:** The `EXPO_PUBLIC_` prefix makes variables available to the client. The `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are for server-side API routes only and should never be exposed to the client.

### 3. Setup Supabase Database

The database schema is already created in your Supabase project. Make sure you have:

- ✅ `profiles` table
- ✅ `children` table
- ✅ `scripts` table
- ✅ `plans` table (uses `user_id`, not `parent_id`!)
- ✅ RLS policies enabled on all tables

See `docs/schema.sql` for the complete schema.

### 4. Run the App

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

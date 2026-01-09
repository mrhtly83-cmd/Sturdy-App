# Environment Setup Guide

This guide walks you through setting up all required services for Sturdy App development and deployment.

---

## Required Services

### 1. Supabase (Database + Auth)

**Purpose:** PostgreSQL database with built-in authentication and Row Level Security

**Setup Steps:**

1. **Create Account**
   - Go to https://supabase.com/dashboard
   - Sign up with GitHub or email
   - Verify your email

2. **Create New Project**
   - Click "New Project"
   - Choose organization (create one if needed)
   - Fill in:
     - **Name:** `sturdy-app` (or your preferred name)
     - **Database Password:** Generate strong password (save it!)
     - **Region:** Choose closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get API Credentials**
   - Once project is ready, go to: **Settings → API** (left sidebar)
   - You'll see three values:
   
   **Project URL:**
   ```
   https://abcdefghijklmnop.supabase.co
   ```
   Copy to: `EXPO_PUBLIC_SUPABASE_URL`

   **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   Copy to: `EXPO_PUBLIC_SUPABASE_ANON_KEY`

4. **Run Database Migration**
   - Go to: **SQL Editor** (left sidebar)
   - Click "New Query"
   - Open `/docs/schema.sql` from this repo
   - Copy entire file contents
   - Paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

5. **Verify Setup**
   - Go to: **Table Editor** (left sidebar)
   - You should see 4 tables:
     - `profiles`
     - `children`
     - `scripts`
     - `what_if_scripts`
   - Click on each table to verify structure

**Cost:** Free tier includes:
- 500MB database storage
- 50,000 monthly active users
- 2GB bandwidth

---

### 2. OpenAI (AI Script Generation)

**Purpose:** GPT-4 API for generating parenting scripts

**Setup Steps:**

1. **Create Account**
   - Go to https://platform.openai.com/signup
   - Sign up with email or Google
   - Verify your email

2. **Add Payment Method**
   - Go to: **Settings → Billing**
   - Click "Add payment method"
   - Enter credit card details
   - Set spending limit (recommended: $10/month to start)

3. **Create API Key**
   - Go to: **API Keys** (left sidebar)
   - Click "Create new secret key"
   - Name it: `sturdy-app-dev` (or similar)
   - **Copy the key immediately** (you can't see it again!)
   
   ```
   sk-proj-abc123...
   ```
   Copy to: `OPENAI_API_KEY`

4. **Verify Setup**
   - Run this test (replace `YOUR_KEY`):
   ```bash
   curl https://api.openai.com/v1/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_KEY" \
     -d '{
       "model": "gpt-4o-mini",
       "messages": [{"role": "user", "content": "Say hello"}],
       "max_tokens": 5
     }'
   ```
   - Should return JSON response with "hello" message

**Cost Estimate:**
- Model: GPT-4o-mini
- Cost per script: ~$0.0004 (less than a penny)
- 100 scripts = $0.04
- 1000 scripts = $0.40
- Expected: $5-20/month for active development

**Cost Protection:**
- Set spending limit in OpenAI dashboard
- Rate limiting (see Task #3) prevents runaway costs
- Monitor usage in OpenAI dashboard

---

### 3. Upstash Redis (Rate Limiting)

**Purpose:** Fast, serverless Redis for API rate limiting

**Setup Steps:**

1. **Create Account**
   - Go to https://console.upstash.com/
   - Sign up with GitHub or email
   - Verify your email

2. **Create Redis Database**
   - Click "Create Database"
   - Fill in:
     - **Name:** `sturdy-ratelimit`
     - **Type:** Regional (faster, cheaper) or Global (better availability)
     - **Region:** Choose closest to your app (e.g., `us-east-1` for Vercel)
     - **TLS:** Enabled (default, recommended)
   - Click "Create"

3. **Get Credentials**
   - Once database is ready, scroll to **REST API** section
   - You'll see two values:
   
   **UPSTASH_REDIS_REST_URL:**
   ```
   https://unique-name-12345.upstash.io
   ```
   Copy to: `UPSTASH_REDIS_REST_URL`

   **UPSTASH_REDIS_REST_TOKEN:**
   ```
   AaBbCc123...
   ```
   Copy to: `UPSTASH_REDIS_REST_TOKEN`

4. **Verify Setup**
   - Test connection with curl:
   ```bash
   curl -X POST YOUR_URL \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '["PING"]'
   ```
   - Should return: `{"result":"PONG"}`

**Cost:** Free tier includes:
- 10,000 commands/day
- Good for: Development and low-traffic production
- Paid tier: $0.2 per 100k requests (starts at ~$2/month for active app)

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/your-org/sturdy-app.git
cd sturdy-app
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install mobile app dependencies
cd sturdy-app
npm install
```

This installs:
- React Native 0.76.9
- Expo SDK ~52.0.0
- Supabase client
- React Navigation
- TypeScript
- Expo Router

### Step 3: Create Environment File

```bash
cd sturdy-app
cp .env.example .env
```

### Step 4: Fill in Environment Variables

Open `.env` and add your credentials from the services above:

```env
# Supabase (use EXPO_PUBLIC_ prefix for client-side access)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# OpenAI (for server-side API calls)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

**Note:** Expo requires the `EXPO_PUBLIC_` prefix for environment variables that need to be accessible at runtime.

### Step 5: Run Development Server

```bash
npm start
# Or: npx expo start
```

Then choose your platform:
- Press **'i'** for iOS Simulator (Mac only)
- Press **'a'** for Android Emulator
- Press **'w'** for Web preview
- Scan QR code with Expo Go app on your device

### Step 6: Test Authentication

1. Launch app on device/simulator
2. Tap "Sign Up"
3. Create account with email
4. Check Supabase dashboard → Authentication → Users
5. You should see your new user

### Step 7: Test Script Generation

1. Log in
2. Create a child profile
3. Tap "SOS" button
4. Fill in situation
5. Generate script
6. Verify script appears

---

## Mobile App Deployment

### iOS Deployment (App Store)

#### Prerequisites
- Apple Developer account ($99/year)
- EAS Build account (free tier available)
- Mac with Xcode (for local builds) OR use EAS cloud builds

#### Step 1: Configure EAS Build

```bash
cd sturdy-app
npx eas build:configure
```

This creates `eas.json` configuration file.

#### Step 2: Update app.json

Ensure these values are set:

```json
{
  "expo": {
    "name": "Sturdy",
    "slug": "sturdy-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.sturdy",
      "supportsTablet": true
    }
  }
}
```

#### Step 3: Build for iOS

```bash
# Production build
npx eas build --platform ios --profile production

# Development build (for internal testing)
npx eas build --platform ios --profile development
```

#### Step 4: Submit to App Store

```bash
npx eas submit --platform ios
```

Follow prompts to:
- Select build to submit
- Provide Apple ID credentials
- Choose app identifier

See detailed guide: [iOS_SETUP.md](./iOS_SETUP.md)

---

### Android Deployment (Google Play)

#### Prerequisites
- Google Play Developer account ($25 one-time)
- EAS Build account (free tier available)

#### Step 1: Configure EAS Build

```bash
cd sturdy-app
npx eas build:configure
```

#### Step 2: Update app.json

Ensure these values are set:

```json
{
  "expo": {
    "name": "Sturdy",
    "slug": "sturdy-app",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.sturdy",
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE"
      }
    }
  }
}
```

#### Step 3: Build for Android

```bash
# Production build (AAB for Play Store)
npx eas build --platform android --profile production

# APK for testing
npx eas build --platform android --profile preview
```

#### Step 4: Submit to Google Play

```bash
npx eas submit --platform android
```

Follow prompts to:
- Select build to submit
- Provide Google Play credentials
- Choose release track (internal/alpha/beta/production)

See detailed guide: [ANDROID_SETUP.md](./ANDROID_SETUP.md)

---

## Environment Variables Reference

### Development (.env in sturdy-app/)

```env
# Required
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Optional (for server-side features)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

### Production (EAS Secrets)

Store sensitive variables as EAS Secrets:

```bash
# Add secrets
npx eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
npx eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbG..."
npx eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-proj-..."
```

---

## Verification Checklist

After completing setup, verify each feature works:

### Authentication
- [ ] Can sign up with email/password
- [ ] Can log in with existing account
- [ ] Can log out
- [ ] Session persists on app restart
- [ ] Can reset password (check email)

### Child Profiles
- [ ] Can create child profile
- [ ] Can view list of children
- [ ] Can edit child profile
- [ ] Can delete child profile
- [ ] Data persists after logout/login

### SOS Scripts
- [ ] Can tap SOS button
- [ ] Can enter situation
- [ ] Can select tone
- [ ] Can generate script
- [ ] Script appears within 3-5 seconds
- [ ] Can rate script as helpful

### Database
- [ ] Check Supabase → Table Editor
- [ ] Verify `profiles` has your user
- [ ] Verify `children` has child profiles
- [ ] Verify `scripts` has generated scripts
- [ ] Verify RLS is enabled (can't see other users' data)

### Performance
- [ ] App launches in <2 seconds
- [ ] Script generation completes in <5 seconds
- [ ] No errors in console
- [ ] Works on both iOS and Android

---

## Troubleshooting

### "Supabase URL is not defined"
- **Cause:** Missing `EXPO_PUBLIC_SUPABASE_URL` in .env
- **Solution:** Copy from Supabase dashboard → Settings → API

### "OpenAI API key invalid"
- **Cause:** Wrong API key or insufficient credits
- **Solution:** Verify key in OpenAI dashboard, check billing page

### "Database query failed"
- **Cause:** RLS policy blocks query OR table doesn't exist
- **Solution:** Run `/docs/schema.sql` in Supabase SQL Editor

### "User can't sign up"
- **Cause:** Email confirmation required OR SMTP not configured
- **Solution:** Disable email confirmation in Supabase → Authentication → Settings

### "Build fails on EAS"
- **Cause:** TypeScript errors OR missing environment variables
- **Solution:** Check build logs, verify all secrets are set

### "Expo Go app not loading"
- **Cause:** Device and computer on different networks
- **Solution:** Ensure both are on same WiFi, or use tunnel mode: `npx expo start --tunnel`

---

## Security Best Practices

### 1. Environment Variables
- ✅ Store in `.env` (gitignored)
- ✅ Never commit `.env` to git
- ✅ Use EAS Secrets for production
- ❌ Never hardcode secrets in code

### 2. API Keys
- ✅ Use `EXPO_PUBLIC_` prefix only when needed
- ✅ Store sensitive keys as EAS Secrets
- ✅ Use anon key for client-side Supabase queries
- ❌ Never expose server-side keys to mobile app

### 3. Database
- ✅ Enable RLS on all tables
- ✅ Test RLS policies work
- ✅ Use separate projects for dev/prod
- ❌ Never disable RLS in production

---

## Development Workflow

### Daily Development
```bash
# Start dev server
cd sturdy-app
npm start

# Choose platform (i/a/w)
# Make changes
# App hot-reloads automatically
# Test on device/simulator

# Commit changes
git add .
git commit -m "feat: add feature"
git push origin main
```

### Adding New Environment Variable
1. Add to `.env` (local)
2. Add to `.env.example` (documentation)
3. Add as EAS Secret (production)
4. Restart dev server / rebuild app

### Rotating Secrets
1. Generate new key in service dashboard
2. Update `.env` immediately
3. Update EAS Secrets
4. Rebuild and redeploy app
5. Revoke old key

---

## Next Steps

Once environment is set up:

1. ✅ Verify all features work (checklist above)
2. 📖 Read `/docs/DATABASE.md` to understand schema
3. 📱 Read platform-specific guides ([iOS_SETUP.md](./iOS_SETUP.md), [ANDROID_SETUP.md](./ANDROID_SETUP.md))
4. 🏗️ Start building features!

---

## Support Resources

### Documentation
- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- Supabase Docs: https://supabase.com/docs
- OpenAI Docs: https://platform.openai.com/docs
- EAS Build Docs: https://docs.expo.dev/build/introduction/

### Status Pages
- Expo Status: https://status.expo.dev/
- Supabase Status: https://status.supabase.com/
- OpenAI Status: https://status.openai.com/

### Community
- Expo Discord: https://chat.expo.dev/
- Supabase Discord: https://discord.supabase.com
- React Native Discord: https://reactnative.dev/help

---

**Last Updated:** January 2026  
**Estimated Setup Time:** 20-30 minutes  
**Difficulty:** Beginner-friendly

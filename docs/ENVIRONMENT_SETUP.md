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
   Copy to: `NEXT_PUBLIC_SUPABASE_URL`

   **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   Copy to: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   **service_role secret key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   Copy to: `SUPABASE_SERVICE_ROLE_KEY`
   
   ⚠️ **Important:** service_role key is SECRET - never commit to git or expose to client!

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
cd sturdy-app/nextjs-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14
- React 18
- Supabase client
- OpenAI client
- Upstash Redis + Ratelimit
- TypeScript
- Tailwind CSS

### Step 3: Create Environment File

```bash
cp ../.env.example .env.local
```

### Step 4: Fill in Environment Variables

Open `.env.local` and add your credentials from the services above:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=AaBbCc...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 6: Test Authentication

1. Click "Sign Up"
2. Create account with email
3. Check Supabase dashboard → Authentication → Users
4. You should see your new user

### Step 7: Test Script Generation

1. Log in
2. Create a child profile
3. Tap "SOS" button
4. Fill in situation
5. Generate script
6. Verify script appears

---

## Production Deployment (Vercel)

### Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your Sturdy App repo
4. Click "Import"

### Step 2: Configure Project

- **Framework:** Next.js (auto-detected)
- **Root Directory:** `nextjs-app` (important!)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add ALL variables from `.env.local`:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` | Production, Preview, Development |
| `OPENAI_API_KEY` | `sk-proj-...` | Production, Preview, Development |
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | Production, Preview, Development |
| `UPSTASH_REDIS_REST_TOKEN` | `AaBbCc...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |

**Important:** Use different Supabase projects for development and production (recommended)

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Click on deployment URL
4. Test all features

### Step 5: Post-Deployment Verification

Run through the verification checklist below.

---

## Verification Checklist

After completing setup, verify each feature works:

### Authentication
- [ ] Can sign up with email/password
- [ ] Can log in with existing account
- [ ] Can log out
- [ ] Session persists on page refresh
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

### What If Scripts
- [ ] Can navigate to What If mode
- [ ] Can enter struggle
- [ ] Can generate planning script
- [ ] 3-part plan appears (Prevention, Intervention, Escalation)

### Rate Limiting
- [ ] Can generate 5 scripts as free user
- [ ] 6th request returns 429 error
- [ ] Error message suggests upgrade
- [ ] Rate limit resets after 1 hour

### Database
- [ ] Check Supabase → Table Editor
- [ ] Verify `profiles` has your user
- [ ] Verify `children` has child profiles
- [ ] Verify `scripts` has generated scripts
- [ ] Verify RLS is enabled (can't see other users' data)

### Performance
- [ ] Page loads in <2 seconds
- [ ] Script generation completes in <5 seconds
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)

---

## Troubleshooting

### "Supabase URL is not defined"
- **Cause:** Missing `NEXT_PUBLIC_SUPABASE_URL` in .env.local
- **Solution:** Copy from Supabase dashboard → Settings → API

### "OpenAI API key invalid"
- **Cause:** Wrong API key or insufficient credits
- **Solution:** Verify key in OpenAI dashboard, check billing page

### "Cannot connect to Redis"
- **Cause:** Wrong Upstash credentials
- **Solution:** Verify URL and token match Upstash dashboard

### "Rate limit not working"
- **Cause:** Redis credentials not loaded
- **Solution:** Restart dev server after adding Upstash env vars

### "Database query failed"
- **Cause:** RLS policy blocks query OR table doesn't exist
- **Solution:** Run `/docs/schema.sql` in Supabase SQL Editor

### "User can't sign up"
- **Cause:** Email confirmation required OR SMTP not configured
- **Solution:** Disable email confirmation in Supabase → Authentication → Settings

### Build fails on Vercel
- **Cause:** TypeScript errors OR missing environment variables
- **Solution:** Check build logs, verify all env vars are set

---

## Security Best Practices

### 1. Environment Variables
- ✅ Store in `.env.local` (gitignored)
- ✅ Never commit `.env.local` to git
- ✅ Use different values for dev/production
- ❌ Never hardcode secrets in code

### 2. API Keys
- ✅ Keep service_role key SECRET
- ✅ Only use service_role on server-side
- ✅ Use anon key for client-side queries
- ❌ Never expose service_role to browser

### 3. Database
- ✅ Enable RLS on all tables
- ✅ Test RLS policies work
- ✅ Use separate projects for dev/prod
- ❌ Never disable RLS in production

### 4. Rate Limiting
- ✅ Enforce on all OpenAI routes
- ✅ Monitor Upstash dashboard for abuse
- ✅ Set OpenAI spending limits
- ❌ Don't skip rate limiting in production

---

## Development Workflow

### Daily Development
```bash
# Start dev server
npm run dev

# Make changes
# Test locally
# Commit to git

# Push to GitHub
git push origin main

# Vercel auto-deploys
# Test on production URL
```

### Adding New Environment Variable
1. Add to `.env.local` (local)
2. Add to `.env.example` (documentation)
3. Add to Vercel dashboard (production)
4. Restart dev server / redeploy

### Rotating Secrets
1. Generate new key in service dashboard
2. Update `.env.local` immediately
3. Update Vercel environment variables
4. Redeploy app
5. Revoke old key

---

## Next Steps

Once environment is set up:

1. ✅ Verify all features work (checklist above)
2. 📖 Read `/docs/DATABASE.md` to understand schema
3. 🔒 Read `/docs/RATE_LIMITING.md` to understand cost protection
4. 🏗️ Start building features!

---

## Support Resources

### Documentation
- Supabase Docs: https://supabase.com/docs
- OpenAI Docs: https://platform.openai.com/docs
- Upstash Docs: https://docs.upstash.com/
- Next.js Docs: https://nextjs.org/docs

### Status Pages
- Supabase Status: https://status.supabase.com/
- OpenAI Status: https://status.openai.com/
- Upstash Status: https://status.upstash.com/
- Vercel Status: https://www.vercel-status.com/

### Community
- Supabase Discord: https://discord.supabase.com
- Next.js Discord: https://nextjs.org/discord

---

**Last Updated:** January 2026  
**Estimated Setup Time:** 20-30 minutes  
**Difficulty:** Beginner-friendly with screenshots

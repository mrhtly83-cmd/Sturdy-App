# 🚀 Sturdy - Web & Mobile Development Guide

This repository contains both the **web app** (Next.js) and **mobile app** (React Native/Expo) versions of Sturdy.

## 📁 Project Structure

```
Sturdy-App/
├── nextjs-app/          # Web application (Next.js 14)
│   ├── app/            # App router pages
│   ├── lib/            # Shared utilities
│   └── public/         # Static assets
│
├── sturdy-app/          # Mobile application (React Native + Expo)
│   ├── app/            # App screens
│   ├── components/     # Reusable components
│   ├── lib/            # Supabase client & utilities
│   └── assets/         # Images and icons
│
├── docs/               # Documentation
├── dev.sh              # Development helper script
└── package.json        # Root package with helper scripts
```

## 🛠️ Quick Setup

### Prerequisites

- Node.js 20+ and npm 9+
- For mobile development:
  - iOS: Xcode (Mac only)
  - Android: Android Studio
  - OR: Expo Go app on your phone

### Installation

```bash
# Install all dependencies (root, web, and mobile)
npm run install:all

# OR install individually:
cd nextjs-app && npm install
cd ../sturdy-app && npm install
```

### Environment Variables

#### Web App (.env.local in nextjs-app/)

```bash
# Copy example and fill in values
cd nextjs-app
cp .env.example .env.local

# Required variables:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

#### Mobile App (.env in sturdy-app/)

```bash
# Copy example and fill in values
cd sturdy-app
cp .env.example .env

# Required variables:
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** Mobile app uses `EXPO_PUBLIC_` prefix for environment variables to make them available at runtime.

## 🏃 Running the Apps

### Option 1: Quick Start Script

```bash
# Run the interactive script
./dev.sh

# Choose:
# 1 = Web app only
# 2 = Mobile app only
# 3 = Both apps simultaneously
```

### Option 2: Manual Commands

#### Web App

```bash
# Development server
npm run dev:web

# Or directly:
cd nextjs-app
npm run dev

# Open: http://localhost:3000
```

#### Mobile App

```bash
# Start Expo dev server
npm run dev:mobile

# Or directly:
cd sturdy-app
npm start

# Then choose platform:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web preview
# - Scan QR code with Expo Go app
```

## 📱 Mobile Development Options

### 1. Physical Device (Easiest)

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Run `npm run dev:mobile`
3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app
4. App loads on your phone!

### 2. Simulators/Emulators

**iOS Simulator (Mac only):**
```bash
cd sturdy-app
npm start
# Press 'i' when Metro starts
```

**Android Emulator:**
```bash
cd sturdy-app
npm start
# Press 'a' when Metro starts
```

### 3. Web Preview

```bash
cd sturdy-app
npm start
# Press 'w' for web preview at http://localhost:8081
```

## 🔧 Common Commands

```bash
# Root-level commands (from /workspaces/Sturdy-App)
npm run dev:web              # Run web app
npm run dev:mobile           # Run mobile app
npm run build:web            # Build web app for production
npm run install:all          # Install all dependencies

# Web-specific (from nextjs-app/)
npm run dev                  # Development server
npm run build                # Production build
npm run start                # Start production server
npm run lint                 # Lint code

# Mobile-specific (from sturdy-app/)
npm start                    # Start Expo dev server
npm run android              # Run on Android
npm run ios                  # Run on iOS
npm run web                  # Run web version
```

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

```bash
# For mobile app:
cd sturdy-app
npm install

# For web app:
cd nextjs-app
npm install
```

### Expo dependency conflicts

```bash
cd sturdy-app
npx expo install --check    # Fix dependency versions
npm install                  # Reinstall
```

### TypeScript errors not clearing

1. Close and reopen VS Code
2. Or run: **TypeScript: Restart TS Server** from Command Palette (Cmd/Ctrl + Shift + P)

### Port already in use

```bash
# Web (Next.js on port 3000)
lsof -ti:3000 | xargs kill -9

# Mobile (Expo on port 8081)
lsof -ti:8081 | xargs kill -9
```

## 📦 Build for Production

### Web App

```bash
cd nextjs-app
npm run build           # Creates optimized production build
npm start               # Test production build locally

# Deploy to Vercel
vercel --prod           # Or use Vercel GitHub integration
```

### Mobile App

```bash
cd sturdy-app

# Build for iOS
npx eas build --platform ios

# Build for Android
npx eas build --platform android

# Build for both
npx eas build --platform all
```

**Note:** First-time EAS Build requires:
1. Create Expo account: `npx expo login`
2. Configure EAS: `npx eas build:configure`

## 🔐 Shared Backend (Supabase)

Both web and mobile apps connect to the **same Supabase project**, so:

- Users can sign in on web and mobile with the same account
- Data syncs automatically between platforms
- Scripts generated on mobile appear in web dashboard
- Same database, auth, and storage

## 📊 Database Schema

See [docs/DATABASE.md](docs/DATABASE.md) for full schema and setup instructions.

Quick setup:

```bash
# Run the schema in Supabase SQL Editor
# File: docs/schema.sql
```

## 🎨 Design Consistency

Both apps follow the same design system:

- **Colors:** Teal primary (#208092), Gold accent (#CA8A04)
- **Typography:** Inter font family
- **Spacing:** 16/24/32px grid
- **Components:** Shared design patterns (buttons, cards, forms)

Web uses Tailwind CSS, mobile uses React Native StyleSheet with matching values.

## 🧪 Testing

```bash
# Web app
cd nextjs-app
npm run lint            # ESLint checks
npm run build           # TypeScript checks

# Mobile app
cd sturdy-app
npm run lint            # ESLint checks (if configured)
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make changes in either web or mobile (or both)
3. Test on all platforms where applicable
4. Open a pull request

## 📝 Notes

- **Web app** is production-ready and deployed
- **Mobile app** is in active development
- Both apps share the same Supabase backend
- Environment variables differ between platforms (prefix differences)

---

**Need help?** Check [docs/](docs/) folder or open an issue on GitHub.

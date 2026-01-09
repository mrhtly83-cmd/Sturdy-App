# 🚀 Sturdy - Mobile App Development Guide

This repository contains the **mobile app** (React Native/Expo) version of Sturdy - an AI-powered parenting coach in your pocket.

## 📁 Project Structure

```
Sturdy-App/
├── sturdy-app/          # Mobile application (React Native + Expo)
│   ├── app/            # App screens (Expo Router)
│   ├── components/     # Reusable components
│   ├── lib/            # Supabase client & utilities
│   ├── assets/         # Images and icons
│   └── constants/      # Theme and configuration
│
├── docs/               # Documentation
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
# Install dependencies
npm run install

# OR directly:
cd sturdy-app && npm install
```

### Environment Variables

```bash
# Copy example and fill in values
cd sturdy-app
cp .env.example .env

# Required variables:
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** Expo uses `EXPO_PUBLIC_` prefix for environment variables to make them available at runtime.

## 🏃 Running the App

```bash
# Start Expo dev server (from root)
npm run dev

# Or directly from mobile app folder:
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
# Root-level commands
npm run dev                  # Start Expo dev server
npm run start                # Same as dev
npm run install              # Install dependencies
npm run android              # Run on Android
npm run ios                  # Run on iOS

# Mobile app folder (sturdy-app/)
npm start                    # Start Expo dev server
npm run android              # Run on Android
npm run ios                  # Run on iOS
npm run web                  # Run web version
```

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

```bash
cd sturdy-app
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
# Expo dev server on port 8081
lsof -ti:8081 | xargs kill -9

# Or kill all Expo processes
pkill -f "expo start"
```

## 📦 Build for Production

```bash
cd sturdy-app

# Build for iOS
npx eas build --platform ios

# Build for Android  
npx eas build --platform android

# Build for both
npx eas build --platform all
```

**First-time setup:**
1. Create Expo account: `npx expo login`
2. Configure EAS: `npx eas build:configure`
3. Follow prompts to set up app identifiers

## 🔐 Backend (Supabase)

The mobile app uses Supabase for:

- **Authentication**: Email/password and OAuth (Google, Apple)
- **Database**: PostgreSQL with Row Level Security
- **Storage**: User profiles and assets (future)
- **Real-time**: Live updates across devices

## 📊 Database Schema

See [docs/DATABASE.md](docs/DATABASE.md) for full schema and setup instructions.

Quick setup:

```bash
# Run the schema in Supabase SQL Editor
# File: docs/schema.sql
```

## 🎨 Design System

Sturdy uses Modern Glassmorphism design:

- **Colors:** Coral/Orange gradients (#F87171→#F97316), Teal gradients (#14B8A6→#0EA5E9)
- **Background:** Black with transparent video/imagery
- **Glass Elements:** 10-20% white opacity with backdrop blur
- **Typography:** System fonts for optimal performance
- **Components:** React Native StyleSheet with glassmorphism effects

## 🧪 Testing

```bash
cd sturdy-app
tsc --noEmit           # TypeScript checks
# Add Jest/testing-library tests in future
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

- **Mobile-first** app built with React Native and Expo
- Uses Expo Router for navigation (file-based routing)
- Supabase backend for auth, database, and storage
- Development uses Expo Go for quick iteration
- Production builds use EAS Build service

---

**Need help?** Check [docs/](docs/) folder or open an issue on GitHub.

# 🤖 Android Setup Guide - Sturdy App

Complete guide for deploying Sturdy to the Google Play Store.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Play Console Setup](#google-play-console-setup)
3. [Android Configuration](#android-configuration)
4. [Building for Android](#building-for-android)
5. [Internal Testing](#internal-testing)
6. [Play Store Submission](#play-store-submission)
7. [Post-Launch](#post-launch)

---

## Prerequisites

### Required

- Google Play Developer account ($25 one-time fee)
- EAS CLI installed (`npm install -g eas-cli`)
- App ready for release (tested, debugged, polished)
- Privacy policy URL (required)
- Content rating questionnaire completed

### Recommended

- Internal testing track for QA
- Alpha/Beta testing before production release
- Store listing graphics (feature graphic, screenshots)
- Promotional video (optional but increases installs)

---

## Google Play Console Setup

### Step 1: Create Developer Account

1. Go to https://play.google.com/console
2. Sign in with Google account
3. Click **Create account**
4. Select **Developer account** type:
   - **Individual**: Personal projects, faster approval
   - **Organization**: Business/company, requires verification
5. Accept **Google Play Developer Distribution Agreement**
6. Pay **$25 registration fee** (one-time, non-refundable)
7. Complete identity verification (1-2 days)

### Step 2: Create App

1. Click **Create app**
2. Fill in details:
   - **App name**: Sturdy
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
3. Declarations:
   - ✅ Developer Program Policies
   - ✅ US export laws
4. Click **Create app**

### Step 3: Set Up Store Presence

Navigate to **Store presence** → **Main store listing**:

**App details:**
- **App name**: Sturdy - Your Parenting Coach
- **Short description** (80 characters max):
  ```
  AI-powered scripts for parents in crisis moments. Evidence-based & compassionate.
  ```
- **Full description** (4000 characters max):
  ```
  Sturdy is your AI-powered parenting coach, available exactly when you need help most.

  🆘 INSTANT SCRIPTS FOR CRISIS MOMENTS
  • Tap SOS button during meltdowns, conflicts, or tough situations
  • Get validated scripts in seconds based on Attachment Theory
  • Real words you can say right now, not abstract advice

  👶 PERSONALIZED FOR YOUR CHILD
  • Track neurotype (ADHD, autism, anxiety, PDA)
  • Age-appropriate language
  • Learns what works for your family

  📖 JOURNAL YOUR PROGRESS
  • Save every script
  • See patterns in what works
  • Celebrate your growth as a parent

  🧠 EVIDENCE-BASED METHODOLOGY
  • Attachment Theory (secure, attuned parenting)
  • Internal Family Systems (parts work)
  • "Good Inside" framework (child is good, behavior separate)

  🔒 PRIVATE & SAFE
  • No data training on your child
  • Crisis resources built-in
  • Coaching, not therapy

  Perfect for parents of:
  ✓ Toddlers having meltdowns
  ✓ School-age kids refusing tasks
  ✓ Teens pushing boundaries
  ✓ Neurodivergent children
  ✓ Any parent needing support NOW

  Free to try. Premium features available with weekly, monthly, or lifetime subscriptions.

  ABOUT THE CREATOR
  Built by a parent frustrated with generic parenting apps during real crises.

  DISCLAIMER
  Sturdy is educational coaching, not therapy or medical advice. In crisis? Call 988 (US) or text 741741.

  CONTACT & SUPPORT
  Email: support@sturdy.app
  Website: https://sturdy.app

  PRIVACY
  We never train AI on your child's data. Full privacy policy at https://sturdy.app/privacy
  ```

### Step 4: Graphics Assets

**App icon** (Required):
- Size: 512 x 512 pixels
- Format: PNG (32-bit with alpha)
- Max file size: 1 MB
- Rounded corners: NO (Google Play adds automatically)

**Feature graphic** (Required):
- Size: 1024 x 500 pixels
- Format: PNG or JPEG
- Max file size: 1 MB
- Shows at top of store listing

**Phone screenshots** (Required, minimum 2):
- Dimensions: 16:9 or 9:16 aspect ratio
- Min: 320 pixels on short side
- Max: 3840 pixels on long side
- Format: PNG or JPEG
- Recommended: 1080 x 1920 pixels (portrait)

**Tablet screenshots** (Optional):
- 7-inch: 1200 x 1920 pixels
- 10-inch: 1600 x 2560 pixels

**Recommended screenshots (4-8):**
1. Landing screen with SOS button
2. Script generation flow
3. Generated script example
4. Child profile management
5. Journal/history view
6. Settings/premium features

### Step 5: Contact Details

- **Email**: support@sturdy.app (must be valid)
- **Website**: https://sturdy.app (optional)
- **Phone**: (optional, but improves trust)

### Step 6: Privacy Policy

- **Privacy policy URL**: https://sturdy.app/privacy (required)

**Must include:**
- Data collection practices
- Third-party services (Supabase, OpenAI)
- User rights (access, deletion)
- COPPA compliance (child data protection)

### Step 7: Categorization

**App category:**
- Primary: **Parenting**
- (If not available): Health & Fitness OR Education

**Tags** (up to 5):
- Parenting
- Mental Health
- Family
- Education
- Productivity

---

## Android Configuration

### Step 1: Update app.json

Ensure Android configuration is complete:

```json
{
  "expo": {
    "name": "Sturdy",
    "slug": "sturdy-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "android": {
      "package": "com.yourcompany.sturdy",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#E6F4FE",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE"
      ]
    },
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### Step 2: Prepare Adaptive Icons

**Foreground image:**
- Size: 432 x 432 pixels
- Format: PNG with transparency
- Safe area: Center 264 x 264 pixels
- File: `./assets/images/android-icon-foreground.png`

**Background:**
- Size: 432 x 432 pixels
- Format: PNG (solid color or pattern)
- File: `./assets/images/android-icon-background.png`

**Monochrome (Android 13+):**
- Size: 432 x 432 pixels
- Format: PNG (single color + transparency)
- File: `./assets/images/android-icon-monochrome.png`

**Tools:**
- https://romannurik.github.io/AndroidAssetStudio/ (adaptive icon generator)
- Figma (design)

---

## Building for Android

### Step 1: Set Up EAS Secrets

```bash
cd sturdy-app

# Add environment variables
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..."
```

### Step 2: Build AAB for Play Store

```bash
# First build (EAS will guide keystore setup)
eas build --platform android --profile production

# EAS will ask:
# "Would you like to generate a new Android Keystore?" → YES
# (EAS manages keystore securely)
```

**Build Profile (eas.json):**
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

**AAB vs APK:**
- **AAB** (Android App Bundle): Required for Play Store, optimized per device
- **APK**: Direct install, good for testing

### Step 3: Wait for Build

```bash
# Build typically takes 10-20 minutes
# View progress: https://expo.dev/accounts/[username]/projects/sturdy-app/builds

# Check status
eas build:list --platform android
```

### Step 4: Download Build

```bash
# Download AAB file
eas build:download --platform android --latest
```

---

## Internal Testing

### Step 1: Set Up Internal Testing Track

1. Go to Play Console → **Testing** → **Internal testing**
2. Click **Create new release**
3. Upload AAB file (from EAS build)
4. **Release name**: 1.0.0 (1) - Initial Release
5. **Release notes**:
   ```
   Initial release of Sturdy - AI-powered parenting coach
   - SOS script generation
   - Child profile management
   - Script journal/history
   - Evidence-based methodology (Attachment Theory, IFS)
   ```
6. Click **Review release** → **Start rollout to Internal testing**

### Step 2: Add Internal Testers

1. Navigate to **Internal testing** → **Testers** tab
2. Create **email list**:
   - List name: Team & Friends
   - Add emails (up to 100)
3. Click **Save**
4. Testers receive email with opt-in link

### Step 3: Share Test Link

Copy opt-in link and share:
```
https://play.google.com/apps/internaltest/[unique-id]
```

Testers must:
1. Join via link
2. Download from Play Store
3. Provide feedback

---

## Play Store Submission

### Step 1: Complete Content Rating

1. Go to Play Console → **Content rating**
2. Click **Start questionnaire**
3. Answer questions:
   - App category: Parenting / Health & Fitness
   - Contains violence: NO
   - Contains sexual content: NO
   - Contains profanity: NO
   - Contains controlled substances: NO
   - Contains gambling: NO
   - User-generated content: NO (unless you add forums)
4. Submit for rating
5. Expected rating: **Everyone** or **Everyone 10+**

### Step 2: Target Audience & Content

1. Go to **App content** → **Target audience and content**
2. **Target age group**: 18+ (parenting app)
3. **Appeals to children**: NO
4. Submit

### Step 3: App Access

1. Go to **App access**
2. **All or some functionality restricted**: YES
3. Provide test account:
   - Email: demo@sturdy.app
   - Password: DemoPassword123!
   - Instructions: "Login to test full app functionality including AI script generation"

### Step 4: Ads Declaration

1. Go to **Ads**
2. **Contains ads**: NO (unless monetizing with ads)
3. Submit

### Step 5: Data Safety

1. Go to **Data safety**
2. Complete questionnaire:
   - **Collects or shares user data**: YES
   - **Data types collected**:
     - Personal info (email, name)
     - App activity (generated scripts, ratings)
   - **Data usage**: App functionality, personalization
   - **Data sharing**: With service providers (Supabase, OpenAI)
   - **Encryption**: In transit and at rest
   - **Can users request deletion**: YES
3. Submit

### Step 6: Government Apps (Skip if not applicable)

Skip this section for consumer apps.

### Step 7: News Apps (Skip)

Skip for Sturdy.

### Step 8: COVID-19 Contact Tracing (Skip)

Skip for Sturdy.

### Step 9: Data Collection Questionnaire

Complete if applicable (already covered in Data Safety).

### Step 10: Promote to Production

1. Navigate to **Testing** → **Internal testing**
2. Click **Promote release** → **Production**
3. **Release name**: 1.0.0 (1)
4. **Release notes** (what's new):
   ```
   Welcome to Sturdy! 🎉

   Get AI-powered parenting scripts exactly when you need them most.

   ✨ Features:
   • Instant SOS scripts for crisis moments
   • Personalized for your child's neurotype
   • Evidence-based (Attachment Theory + IFS)
   • Private & secure (no data training)
   • Journal to track your progress

   Questions? Email support@sturdy.app
   ```
5. **Rollout percentage**: Start with 20% (gradual rollout recommended)
6. Click **Review release**
7. Verify all compliance items are complete (green checkmarks)
8. Click **Start rollout to Production**

### Step 11: Wait for Review

**Timeline:**
- Faster than iOS (typically hours to 1 day)
- May require additional review if flagged

**Review Status:**
- In review: Google is checking compliance
- Approved: App goes live automatically
- Changes requested: Address issues and resubmit

---

## Post-Launch

### Monitor Metrics

**Play Console Analytics:**
- Installs
- Uninstalls
- Ratings & reviews
- Crashes (ANRs)
- User acquisition

**Key Metrics:**
- First-day installs
- Week 1 retention
- Crash-free users (aim for >99.5%)
- Average rating (aim for >4.0)

### Respond to Reviews

1. Go to **User reviews**
2. Filter by rating:
   - 1-2 stars: Priority response
   - 3 stars: Acknowledge feedback
   - 4-5 stars: Thank users
3. Respond template:
   ```
   Thanks for your feedback! We're working hard to improve Sturdy.
   Please email support@sturdy.app so we can help resolve [issue].
   We're here to support parents like you! 💙
   ```

### Update App

**Version Updates:**
```bash
# Increment version in app.json
"version": "1.0.1"
"android": { "versionCode": 2 }

# Build new version
eas build --platform android --profile production

# Upload to Play Console (Testing or Production track)
```

### Gradual Rollout

1. Start at 20% of users
2. Monitor for 24 hours:
   - Crash rate
   - ANR rate
   - User reviews
3. If stable, increase to 50% → 100%

### Hotfixes

**Critical bugs:**
1. Fix bug locally
2. Increment `versionCode` (e.g., 1 → 2)
3. Build: `eas build --platform android`
4. Upload to Play Console
5. Select **Managed publishing** → **Review** → **Go live immediately**

---

## Troubleshooting

### Build Fails: "Invalid package name"

**Solution:**
Ensure `android.package` in app.json matches format: `com.company.app`

### Submit Fails: "Missing content rating"

**Solution:**
Complete content rating questionnaire in Play Console.

### Rejected: "Privacy Policy Required"

**Solution:**
- Add privacy policy URL in Play Console
- Ensure it's accessible (not 404)
- Must cover data collection practices

### Rejected: "Incomplete Data Safety Section"

**Solution:**
- Review Data Safety form
- Declare all data types collected
- Specify data usage and sharing

### High Crash Rate

**Solution:**
1. Go to Play Console → **Quality** → **Android vitals**
2. View crash reports
3. Fix crashes locally
4. Release hotfix

### Low Conversion Rate (Store Listing)

**Solution:**
- Improve screenshots (show key features)
- Add feature graphic
- Enhance description (clear benefits)
- Add promotional video

---

## Play Store Optimization (ASO)

### Title Optimization

**Format**: Sturdy - AI Parenting Coach

**Tips:**
- Include primary keyword
- Max 50 characters
- Clear, descriptive

### Short Description (80 chars)

Focus on primary benefit:
```
AI scripts for crisis moments. Evidence-based parenting support when you need it.
```

### Keywords (Not visible, but improves search)

**Primary keywords:**
- parenting app
- parenting coach
- parenting scripts
- ADHD parenting
- autism parenting
- gentle parenting
- positive parenting
- attachment parenting

**Secondary keywords:**
- toddler tantrums
- child behavior
- parenting advice
- parenting help

### A/B Testing

Play Console allows testing:
- Screenshots
- Feature graphic
- Short description
- App icon

**Test variations:**
- Different hero screenshots
- Benefit-focused vs feature-focused descriptions

---

## Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Play Store Review Guidelines](https://play.google.com/about/developer-content-policy/)
- [Android App Quality](https://developer.android.com/quality)
- [EAS Submit Documentation](https://docs.expo.dev/submit/android/)
- [Play Store Listing Experiments](https://support.google.com/googleplay/android-developer/answer/6227309)

---

**Last Updated**: January 2026  
**Difficulty**: Beginner-Intermediate  
**Estimated Time**: 1-2 hours (first submission)

**Good luck with your Play Store launch! 🚀**

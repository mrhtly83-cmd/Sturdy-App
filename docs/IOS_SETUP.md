# 🍎 iOS Setup Guide - Sturdy App

Complete guide for deploying Sturdy to the Apple App Store.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Apple Developer Account Setup](#apple-developer-account-setup)
3. [App Store Connect Setup](#app-store-connect-setup)
4. [iOS Configuration](#ios-configuration)
5. [Building for iOS](#building-for-ios)
6. [TestFlight Distribution](#testflight-distribution)
7. [App Store Submission](#app-store-submission)
8. [Post-Launch](#post-launch)

---

## Prerequisites

### Required

- Mac computer (for local builds with Xcode) OR EAS Build cloud service
- Apple ID
- Apple Developer Program membership ($99/year)
- EAS CLI installed (`npm install -g eas-cli`)
- App ready for release (tested, debugged, polished)

### Recommended

- TestFlight beta testing before public release
- App Store screenshots (6.5", 6.7", 12.9" displays)
- App Store preview videos (optional but increases conversions)
- Privacy policy URL (required for App Store)
- Support URL (required for App Store)

---

## Apple Developer Account Setup

### Step 1: Enroll in Apple Developer Program

1. Go to https://developer.apple.com/programs/enroll/
2. Sign in with your Apple ID
3. Click **Start Your Enrollment**
4. Choose **Individual** or **Organization**
   - **Individual**: $99/year, faster approval (1-2 days)
   - **Organization**: $99/year, requires business verification (1-2 weeks)
5. Complete enrollment form
6. Pay $99 enrollment fee
7. Wait for approval email

### Step 2: Two-Factor Authentication

1. Go to https://appleid.apple.com/
2. Sign in with your Apple ID
3. Enable **Two-Factor Authentication** (required for App Store Connect)
4. Add trusted phone number
5. Verify with code

### Step 3: Accept Developer Agreement

1. Go to https://developer.apple.com/account
2. Sign in
3. Accept the Apple Developer Program License Agreement
4. Complete any additional agreements

---

## App Store Connect Setup

### Step 1: Create App Identifier

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click **+** button
3. Select **App IDs** → **App**
4. Click **Continue**
5. Enter details:
   - **Description**: Sturdy - AI Parenting Coach
   - **Bundle ID**: `com.yourcompany.sturdy` (must match app.json)
   - **Explicit Bundle ID**: (select this option)
6. Select capabilities:
   - ✅ **Sign in with Apple**
   - ✅ **Push Notifications** (if using)
   - ✅ **Associated Domains** (if using deep links)
7. Click **Continue** → **Register**

### Step 2: Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com/
2. Click **My Apps**
3. Click **+** → **New App**
4. Fill in details:
   - **Platforms**: iOS
   - **Name**: Sturdy (must be unique across App Store)
   - **Primary Language**: English (US)
   - **Bundle ID**: Select `com.yourcompany.sturdy`
   - **SKU**: sturdy-app-001 (internal reference)
   - **User Access**: Full Access
5. Click **Create**

### Step 3: App Information

Navigate to your app → **App Information**:

**Localizations:**
- Primary Locale: English (US)
- App Name: Sturdy
- Subtitle: Your Parenting Coach in Crisis Moments (max 30 characters)

**Category:**
- Primary: Health & Fitness OR Lifestyle
- Secondary: Parenting (if available)

**Content Rights:**
- Does Not Contain Third-Party Content: (check if true)
- Contains Third-Party Content: (if using stock images)

**Age Rating:**
1. Click **Edit** next to Age Rating
2. Answer questionnaire:
   - Infrequent/Mild Medical/Treatment Information: YES
   - Infrequent/Mild Mature/Suggestive Themes: NO
   - All other categories: NO
3. Expected Rating: **4+** (safe for all ages)
4. Click **Done**

**Privacy Policy:**
- Privacy Policy URL: https://yourdomain.com/privacy
- (Required: create privacy policy page)

**Support URL:**
- Support URL: https://yourdomain.com/support
- (Or email: support@yourdomain.com converted to webpage)

---

## iOS Configuration

### Step 1: Update app.json

Ensure iOS configuration is complete:

```json
{
  "expo": {
    "name": "Sturdy",
    "slug": "sturdy-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "sturdyapp",
    "userInterfaceStyle": "automatic",
    "ios": {
      "bundleIdentifier": "com.yourcompany.sturdy",
      "buildNumber": "1",
      "supportsTablet": true,
      "requireFullScreen": false,
      "infoPlist": {
        "UIBackgroundModes": ["fetch"],
        "NSCameraUsageDescription": "Used to capture profile photos (optional)",
        "NSPhotoLibraryUsageDescription": "Used to select profile photos (optional)",
        "NSUserTrackingUsageDescription": "This identifier will be used to deliver personalized ads to you (only if using ads)"
      }
    },
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### Step 2: Prepare App Icons

**Icon Requirements:**
- Size: 1024x1024 pixels
- Format: PNG (no transparency)
- Color space: sRGB or P3
- Rounded corners: NO (iOS adds automatically)

Save as: `./assets/images/icon.png`

**Tip**: Use https://www.appicon.co/ to generate all required sizes

### Step 3: Prepare Splash Screen

**Splash Icon:**
- Size: 200x200 pixels minimum
- Format: PNG (transparency allowed)
- Centered on solid background

Save as: `./assets/images/splash-icon.png`

---

## Building for iOS

### Step 1: Set Up EAS Secrets

```bash
cd sturdy-app

# Add environment variables
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..."
```

### Step 2: Build for Production

```bash
# First build (EAS will guide credential setup)
eas build --platform ios --profile production

# EAS will ask:
# "Would you like to generate credentials?" → YES
# "Apple ID" → your-apple-id@example.com
# "Password" → (use App-Specific Password, see below)
```

**Creating App-Specific Password:**
1. Go to https://appleid.apple.com/
2. Sign in
3. Navigate to **Security** → **App-Specific Passwords**
4. Click **+** to generate
5. Name it: EAS Build
6. Copy password (use this when prompted by EAS)

### Step 3: Wait for Build

```bash
# Build typically takes 10-20 minutes
# View progress: https://expo.dev/accounts/[username]/projects/sturdy-app/builds

# Check status
eas build:list --platform ios
```

### Step 4: Download and Test

```bash
# Download IPA file
eas build:download --platform ios --latest

# Or install directly on device
# Scan QR code shown in build logs (requires development build)
```

---

## TestFlight Distribution

### Step 1: Submit to TestFlight

```bash
# Submit latest build to TestFlight
eas submit --platform ios --latest
```

EAS will prompt for:
- **Apple ID**: your-apple-id@example.com
- **App-Specific Password**: (same as build step)
- **App Store Connect App**: Select Sturdy

### Step 2: Configure TestFlight in App Store Connect

1. Go to https://appstoreconnect.apple.com/
2. Select Sturdy app
3. Navigate to **TestFlight** tab
4. Find your build (processing takes 5-10 minutes)
5. Click on build version

**Test Information:**
- What to Test: "Full app functionality - auth, profiles, script generation"
- Test Notes: "Focus on AI script generation and child profile management"

**Export Compliance:**
- Does your app use encryption? → YES (HTTPS/TLS)
- Does it qualify for exemption? → YES (standard encryption only)

### Step 3: Add Internal Testers

1. Click **Internal Testing** (left sidebar)
2. Click **+** next to Testers
3. Add testers:
   - Name
   - Email
   - (They'll receive TestFlight invite email)
4. Click **Add**

**Internal Testers:**
- Up to 100 testers
- No review required
- Instant access
- Best for: team, friends, family

### Step 4: Add External Testers (Optional)

1. Click **External Testing** (left sidebar)
2. Create new group: "Public Beta"
3. Add testers by email or public link
4. Submit for beta review (1-2 days)

**External Testers:**
- Up to 10,000 testers
- Requires Apple review
- Public link option
- Best for: real users, feedback

---

## App Store Submission

### Step 1: Prepare App Store Metadata

Go to https://appstoreconnect.apple.com/ → Sturdy → **App Store** tab:

**App Store Information:**
- **Name**: Sturdy
- **Subtitle**: Your Parenting Coach in Crisis Moments
- **Promotional Text**: Just-in-time scripts for parents in crisis moments. Evidence-based, AI-powered, compassionate support when you need it most.

**Description** (4000 characters max):
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

Free to try. Premium features available.

ABOUT THE CREATOR
Built by a parent frustrated with generic parenting apps during real crises.

DISCLAIMER
Sturdy is educational coaching, not therapy or medical advice. Crisis: 988 (US) or text 741741.
```

**Keywords** (100 characters max):
```
parenting,coach,scripts,meltdown,ADHD,autism,anxiety,attachment,gentle,positive
```

**Support URL**: https://yourdomain.com/support
**Marketing URL**: https://yourdomain.com
**Privacy Policy URL**: https://yourdomain.com/privacy

### Step 2: Prepare Screenshots

**Required Sizes:**
- 6.5" Display (iPhone 14 Pro Max): 1290 x 2796 pixels
- 6.7" Display (iPhone 15 Pro Max): 1290 x 2796 pixels
- 12.9" Display (iPad Pro): 2048 x 2732 pixels (if supporting iPad)

**Recommended Screenshots (5-10 per size):**
1. Landing screen with SOS button (hero shot)
2. Script generation in action
3. Generated script example
4. Child profile management
5. Journal/history view
6. Premium features (if applicable)

**Tools:**
- https://www.appscreenshots.io/ (screenshot generator)
- Figma (design mockups)
- https://www.shotbot.io/ (device frames)

### Step 3: App Preview Video (Optional but Recommended)

**Specifications:**
- Duration: 15-30 seconds
- Resolution: 1080p or 4K
- Format: .mp4 or .mov
- No sound (captions preferred)
- Show core features

**Tools:**
- Screen recording on device (iOS Screen Recording)
- iMovie (editing)
- Final Cut Pro (advanced)

### Step 4: Pricing & Availability

**Pricing:**
- Free (with in-app purchases)

**In-App Purchases:**
1. Create IAP products in App Store Connect:
   - Weekly: $2.99/week
   - Monthly: $9.99/month
   - Lifetime: $149.00 one-time

**Availability:**
- Countries: All territories
- Pre-Order: NO (optional for marketing hype)

### Step 5: Submit for Review

1. Select build from TestFlight
2. Add version information:
   - **What's New**: "Initial release of Sturdy - your AI parenting coach"
3. Configure App Review Information:
   - **Sign-In Required**: YES
   - **Demo Account**:
     - Username: demo@sturdy.app
     - Password: DemoPassword123!
     - (Create test account in Supabase)
   - **Notes**: "AI script generation requires OpenAI API. All safety guardrails in place."
4. Content Rights: Check if no third-party content
5. Advertising Identifier: NO (unless using ads)
6. Click **Submit for Review**

### Step 6: Wait for Review

**Timeline:**
- Initial Review: 24-48 hours (average)
- Rejections: Address issues and resubmit
- Approval: App goes live automatically (or set release date)

**Common Rejection Reasons:**
1. **Missing Demo Account**: Provide working test credentials
2. **Privacy Policy**: Must be accessible and complete
3. **Crashes**: Test thoroughly before submission
4. **Misleading Metadata**: Ensure screenshots match app
5. **4.5.2 Violation**: Apps requiring login must provide demo

---

## Post-Launch

### Monitor Metrics

**App Store Connect Analytics:**
- Impressions
- Product page views
- Downloads
- Conversion rate
- Crashes
- User retention

**Key Metrics:**
- First-day downloads
- Week 1 retention
- Crash-free sessions (aim for >99%)
- Rating/reviews

### Respond to Reviews

1. Go to App Store Connect → **Ratings and Reviews**
2. Respond to negative reviews:
   - Acknowledge issue
   - Provide solution
   - Show empathy
3. Thank positive reviews

**Sample Response:**
> "Thank you for your feedback! We're sorry you experienced [issue]. Please email support@sturdy.app so we can help resolve this. We're committed to making Sturdy better for parents like you."

### Update App

**Version Updates:**
```bash
# Increment version in app.json
"version": "1.0.1"
"ios": { "buildNumber": "2" }

# Build new version
eas build --platform ios --profile production

# Submit update
eas submit --platform ios --latest
```

**Update Release Notes:**
- Bug fixes
- New features
- Performance improvements
- User-requested changes

---

## Troubleshooting

### Build Fails: "Missing provisioning profile"

**Solution:**
```bash
eas build --platform ios --clear-credentials
```

### Submit Fails: "Invalid binary"

**Solution:**
- Ensure build completed successfully
- Check build logs for errors
- Rebuild with `--clear-cache`

### Rejected: "Guideline 4.2 - Minimum Functionality"

**Solution:**
- App must provide significant value
- Add more features beyond basic script generation
- Polish UI/UX

### Rejected: "Guideline 2.1 - Performance: App Completeness"

**Solution:**
- Remove placeholder text
- Test all features thoroughly
- Provide working demo account

### Slow Review (>5 days)

**Solution:**
- Contact App Review: https://developer.apple.com/contact/app-store/?topic=expedite
- Provide reason for expedited review (bug fix, critical update)

---

## Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [EAS Submit Documentation](https://docs.expo.dev/submit/ios/)
- [TestFlight Beta Testing](https://developer.apple.com/testflight/)

---

**Last Updated**: January 2026  
**Difficulty**: Intermediate  
**Estimated Time**: 2-3 hours (first submission)

**Good luck with your App Store launch! 🚀**

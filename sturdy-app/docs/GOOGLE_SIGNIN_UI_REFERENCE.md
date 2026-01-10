# Google Sign-In UI Reference

Visual reference for the implemented Google Sign-In buttons.

## Login Screen UI

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                    [✓ Logo - Gradient]                    ║
║                         STURDY                            ║
║                      Welcome back                         ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │                                                     │ ║
║  │  Sign in to continue                              │ ║
║  │                                                     │ ║
║  │  Email                                             │ ║
║  │  [____________________________________]            │ ║
║  │                                                     │ ║
║  │  Password                                          │ ║
║  │  [____________________________________]            │ ║
║  │                                                     │ ║
║  │                           Forgot password?         │ ║
║  │                                                     │ ║
║  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │ ║
║  │  ┃      Sign In (Coral Gradient)            ┃  │ ║
║  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │ ║
║  │                                                     │ ║
║  │  ──────────────── or ─────────────────             │ ║
║  │                                                     │ ║
║  │  ┌───────────────────────────────────────────┐    │ ║
║  │  │  🔵 G   Continue with Google              │    │ ║
║  │  │  (White Background, Blue Logo)            │    │ ║
║  │  └───────────────────────────────────────────┘    │ ║
║  │                                                     │ ║
║  │  ────────── or try other methods ───────────       │ ║
║  │                                                     │ ║
║  │  ┌─────────────────┐                               │ ║
║  │  │     Apple      │                               │ ║
║  │  └─────────────────┘                               │ ║
║  │                                                     │ ║
║  │  Don't have an account? Sign Up                   │ ║
║  │                                                     │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Button Details

**Email Sign In Button:**
- Background: Coral to Orange gradient (#F87171 → #F97316)
- Text: White, bold, 18px
- Border radius: 16px
- Full-width
- Padding: 24px vertical

**Google Sign In Button:**
- Background: White (#FFFFFF)
- Border: 1px solid rgba(255,255,255,0.3)
- Text: Dark gray (#1F2937), semibold, 16px
- Logo: Blue "G" (#4285F4), 20px
- Border radius: 16px (rounded-xl)
- Full-width
- Padding: 24px vertical
- Gap: 12px between logo and text

**Apple Button:**
- Background: Transparent
- Border: 2px solid white/primary
- Text: White, semibold, 16px
- Border radius: 12px (rounded-lg)
- Half-width
- Padding: 16px vertical

---

## Signup Screen UI

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                    [✓ Logo - Gradient]                    ║
║                         STURDY                            ║
║                  Create your account                      ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │                                                     │ ║
║  │  Get started for free                             │ ║
║  │                                                     │ ║
║  │  Email                                             │ ║
║  │  [____________________________________]            │ ║
║  │                                                     │ ║
║  │  Password                                          │ ║
║  │  [____________________________________]            │ ║
║  │                                                     │ ║
║  │  Confirm Password                                  │ ║
║  │  [____________________________________]            │ ║
║  │                                                     │ ║
║  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │ ║
║  │  ┃    Create Account (Coral Gradient)       ┃  │ ║
║  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │ ║
║  │                                                     │ ║
║  │  ──────────────── or ─────────────────             │ ║
║  │                                                     │ ║
║  │  ┌───────────────────────────────────────────┐    │ ║
║  │  │  🔵 G   Sign up with Google               │    │ ║
║  │  │  (White Background, Blue Logo)            │    │ ║
║  │  └───────────────────────────────────────────┘    │ ║
║  │                                                     │ ║
║  │  ────────── or try other methods ───────────       │ ║
║  │                                                     │ ║
║  │  ┌─────────────────┐                               │ ║
║  │  │     Apple      │                               │ ║
║  │  └─────────────────┘                               │ ║
║  │                                                     │ ║
║  │  By signing up, you agree to our                  │ ║
║  │  Terms of Service and Privacy Policy              │ ║
║  │                                                     │ ║
║  │  Already have an account? Sign In                 │ ║
║  │                                                     │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Button Details

Same as login screen with:
- Primary button text: "Create Account"
- Google button text: "Sign up with Google"
- Additional terms of service text

---

## Loading States

### During Google Sign-In

**Login Screen:**
```
┌───────────────────────────────────────────┐
│  ⏳ (spinner)  Signing in...              │
│  (White Background)                       │
└───────────────────────────────────────────┘
```

**Signup Screen:**
```
┌───────────────────────────────────────────┐
│  ⏳ (spinner)  Signing up...              │
│  (White Background)                       │
└───────────────────────────────────────────┘
```

### Button Disabled State
- Opacity: 50%
- All buttons disabled during Google auth
- Primary button also disabled
- Cannot interact with form

---

## Responsive Behavior

### Phone (Portrait)
- Full-width buttons
- Vertical stack layout
- Proper spacing maintained
- Scrollable if keyboard open

### Phone (Landscape)
- Same layout
- Scrollable content
- Buttons remain full-width

### Tablet
- Same layout as phone
- Larger padding/spacing
- Centered content
- Max-width constraint (optional)

---

## Dark Mode (Current)

**Background:**
- Solid black (#000000)
- Gradient overlay for depth

**Cards:**
- Glass blur effect
- 10% white opacity
- Subtle border

**Text:**
- White for primary text
- Gray (#9CA3AF) for secondary
- High contrast for readability

---

## Light Mode (Future)

**Background:**
- White (#FFFFFF)
- Subtle gradient overlay

**Cards:**
- Glass blur effect
- Light shadow
- Subtle border

**Text:**
- Dark for primary text
- Gray for secondary
- Adjusted for light background

**Google Button (Light Mode):**
- Keep white background
- Darker border for visibility
- Same logo and text colors

---

## Color Palette

### Google Button Colors
```
Background: #FFFFFF (white)
Border: rgba(255, 255, 255, 0.3)
Text: #1F2937 (gray-800)
Logo: #4285F4 (Google blue)
```

### Primary Button (Email)
```
Gradient: #F87171 → #F97316 (coral to orange)
Text: #FFFFFF (white)
```

### Secondary Button (Apple)
```
Background: transparent
Border: 2px solid primary/white
Text: #FFFFFF (white)
```

### Dividers
```
Line: rgba(255, 255, 255, 0.2)
Text: #9CA3AF (gray-400)
```

---

## Animation Specs

### Button Press Animation
```javascript
{
  scale: pressed ? 0.97 : 1,
  opacity: pressed ? 0.9 : 1,
  duration: 150ms,
  type: 'timing'
}
```

### Loading Spinner
- Color matches button text color
- Size: 20px
- Smooth rotation
- Replaces button content

### Fade In Animation
- Form card fades in with slide up
- Duration: 300ms
- Delay: 200ms
- Easing: ease-out

---

## Accessibility

### Screen Reader Support
- Button labeled: "Continue with Google"
- Loading state announced
- Error messages announced

### Touch Targets
- Minimum 44x44 points
- Google button: Full-width, 56px height
- Sufficient spacing between elements

### Color Contrast
- Text on white: WCAG AAA compliant
- Logo visibility: High contrast
- Error states: Red with sufficient contrast

---

## Error States

### Alert Dialogs

**Sign-in Cancelled:**
```
┌─────────────────────────────────┐
│  Google Sign-In Failed          │
│  ─────────────────────          │
│  Sign-in cancelled by user      │
│                                 │
│              [OK]               │
└─────────────────────────────────┘
```

**Network Error:**
```
┌─────────────────────────────────┐
│  Google Sign-In Failed          │
│  ─────────────────────          │
│  Google Sign-In failed.         │
│  Please try again.              │
│                                 │
│              [OK]               │
└─────────────────────────────────┘
```

**Invalid OAuth:**
```
┌─────────────────────────────────┐
│  Google Sign-In Failed          │
│  ─────────────────────          │
│  [Detailed error message]       │
│                                 │
│              [OK]               │
└─────────────────────────────────┘
```

---

## Code Examples

### Google Button Implementation (Login)

```typescript
<AnimatedButton
  variant="outline"
  size="lg"
  onPress={handleGoogleSignIn}
  loading={googleLoading}
  disabled={loading || googleLoading}
  style={styles.googleButton}
>
  <View style={styles.googleButtonContent}>
    <Text style={styles.googleLogo}>G</Text>
    <Text style={styles.googleButtonText}>
      {googleLoading ? 'Signing in...' : 'Continue with Google'}
    </Text>
  </View>
</AnimatedButton>
```

### Styles

```typescript
googleButton: {
  backgroundColor: '#fff',
  borderColor: 'rgba(255,255,255,0.3)',
  borderWidth: 1,
},
googleButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.md, // 16px
},
googleLogo: {
  fontSize: typography.fontSize.xl, // 20px
  fontWeight: typography.fontWeight.bold,
  color: '#4285F4',
},
googleButtonText: {
  color: '#1F2937',
  fontSize: typography.fontSize.base, // 16px
  fontWeight: typography.fontWeight.semibold,
},
```

---

## Design System Integration

### Spacing
- Uses theme spacing: `spacing.md` (16px), `spacing.lg` (24px)
- Consistent with rest of app

### Typography
- Uses theme typography: `fontSize.base`, `fontWeight.semibold`
- System fonts for optimal performance

### Colors
- Primary: Coral/Orange gradients (existing)
- Google: Official Google blue (#4285F4)
- Text: Theme-based (dark mode aware)

### Border Radius
- Large buttons: `radius.xl` (16px)
- Medium buttons: `radius.lg` (12px)
- Matches existing UI

---

## Platform Differences

### iOS
- Native iOS button press animation
- Haptic feedback on press
- Safe area insets respected

### Android
- Material Design ripple effect
- Haptic feedback on press
- System back button support

### Both
- Same visual appearance
- Same functionality
- Platform-appropriate animations

---

**Last Updated:** January 10, 2026  
**Status:** Implemented  
**Design System:** Sturdy Glassmorphism

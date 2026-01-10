# Theme System Guide

## Overview

The Sturdy App theme system provides a comprehensive set of design tokens, components, and utilities for building a consistent, accessible, and beautiful user experience. The system is built around a **glassmorphism** aesthetic with calming colors and smooth animations.

## Table of Contents

- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing](#spacing)
- [Border Radius](#border-radius)
- [Shadows](#shadows)
- [Animations](#animations)
- [Components](#components)
- [Best Practices](#best-practices)
- [Accessibility](#accessibility)

---

## Color Palette

### Primary Colors (Warm Coral/Orange)

Used for primary actions, CTAs, and brand identity.

```typescript
import { colors } from '@/lib/theme';

colors.primary[50]  // #FFF7ED - Very light orange
colors.primary[100] // #FFEDD5
colors.primary[200] // #FED7AA
colors.primary[300] // #FDBA74
colors.primary[400] // #FB923C
colors.primary[500] // #F97316 - Main orange
colors.primary[600] // #EA580C
colors.primary[700] // #C2410C
colors.primary[800] // #9A3412
colors.primary[900] // #7C2D12 - Very dark orange
```

**Usage:**
- Primary buttons and CTAs
- Active states
- Important highlights
- Gradient overlays

### Secondary Colors (Teal/Turquoise)

Used for secondary actions, calm elements, and trust indicators.

```typescript
colors.secondary[500] // #14B8A6 - Main teal
```

**Usage:**
- Secondary buttons
- Focus states
- Calm, reassuring elements
- Supporting visual hierarchy

### Accent Colors (Soft Pink/Rose)

Used for accents, alerts, and special highlights.

```typescript
colors.accent[500] // #F43F5E - Main rose
```

**Usage:**
- Special highlights
- Decorative elements
- Gradient combinations

### Neutral Colors (Soft Grays)

Foundation colors for text, backgrounds, and borders.

```typescript
colors.gray[50]  // #F9FAFB - Very light
colors.gray[900] // #111827 - Very dark
```

**Usage:**
- Text colors
- Backgrounds
- Borders and dividers
- Disabled states

### Semantic Colors

Consistent colors for common UI states.

```typescript
colors.success // #10B981 - Green
colors.warning // #F59E0B - Amber
colors.error   // #EF4444 - Red
colors.info    // #3B82F6 - Blue
```

### Background & Surface

```typescript
colors.background.light // '#FFFFFF'
colors.background.dark  // '#0F172A'

colors.surface.light    // 'rgba(255, 255, 255, 0.7)'
colors.surface.dark     // 'rgba(15, 23, 42, 0.7)'
```

---

## Typography

### Font Sizes

```typescript
import { typography } from '@/lib/theme';

typography.fontSize.xs    // 12px
typography.fontSize.sm    // 14px
typography.fontSize.base  // 16px
typography.fontSize.lg    // 18px
typography.fontSize.xl    // 20px
typography.fontSize['2xl'] // 24px
typography.fontSize['3xl'] // 30px
typography.fontSize['4xl'] // 36px
typography.fontSize['5xl'] // 48px
```

### Font Weights

```typescript
typography.fontWeight.light     // '300'
typography.fontWeight.normal    // '400'
typography.fontWeight.medium    // '500'
typography.fontWeight.semibold  // '600'
typography.fontWeight.bold      // '700'
```

### Line Heights

```typescript
typography.lineHeight.tight    // 1.25
typography.lineHeight.normal   // 1.5
typography.lineHeight.relaxed  // 1.75
```

### Usage Example

```tsx
<Text style={{
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold,
  lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
}}>
  Welcome to Sturdy
</Text>
```

---

## Spacing

Consistent spacing scale for margins, padding, and gaps.

```typescript
import { spacing } from '@/lib/theme';

spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 16px
spacing.lg    // 24px
spacing.xl    // 32px
spacing['2xl'] // 48px
spacing['3xl'] // 64px
```

### Usage Example

```tsx
<View style={{
  padding: spacing.lg,
  marginBottom: spacing.md,
  gap: spacing.sm,
}}>
  {/* Content */}
</View>
```

---

## Border Radius

Consistent border radius for rounded corners.

```typescript
import { radius } from '@/lib/theme';

radius.none    // 0
radius.sm      // 4px
radius.md      // 8px
radius.lg      // 12px
radius.xl      // 16px
radius['2xl']  // 24px
radius.full    // 9999px (fully rounded)
```

---

## Shadows

React Native compatible shadow styles for depth.

```typescript
import { shadows } from '@/lib/theme';

shadows.sm  // Small shadow
shadows.md  // Medium shadow
shadows.lg  // Large shadow
shadows.xl  // Extra large shadow
```

### Usage Example

```tsx
<View style={[
  { backgroundColor: 'white', borderRadius: radius.lg },
  shadows.md
]}>
  {/* Content */}
</View>
```

---

## Animations

### Duration

```typescript
import { animation } from '@/lib/theme';

animation.duration.fast    // 200ms
animation.duration.normal  // 300ms
animation.duration.slow    // 500ms
```

### Gradients

Pre-defined gradient combinations.

```typescript
import { gradients } from '@/lib/theme';

gradients.primary   // Orange gradient
gradients.secondary // Teal gradient
gradients.accent    // Rose gradient
gradients.warm      // Orange to rose
gradients.cool      // Teal to blue
```

---

## Components

### AnimatedButton

Pressable button with scale animation, gradient backgrounds, and haptic feedback.

**Props:**
- `label` / `children`: Button text or custom content
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `onPress`: Press handler
- `loading`: Show loading spinner
- `disabled`: Disable button
- `leftIcon` / `rightIcon`: Icon components

**Example:**

```tsx
import { AnimatedButton } from '@/components/ui/animated-button';

<AnimatedButton
  label="Get Started"
  variant="primary"
  size="lg"
  onPress={() => console.log('Pressed!')}
/>

<AnimatedButton
  label="Cancel"
  variant="ghost"
  size="md"
/>
```

### AnimatedCard

Card component with glassmorphism effect, animations, and optional press interactions.

**Props:**
- `children`: Card content
- `delay`: Animation delay in ms
- `pressable`: Enable press interactions
- `onPress`: Press handler
- `gradientBorder`: Show gradient border
- `useBlur`: Use blur effect

**Example:**

```tsx
import { AnimatedCard } from '@/components/ui/animated-card';

<AnimatedCard delay={100} gradientBorder>
  <Text>Card with gradient border</Text>
</AnimatedCard>

<AnimatedCard pressable onPress={() => {}}>
  <Text>Pressable card</Text>
</AnimatedCard>
```

### AnimatedInput

Floating label input with smooth animations and validation states.

**Props:**
- `label`: Input label (floats on focus)
- `value`: Input value
- `error`: Error message
- `leftIcon` / `rightIcon`: Icon components
- `onRightIconPress`: Right icon press handler
- All standard `TextInputProps`

**Example:**

```tsx
import { AnimatedInput } from '@/components/ui/AnimatedInput';

<AnimatedInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={emailError}
/>

<AnimatedInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  rightIcon={<EyeIcon />}
  onRightIconPress={togglePasswordVisibility}
/>
```

### AnimatedContainer

Wrapper component with preset animations.

**Props:**
- `children`: Content to animate
- `animation`: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'none'
- `delay`: Animation delay in ms
- `duration`: Animation duration in ms

**Example:**

```tsx
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';

<AnimatedContainer animation="slideUp" delay={200}>
  <Text>This content slides up</Text>
</AnimatedContainer>

<AnimatedContainer animation="fadeIn" duration={500}>
  <Image source={logo} />
</AnimatedContainer>
```

### GradientBackground

Full-screen or custom gradient background component.

**Props:**
- `children`: Content to render on gradient
- `colors`: Custom gradient colors
- `animated`: Enable color transition animations
- `start` / `end`: Gradient direction

**Example:**

```tsx
import { GradientBackground } from '@/components/ui/GradientBackground';
import { gradients } from '@/lib/theme';

<GradientBackground colors={gradients.primary}>
  <SafeAreaView>
    {/* Your content */}
  </SafeAreaView>
</GradientBackground>
```

### BlurView

Reusable blur effect wrapper with different intensity levels.

**Props:**
- `children`: Content on blur
- `intensity`: 'extraLight' | 'light' | 'medium' | 'strong'
- `tint`: 'light' | 'dark' | 'default'

**Example:**

```tsx
import { BlurView } from '@/components/ui/BlurView';

<BlurView intensity="medium" tint="dark">
  <View style={{ padding: spacing.lg }}>
    <Text>Blurred content</Text>
  </View>
</BlurView>
```

---

## Best Practices

### 1. **Use Theme Tokens Consistently**

Always use theme tokens instead of hardcoded values:

```tsx
// ❌ Bad
<View style={{ padding: 16, borderRadius: 12 }}>

// ✅ Good
import { spacing, radius } from '@/lib/theme';
<View style={{ padding: spacing.md, borderRadius: radius.lg }}>
```

### 2. **Keep Animations Subtle and Calming**

- Use 300-500ms durations for most animations
- Avoid jarring or aggressive animations
- Always use easing functions for smoothness

```tsx
// ✅ Good animation timing
<AnimatedContainer animation="fadeIn" duration={300}>
```

### 3. **Maintain 60fps Performance**

- Use `react-native-reanimated` for gesture-based animations
- Use `Moti` for declarative animations
- Avoid animating expensive properties (use transform/opacity)

### 4. **Support Dark Mode**

Always check theme and provide appropriate colors:

```tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/lib/theme';

const theme = useColorScheme() ?? 'light';
const textColor = theme === 'dark' ? colors.gray[50] : colors.gray[900];
```

### 5. **Use Semantic Colors**

Use semantic colors for consistent meaning:

```tsx
// Success state
<Text style={{ color: colors.success }}>Profile saved!</Text>

// Error state
<Text style={{ color: colors.error }}>Invalid email</Text>
```

### 6. **Responsive Spacing**

Use responsive utilities for different screen sizes:

```tsx
import { responsive, spacing } from '@/lib/theme';

const containerPadding = responsive(
  spacing.md,  // small
  spacing.lg,  // medium
  spacing.xl   // large
);
```

---

## Accessibility

### 1. **Touch Target Sizes**

Ensure all interactive elements meet minimum size requirements (44x44 points on iOS).

```tsx
<AnimatedButton
  size="md" // Provides adequate touch target
  label="Submit"
/>
```

### 2. **Color Contrast**

Maintain WCAG AA contrast ratios (4.5:1 for normal text).

- Use `colors.gray[900]` on light backgrounds
- Use `colors.gray[50]` on dark backgrounds

### 3. **Accessibility Labels**

Add labels to interactive elements:

```tsx
<Pressable
  accessibilityLabel="Close modal"
  accessibilityRole="button"
>
  <CloseIcon />
</Pressable>
```

### 4. **Reduced Motion**

Consider users who prefer reduced motion:

```tsx
import { AccessibilityInfo } from 'react-native';

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
}, []);

// Disable animations if needed
<AnimatedContainer
  animation={reduceMotion ? 'none' : 'slideUp'}
>
```

---

## Examples

### Full Login Screen Example

```tsx
import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { spacing, gradients } from '@/lib/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <GradientBackground colors={gradients.primary}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, padding: spacing.xl, justifyContent: 'center' }}>
          <AnimatedContainer animation="fadeIn" delay={100}>
            <AnimatedInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </AnimatedContainer>

          <AnimatedContainer animation="fadeIn" delay={200}>
            <AnimatedInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </AnimatedContainer>

          <AnimatedContainer animation="slideUp" delay={300}>
            <AnimatedButton
              label="Sign In"
              variant="primary"
              size="lg"
              onPress={() => {}}
            />
          </AnimatedContainer>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
```

---

## Support

For questions or issues with the theme system, please refer to:

- Project README
- Component source code in `/components/ui/`
- Theme tokens in `/lib/theme.ts`

---

**Last Updated:** January 2026  
**Version:** 1.0.0

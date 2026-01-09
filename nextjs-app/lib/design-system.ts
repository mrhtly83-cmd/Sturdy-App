/**
 * Sturdy Design System
 * Modern Glassmorphism with transparent layers and premium aesthetics
 */

export const colors = {
  // Primary gradient (Coral)
  coral: {
    500: '#F87171',
    600: '#F97316',
  },
  // Secondary gradient (Teal)
  teal: {
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
  },
  // Utility colors
  blue: {
    500: '#3B82F6',
    600: '#0EA5E9',
  },
  // Backgrounds
  black: '#000000',
  white: '#FFFFFF',
  // Glass elements
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(255, 255, 255, 0.2)',
  },
} as const;

export const typography = {
  // Headlines
  headline: {
    size: 'text-5xl md:text-6xl',
    weight: 'font-black',
    tracking: 'tracking-tight',
    leading: 'leading-tight',
  },
  // Body text
  body: {
    size: 'text-base md:text-lg',
    weight: 'font-medium',
    leading: 'leading-relaxed',
  },
  // Button text
  button: {
    size: 'text-lg',
    weight: 'font-bold',
  },
  // Small text
  small: {
    size: 'text-sm',
    weight: 'font-medium',
  },
} as const;

export const layout = {
  // Containers
  container: {
    mobile: 'max-w-md',
    tablet: 'max-w-2xl',
    desktop: 'max-w-4xl',
  },
  // Rounded corners
  rounded: {
    card: 'rounded-2xl',
    button: 'rounded-full',
    container: 'rounded-3xl',
  },
  // Backdrop blur
  blur: {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl',
  },
  // Shadows
  shadow: {
    card: 'shadow-xl',
    button: 'shadow-2xl',
    elevated: 'shadow-2xl',
  },
} as const;

export const glassmorphism = {
  // Glass card styles
  card: 'backdrop-blur-md bg-white/10 border border-white/20',
  cardHover: 'hover:bg-white/20 transition-all duration-300',
  // Glass button styles
  button: 'backdrop-blur-md bg-white/10 border-2 border-white/30',
  buttonHover: 'hover:bg-white/20 hover:border-white/50',
  // Glass overlay
  overlay: 'backdrop-blur-xl bg-white/10 border border-white/30',
} as const;

export const gradients = {
  // Primary coral gradient
  coral: 'bg-gradient-to-r from-coral-500 to-coral-600',
  coralHover: 'hover:from-coral-600 hover:to-coral-700',
  // Secondary teal gradient
  teal: 'bg-gradient-to-r from-teal-500 to-blue-600',
  tealHover: 'hover:from-teal-600 hover:to-blue-700',
  // Background gradients
  darkOverlay: 'bg-gradient-to-b from-black/40 via-transparent to-black/50',
} as const;

export const animations = {
  // Hover transforms
  scaleUp: 'transform hover:scale-105 transition-all duration-300',
  scaleUpSmall: 'transform hover:scale-102 transition-all duration-200',
  // Fade in
  fadeIn: 'animate-fade-in',
  // Floating effect
  float: 'animate-float',
} as const;

// Component presets
export const components = {
  // Primary CTA button
  primaryButton: `px-10 py-4 ${gradients.coral} ${gradients.coralHover} text-white ${typography.button.size} ${typography.button.weight} ${layout.rounded.button} ${layout.shadow.button} ${animations.scaleUp}`,
  
  // Secondary glass button
  secondaryButton: `px-10 py-4 ${glassmorphism.button} ${glassmorphism.buttonHover} text-white ${typography.button.size} ${typography.button.weight} ${layout.rounded.button} ${animations.scaleUp}`,
  
  // Glass card
  glassCard: `${glassmorphism.card} ${glassmorphism.cardHover} ${layout.rounded.card} ${layout.shadow.card} p-6`,
  
  // Badge
  badge: `px-4 py-2 ${glassmorphism.card} ${layout.rounded.button}`,
  
  // Top bar
  topBar: `backdrop-blur-md bg-white/10 border-b border-white/10`,
} as const;

// Utility functions
export const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default {
  colors,
  typography,
  layout,
  glassmorphism,
  gradients,
  animations,
  components,
  cn,
};

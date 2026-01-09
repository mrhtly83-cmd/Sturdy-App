import { Platform } from 'react-native';

const palette = {
  sage: '#7BA394',
  mint: '#9BD4C1',
  teal: '#3BA8A0',
  blue: '#6EA8FF',
  sand: '#F2E9E4',
  stone: '#25313B',
  slate: '#1F252E',
  blush: '#F6D7D0',
  amber: '#F2B880',
};

const tintColorLight = palette.teal;
const tintColorDark = '#C2F4ED';

export const Colors = {
  light: {
    text: '#0F172A',
    mutedText: '#475569',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    elevated: '#F3F4F6',
    card: 'rgba(255,255,255,0.92)',
    border: 'rgba(15, 23, 42, 0.08)',
    glass: 'rgba(255,255,255,0.82)',
    tint: tintColorLight,
    accent: palette.blue,
    secondary: palette.mint,
    danger: '#EF4444',
    success: '#10B981',
    shadow: 'rgba(15, 23, 42, 0.12)',
    icon: '#475569',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E2E8F0',
    mutedText: '#94A3B8',
    background: '#0B1220',
    surface: '#111827',
    elevated: '#111827',
    card: 'rgba(17,24,39,0.88)',
    border: 'rgba(226, 232, 240, 0.08)',
    glass: 'rgba(17,24,39,0.78)',
    tint: tintColorDark,
    accent: palette.blue,
    secondary: palette.mint,
    danger: '#F87171',
    success: '#34D399',
    shadow: 'rgba(0, 0, 0, 0.45)',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
  },
};

export const Gradients = {
  primary: ['#9BD4C1', '#3BA8A0'] as const,
  accent: ['#6EA8FF', '#3BA8A0'] as const,
  warm: ['#F6D7D0', '#F2B880'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  gutter: 24,
};

export const Radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const Shadows = {
  soft: {
    shadowColor: 'rgba(15, 23, 42, 0.12)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  medium: {
    shadowColor: 'rgba(15, 23, 42, 0.18)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 10,
  },
};

export const Typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800' as const, letterSpacing: -0.6 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, letterSpacing: -0.4 },
  headline: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '700' as const },
  callout: { fontSize: 15, lineHeight: 22, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  footnote: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

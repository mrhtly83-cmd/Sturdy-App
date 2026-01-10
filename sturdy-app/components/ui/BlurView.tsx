import { ReactNode } from 'react';
import { StyleProp, ViewStyle, Platform } from 'react-native';
import { BlurView as ExpoBlurView, BlurViewProps as ExpoBlurViewProps } from 'expo-blur';

export type BlurIntensity = 'light' | 'medium' | 'strong' | 'extraLight';

interface BlurViewProps {
  children?: ReactNode;
  intensity?: BlurIntensity;
  tint?: 'light' | 'dark' | 'default';
  style?: StyleProp<ViewStyle>;
}

const INTENSITY_MAP: Record<BlurIntensity, number> = {
  extraLight: 20,
  light: 40,
  medium: 60,
  strong: 80,
};

/**
 * BlurView - Reusable blur effect wrapper using expo-blur
 * 
 * Provides different intensity levels and platform-specific optimizations
 * 
 * @param children - Child components to render on top of blur
 * @param intensity - Blur intensity level: extraLight, light, medium, strong (default: medium)
 * @param tint - Tint color: light, dark, default (default: default)
 * @param style - Additional styles
 */
export function BlurView({
  children,
  intensity = 'medium',
  tint = 'default',
  style,
}: BlurViewProps) {
  const blurIntensity = INTENSITY_MAP[intensity];

  // Platform-specific optimization
  const experimentalBlurMethod = Platform.select({
    ios: 'dimezisBlurView' as ExpoBlurViewProps['experimentalBlurMethod'],
    android: undefined,
  });

  return (
    <ExpoBlurView
      intensity={blurIntensity}
      tint={tint}
      experimentalBlurMethod={experimentalBlurMethod}
      style={style}
    >
      {children}
    </ExpoBlurView>
  );
}

import { ReactNode } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { gradients } from '@/lib/theme';

interface GradientBackgroundProps {
  children?: ReactNode;
  colors?: string[];
  animated?: boolean;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
}

/**
 * GradientBackground - Full-screen or custom gradient background component
 * 
 * @param children - Child components to render on top of gradient
 * @param colors - Array of colors for gradient (default: primary gradient)
 * @param animated - Whether to animate color transitions (default: false)
 * @param start - Gradient start position (default: top-left)
 * @param end - Gradient end position (default: bottom-right)
 * @param style - Additional styles
 */
export function GradientBackground({
  children,
  colors: customColors,
  animated = false,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
}: GradientBackgroundProps) {
  const colors = customColors ?? [...gradients.primary];

  if (animated) {
    return (
      <MotiView
        style={[StyleSheet.absoluteFillObject, style]}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
        }}
      >
        <LinearGradient colors={colors} start={start} end={end} style={styles.gradient}>
          {children}
        </LinearGradient>
      </MotiView>
    );
  }

  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

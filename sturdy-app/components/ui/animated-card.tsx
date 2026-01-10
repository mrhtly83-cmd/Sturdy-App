import { ComponentProps, PropsWithChildren } from 'react';
import { StyleProp, ViewStyle, StyleSheet, View, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { ThemedView, ThemedViewProps } from '@/components/themed-view';
import { BlurView } from '@/components/ui/BlurView';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors, spacing, radius } from '@/lib/theme';

interface AnimatedCardProps extends PropsWithChildren {
  delay?: number;
  pressable?: boolean;
  onPress?: () => void;
  gradientBorder?: boolean;
  useBlur?: boolean;
  variant?: ThemedViewProps['variant'];
  radiusSize?: ThemedViewProps['radius'];
  shadow?: ThemedViewProps['shadow'];
  style?: StyleProp<ViewStyle>;
}

/**
 * AnimatedCard - Card component with glassmorphism effect and animations
 * 
 * Features:
 * - Fade-in and slide-up animation on mount
 * - Optional scale animation on press
 * - Optional gradient border effect
 * - Optional glassmorphism blur effect
 * 
 * @param children - Card content
 * @param delay - Delay before animation starts in milliseconds (default: 0)
 * @param pressable - Enable press interactions (default: false)
 * @param onPress - Press handler (only works if pressable is true)
 * @param gradientBorder - Show gradient border effect (default: false)
 * @param useBlur - Use blur effect for glassmorphism (default: false)
 * @param variant - ThemedView variant (default: 'card')
 * @param radiusSize - Border radius size (default: 'lg')
 * @param shadow - Shadow type (default: 'soft')
 * @param style - Additional styles
 */
export function AnimatedCard({
  children,
  delay = 0,
  pressable = false,
  onPress,
  gradientBorder = false,
  useBlur = false,
  variant = 'card',
  radiusSize = 'lg',
  shadow = 'soft',
  style,
}: AnimatedCardProps) {
  const theme = useColorScheme() ?? 'light';

  const handlePress = () => {
    if (pressable && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const cardContent = (
    <ThemedView
      variant={variant}
      radius={radiusSize}
      shadow={shadow}
      style={[styles.cardContent, style]}
    >
      {children}
    </ThemedView>
  );

  const animatedCard = (
    <MotiView
      from={{ opacity: 0, translateY: 14, scale: pressable ? 1 : undefined }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        delay,
        type: 'timing',
        duration: 400,
      }}
    >
      {gradientBorder ? (
        <View style={styles.gradientBorderContainer}>
          <LinearGradient
            colors={[colors.primary[400], colors.secondary[400], colors.accent[400]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View
              style={[
                styles.gradientInner,
                {
                  backgroundColor: theme === 'dark' ? colors.gray[900] : colors.gray[50],
                },
              ]}
            >
              {useBlur ? (
                <BlurView intensity="light" tint={theme} style={styles.blurContent}>
                  {children}
                </BlurView>
              ) : (
                children
              )}
            </View>
          </LinearGradient>
        </View>
      ) : useBlur ? (
        <BlurView intensity="light" tint={theme} style={[styles.blurContainer, style]}>
          {children}
        </BlurView>
      ) : (
        cardContent
      )}
    </MotiView>
  );

  if (pressable) {
    return (
      <Pressable onPress={handlePress}>
        <MotiView
          from={{ opacity: 0, translateY: 14, scale: 1 }}
          animate={({ hovered, pressed }: any) => ({
            opacity: 1,
            translateY: 0,
            scale: pressed ? 0.98 : 1,
          })}
          transition={{
            delay,
            type: 'timing',
            duration: 400,
          }}
        >
          {animatedCard}
        </MotiView>
      </Pressable>
    );
  }

  return animatedCard;
}

const styles = StyleSheet.create({
  cardContent: {
    overflow: 'hidden',
  },
  gradientBorderContainer: {
    borderRadius: radius.lg,
    padding: 2,
  },
  gradientBorder: {
    borderRadius: radius.lg,
  },
  gradientInner: {
    borderRadius: radius.lg - 2,
    padding: spacing.md,
  },
  blurContainer: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    padding: spacing.md,
  },
  blurContent: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});

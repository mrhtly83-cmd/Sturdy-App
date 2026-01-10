import { LinearGradient } from 'expo-linear-gradient';
import { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { Colors, Gradients, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors, spacing, radius, typography } from '@/lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface AnimatedButtonProps {
  children?: ReactNode;
  label?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SIZE_STYLES = {
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.sm,
    borderRadius: radius.md,
  },
  md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.base,
    borderRadius: radius.lg,
  },
  lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    fontSize: typography.fontSize.lg,
    borderRadius: radius.xl,
  },
};

/**
 * AnimatedButton - Pressable button with scale animation, gradient backgrounds, and haptic feedback
 * 
 * @param children - Custom child content (overrides label)
 * @param label - Button text label
 * @param onPress - Press handler
 * @param variant - Button style variant: primary, secondary, outline, ghost (default: primary)
 * @param size - Button size: sm, md, lg (default: md)
 * @param leftIcon - Icon to display on the left
 * @param rightIcon - Icon to display on the right
 * @param loading - Show loading spinner
 * @param disabled - Disable button interactions
 * @param style - Additional styles
 */
export function AnimatedButton({
  children,
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  style,
}: AnimatedButtonProps) {
  const theme = useColorScheme() ?? 'light';
  const sizeStyle = SIZE_STYLES[size];

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.();
    }
  };

  const getTextColor = () => {
    if (variant === 'primary' || variant === 'secondary') return '#FFFFFF';
    if (variant === 'outline') return theme === 'dark' ? colors.primary[400] : colors.primary[600];
    return Colors[theme].text;
  };

  const renderContent = () => {
    const textColor = getTextColor();
    const content = children ?? label;

    return (
      <View style={styles.contentContainer}>
        {leftIcon}
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : typeof content === 'string' ? (
          <ThemedText
            type="bodyStrong"
            style={[styles.text, { color: textColor, fontSize: sizeStyle.fontSize }]}
          >
            {content}
          </ThemedText>
        ) : (
          content
        )}
        {rightIcon}
      </View>
    );
  };

  const renderButton = () => {
    const containerStyle = [
      styles.container,
      {
        borderRadius: sizeStyle.borderRadius,
        opacity: disabled ? 0.5 : 1,
      },
    ];

    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            containerStyle,
            {
              paddingVertical: sizeStyle.paddingVertical,
              paddingHorizontal: sizeStyle.paddingHorizontal,
            },
          ]}
        >
          {renderContent()}
        </LinearGradient>
      );
    }

    if (variant === 'secondary') {
      return (
        <LinearGradient
          colors={[colors.secondary[400], colors.secondary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            containerStyle,
            {
              paddingVertical: sizeStyle.paddingVertical,
              paddingHorizontal: sizeStyle.paddingHorizontal,
            },
          ]}
        >
          {renderContent()}
        </LinearGradient>
      );
    }

    if (variant === 'outline') {
      return (
        <View
          style={[
            containerStyle,
            {
              paddingVertical: sizeStyle.paddingVertical,
              paddingHorizontal: sizeStyle.paddingHorizontal,
              borderWidth: 2,
              borderColor: theme === 'dark' ? colors.primary[400] : colors.primary[600],
              backgroundColor: 'transparent',
            },
          ]}
        >
          {renderContent()}
        </View>
      );
    }

    // ghost variant
    return (
      <View
        style={[
          containerStyle,
          {
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
            backgroundColor: 'transparent',
          },
        ]}
      >
        {renderContent()}
      </View>
    );
  };

  return (
    <MotiPressable
      style={[styles.wrapper, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      animate={({ pressed }) => ({
        scale: pressed ? 0.97 : 1,
        opacity: pressed ? 0.9 : 1,
      })}
      transition={{
        type: 'timing',
        duration: 150,
      }}
    >
      {renderButton()}
    </MotiPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  container: {
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  text: {
    textAlign: 'center',
    fontWeight: typography.fontWeight.bold,
  },
});

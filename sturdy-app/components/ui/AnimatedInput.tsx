import { useState, useRef, useEffect, ReactNode } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors, spacing, radius, typography } from '@/lib/theme';

interface AnimatedInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
}

export function AnimatedInput({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  value,
  onFocus,
  onBlur,
  ...textInputProps
}: AnimatedInputProps) {
  const theme = useColorScheme() ?? 'light';
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Animated values
  const labelPosition = useSharedValue(value ? 1 : 0);
  const borderColor = useSharedValue(0);
  const shakeTranslate = useSharedValue(0);

  // Update label position when value changes
  useEffect(() => {
    if (value || isFocused) {
      labelPosition.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
    } else {
      labelPosition.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) });
    }
  }, [value, isFocused, labelPosition]);

  // Shake animation for errors
  useEffect(() => {
    if (error) {
      shakeTranslate.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [error, shakeTranslate]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  const handleLabelPress = () => {
    inputRef.current?.focus();
  };

  // Animated styles
  const animatedLabelStyle = useAnimatedStyle(() => {
    const isDark = theme === 'dark';
    return {
      top: labelPosition.value === 1 ? -10 : 16,
      fontSize: labelPosition.value === 1 ? typography.fontSize.xs : typography.fontSize.base,
      color: error
        ? colors.error
        : borderColor.value === 1
        ? isDark
          ? colors.secondary[400]
          : colors.secondary[600]
        : isDark
        ? colors.gray[400]
        : colors.gray[600],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const isDark = theme === 'dark';
    return {
      borderColor: error
        ? colors.error
        : borderColor.value === 1
        ? isDark
          ? colors.secondary[400]
          : colors.secondary[600]
        : isDark
        ? colors.gray[700]
        : colors.gray[300],
      transform: [{ translateX: shakeTranslate.value }],
    };
  });

  const textColor = theme === 'dark' ? colors.gray[50] : colors.gray[900];
  const placeholderColor = theme === 'dark' ? colors.gray[500] : colors.gray[400];

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <View style={styles.inputWrapper}>
          <Pressable onPress={handleLabelPress} style={StyleSheet.absoluteFill}>
            <Animated.Text style={[styles.label, animatedLabelStyle]}>{label}</Animated.Text>
          </Pressable>

          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              { color: textColor },
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
            ]}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={placeholderColor}
            {...textInputProps}
          />
        </View>

        {rightIcon && (
          <Pressable
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </Pressable>
        )}
      </Animated.View>

      {error && (
        <ThemedText style={styles.errorText} type="footnote">
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: radius.lg,
    backgroundColor: 'transparent',
    minHeight: 56,
  },
  leftIconContainer: {
    paddingLeft: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  label: {
    position: 'absolute',
    left: spacing.md,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  input: {
    fontSize: typography.fontSize.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    minHeight: 24,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { MotiPressable } from 'moti/interactions';

import { ThemedText } from '@/components/themed-text';
import { Colors, Gradients, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AnimatedButtonProps {
  label: string;
  onPress?: ComponentProps<typeof MotiPressable>['onPress'];
  variant?: 'primary' | 'ghost';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedButton({
  label,
  onPress,
  variant = 'primary',
  leftIcon,
  rightIcon,
  loading = false,
  style,
}: AnimatedButtonProps) {
  const theme = useColorScheme() ?? 'light';
  const isGhost = variant === 'ghost';

  return (
    <MotiPressable
      style={[
        {
          borderRadius: Radii.lg,
          overflow: 'hidden',
          borderWidth: isGhost ? 1 : 0,
          borderColor: isGhost ? Colors[theme].border : undefined,
        },
        style,
      ]}
      onPress={onPress}
      animate={({ pressed }) => {
        return {
          scale: pressed ? 0.97 : 1,
          opacity: pressed ? 0.9 : 1,
        };
      }}
    >
      {isGhost ? (
        <ThemedText
          type="callout"
          style={{
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xl,
            textAlign: 'center',
            color: Colors[theme].text,
          }}
        >
          {label}
        </ThemedText>
      ) : (
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.sm,
          }}
        >
          {leftIcon}
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="bodyStrong" style={{ color: '#fff' }}>
              {label}
            </ThemedText>
          )}
          {rightIcon}
        </LinearGradient>
      )}
    </MotiPressable>
  );
}

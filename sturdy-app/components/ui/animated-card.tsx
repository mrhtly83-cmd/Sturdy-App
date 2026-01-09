import { ComponentProps, PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { MotiView } from 'moti';

import { ThemedView, ThemedViewProps } from '@/components/themed-view';

interface AnimatedCardProps extends PropsWithChildren, ThemedViewProps {
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedCard({ children, delay = 0, style, ...rest }: AnimatedCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay, damping: 16, mass: 0.9 }}
    >
      <ThemedView
        variant={rest.variant ?? 'card'}
        radius={rest.radius ?? 'lg'}
        shadow={rest.shadow ?? 'soft'}
        style={style}
        {...rest}
      >
        {children}
      </ThemedView>
    </MotiView>
  );
}

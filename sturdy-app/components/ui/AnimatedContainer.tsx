import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

export type AnimationType =
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'none';

interface AnimatedContainerProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

const ANIMATION_CONFIGS = {
  fadeIn: {
    from: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    from: { opacity: 0, translateY: 50 },
    animate: { opacity: 1, translateY: 0 },
  },
  slideDown: {
    from: { opacity: 0, translateY: -50 },
    animate: { opacity: 1, translateY: 0 },
  },
  slideLeft: {
    from: { opacity: 0, translateX: 50 },
    animate: { opacity: 1, translateX: 0 },
  },
  slideRight: {
    from: { opacity: 0, translateX: -50 },
    animate: { opacity: 1, translateX: 0 },
  },
  scale: {
    from: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  none: {
    from: {},
    animate: {},
  },
};

/**
 * AnimatedContainer - Wrapper component with preset animations
 * 
 * @param animation - Type of animation: fadeIn, slideUp, slideDown, slideLeft, slideRight, scale, none
 * @param delay - Delay before animation starts in milliseconds (default: 0)
 * @param duration - Animation duration in milliseconds (default: 300)
 * @param children - Child components to animate
 * @param style - Additional styles
 */
export function AnimatedContainer({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 300,
  style,
}: AnimatedContainerProps) {
  const config = ANIMATION_CONFIGS[animation];

  return (
    <MotiView
      from={config.from}
      animate={config.animate}
      transition={{
        type: 'timing',
        duration,
        delay,
        easing: Easing.out(Easing.ease),
      }}
      style={style}
    >
      {children}
    </MotiView>
  );
}

import { View, type ViewProps } from 'react-native';

import { Colors, Radii, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'plain' | 'surface' | 'card' | 'muted' | 'glass';
  radius?: keyof typeof Radii;
  shadow?: 'none' | 'soft' | 'medium';
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'plain',
  radius,
  shadow = 'none',
  ...otherProps
}: ThemedViewProps) {
  const theme = useColorScheme() ?? 'light';
  const fallbackBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const backgroundColorByVariant = {
    plain: fallbackBackground,
    surface: Colors[theme].surface,
    card: Colors[theme].card,
    muted: Colors[theme].elevated,
    glass: Colors[theme].glass,
  } satisfies Record<NonNullable<ThemedViewProps['variant']>, string>;

  const shadowStyle = shadow === 'soft' ? Shadows.soft : shadow === 'medium' ? Shadows.medium : undefined;

  return (
    <View
      style={[
        {
          backgroundColor: backgroundColorByVariant[variant],
          borderRadius: radius ? Radii[radius] : undefined,
          borderWidth: variant === 'card' || variant === 'glass' ? 1 : undefined,
          borderColor: variant === 'card' || variant === 'glass' ? Colors[theme].border : undefined,
        },
        shadowStyle,
        style,
      ]}
      {...otherProps}
    />
  );
}

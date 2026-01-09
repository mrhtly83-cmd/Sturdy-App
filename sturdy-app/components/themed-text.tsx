import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'display'
    | 'title'
    | 'headline'
    | 'body'
    | 'bodyStrong'
    | 'callout'
    | 'caption'
    | 'footnote'
    | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body',
  ...rest
}: ThemedTextProps) {
  const theme = useColorScheme() ?? 'light';
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'display' ? styles.display : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'headline' ? styles.headline : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'bodyStrong' ? styles.bodyStrong : undefined,
        type === 'callout' ? styles.callout : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'footnote' ? styles.footnote : undefined,
        type === 'link' ? [styles.link, { color: Colors[theme].tint }] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: Typography.display,
  title: Typography.title,
  headline: Typography.headline,
  body: Typography.body,
  bodyStrong: Typography.bodyStrong,
  callout: Typography.callout,
  caption: Typography.caption,
  footnote: Typography.footnote,
  link: {
    ...Typography.callout,
    textDecorationLine: 'none',
  },
});

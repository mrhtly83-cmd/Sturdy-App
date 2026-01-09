import { PixelRatio, useWindowDimensions } from 'react-native';

import { Spacing } from '@/constants/theme';

const BASE_WIDTH = 390; // iPhone 14 reference

export function responsiveSize(size: number, screenWidth: number) {
  return Math.round((size * screenWidth) / BASE_WIDTH);
}

export function responsiveSpacing(multiplier = 1, screenWidth?: number) {
  const width = screenWidth ?? useWindowDimensions().width;
  return responsiveSize(Spacing.md * multiplier, width);
}

export function responsiveFont(size: number, screenWidth?: number) {
  const width = screenWidth ?? useWindowDimensions().width;
  const scaled = responsiveSize(size, width);
  return PixelRatio.roundToNearestPixel(scaled);
}

export function useResponsiveValue<T>(values: { small: T; medium: T; large: T }) {
  const { width } = useWindowDimensions();
  if (width < 375) return values.small;
  if (width < 768) return values.medium;
  return values.large;
}

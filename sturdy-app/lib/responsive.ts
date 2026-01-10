import { Dimensions, Platform } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
export const isLargeDevice = SCREEN_WIDTH >= 768;

/**
 * Selects a value based on screen size
 * @param small - Value for small devices (< 375px)
 * @param medium - Value for medium devices (375-768px)
 * @param large - Value for large devices (>= 768px)
 */
export const responsive = <T>(small: T, medium: T, large: T): T => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

/**
 * Scale a size horizontally based on screen width
 * @param size - The base size to scale
 */
export const horizontalScale = (size: number): number => (SCREEN_WIDTH / 375) * size;

/**
 * Scale a size vertically based on screen height
 * @param size - The base size to scale
 */
export const verticalScale = (size: number): number => (SCREEN_HEIGHT / 812) * size;

/**
 * Scale a size with a moderation factor
 * @param size - The base size to scale
 * @param factor - Moderation factor (default: 0.5)
 */
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

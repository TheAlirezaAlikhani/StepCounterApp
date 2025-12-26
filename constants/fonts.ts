/**
 * Font family constants for the Estedad font
 * Use these with StyleSheet when you can't use Tailwind classes
 */
export const Fonts = {
  black: 'Estedad-Black',
  extraBold: 'Estedad-ExtraBold',
  bold: 'Estedad-Bold',
  semiBold: 'Estedad-SemiBold',
  medium: 'Estedad-Medium',
  regular: 'Estedad-Regular',
  light: 'Estedad-Light',
  extraLight: 'Estedad-ExtraLight',
} as const;

export type FontWeight = keyof typeof Fonts;

/**
 * Helper function to get font family by weight
 * @param weight - The font weight key
 * @returns The font family string
 */
export function getFontFamily(weight: FontWeight = 'regular'): string {
  return Fonts[weight];
}


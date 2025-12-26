import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Fonts } from '../../constants/fonts';

interface TextProps extends RNTextProps {
  /**
   * Font weight variant
   * @default 'regular'
   */
  weight?: 'black' | 'extraBold' | 'bold' | 'semiBold' | 'medium' | 'regular' | 'light' | 'extraLight';
}

/**
 * Custom Text component with Estedad font applied by default
 * Use this instead of React Native's Text component for consistent typography
 */
export function Text({ style, weight = 'regular', children, ...props }: TextProps) {
  return (
    <RNText 
      style={[{ fontFamily: Fonts[weight] }, style]} 
      {...props}
    >
      {children}
    </RNText>
  );
}

// Pre-styled variants for common use cases
export function TextBold(props: Omit<TextProps, 'weight'>) {
  return <Text weight="bold" {...props} />;
}

export function TextSemiBold(props: Omit<TextProps, 'weight'>) {
  return <Text weight="semiBold" {...props} />;
}

export function TextMedium(props: Omit<TextProps, 'weight'>) {
  return <Text weight="medium" {...props} />;
}

export function TextLight(props: Omit<TextProps, 'weight'>) {
  return <Text weight="light" {...props} />;
}


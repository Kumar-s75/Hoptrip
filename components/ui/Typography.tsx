import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'error' | 'success';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
}

export function Typography({
  variant = 'body1',
  color = 'primary',
  weight = 'regular',
  align = 'left',
  style,
  ...props
}: TypographyProps) {
  const textStyle = [
    styles.base,
    styles[variant],
    styles[color],
    styles[weight],
    styles[align],
    style,
  ];

  return <Text style={textStyle} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  // Variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  // Colors
  primary: {
    color: '#111827',
  },
  secondary: {
    color: '#6B7280',
  },
  accent: {
    color: '#4B61D1',
  },
  muted: {
    color: '#9CA3AF',
  },
  error: {
    color: '#EF4444',
  },
  success: {
    color: '#10B981',
  },
  // Weights
  light: {
    fontWeight: '300',
  },
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  // Alignment
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});
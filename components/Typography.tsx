import { theme } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

// Define typography variants
type TypographyVariant = 
  | 'display1' 
  | 'display2' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'subtitle1' 
  | 'subtitle2' 
  | 'body1' 
  | 'body2' 
  | 'caption' 
  | 'overline' 
  | 'button';

type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  italic?: boolean;
  underline?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  style?: TextStyle;
};

export function Typography({
  variant = 'body1',
  color = 'neutral.charcoal',
  align = 'left',
  weight,
  italic = false,
  underline = false,
  lineHeight,
  letterSpacing,
  uppercase = false,
  lowercase = false,
  capitalize = false,
  style,
  children,
  ...rest
}: TypographyProps) {
  const { getThemedColor } = useTheme();
  
  // Get base style for the variant
  const variantStyle = getVariantStyle(variant);
  
  // Get font family based on weight
  const fontFamily = getFontFamily(weight || variantStyle.fontWeight);
  
  // Text transformation
  let textTransform;
  if (uppercase) textTransform = 'uppercase';
  else if (lowercase) textTransform = 'lowercase';
  else if (capitalize) textTransform = 'capitalize';
  
  // Combine all styles
  const textStyle: TextStyle = {
    ...variantStyle,
    color: getThemedColor(color),
    textAlign: align,
    fontFamily,
    fontStyle: italic ? 'italic' : 'normal',
    textDecorationLine: underline ? 'underline' : 'none',
    ...(lineHeight && { lineHeight }),
    ...(letterSpacing && { letterSpacing }),
    ...(textTransform && { textTransform }),
  };
  
  return (
    <Text style={[textStyle, style]} {...rest}>
      {children}
    </Text>
  );
}

// Helper function to get style for a variant
function getVariantStyle(variant: TypographyVariant): TextStyle {
  switch (variant) {
    case 'display1':
      return {
        fontSize: 48,
        lineHeight: 56,
        fontWeight: '800',
        letterSpacing: -0.5,
      };
    case 'display2':
      return {
        fontSize: 40,
        lineHeight: 48,
        fontWeight: '700',
        letterSpacing: -0.5,
      };
    case 'h1':
      return {
        fontSize: theme.typography.sizes.h1.fontSize,
        lineHeight: theme.typography.sizes.h1.lineHeight,
        fontWeight: '700',
        letterSpacing: theme.typography.sizes.h1.letterSpacing,
      };
    case 'h2':
      return {
        fontSize: theme.typography.sizes.h2.fontSize,
        lineHeight: theme.typography.sizes.h2.lineHeight,
        fontWeight: '700',
        letterSpacing: theme.typography.sizes.h2.letterSpacing,
      };
    case 'h3':
      return {
        fontSize: theme.typography.sizes.h3.fontSize,
        lineHeight: theme.typography.sizes.h3.lineHeight,
        fontWeight: '600',
        letterSpacing: theme.typography.sizes.h3.letterSpacing,
      };
    case 'h4':
      return {
        fontSize: theme.typography.sizes.h4.fontSize,
        lineHeight: theme.typography.sizes.h4.lineHeight,
        fontWeight: '600',
        letterSpacing: theme.typography.sizes.h4.letterSpacing,
      };
    case 'h5':
      return {
        fontSize: theme.typography.sizes.h5.fontSize,
        lineHeight: theme.typography.sizes.h5.lineHeight,
        fontWeight: '600',
        letterSpacing: theme.typography.sizes.h5.letterSpacing,
      };
    case 'h6':
      return {
        fontSize: theme.typography.sizes.h6.fontSize,
        lineHeight: theme.typography.sizes.h6.lineHeight,
        fontWeight: '600',
        letterSpacing: theme.typography.sizes.h6.letterSpacing,
      };
    case 'subtitle1':
      return {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '500',
        letterSpacing: 0.15,
      };
    case 'subtitle2':
      return {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
        letterSpacing: 0.1,
      };
    case 'body1':
      return {
        fontSize: theme.typography.sizes.body1.fontSize,
        lineHeight: theme.typography.sizes.body1.lineHeight,
        fontWeight: '400',
        letterSpacing: theme.typography.sizes.body1.letterSpacing,
      };
    case 'body2':
      return {
        fontSize: theme.typography.sizes.body2.fontSize,
        lineHeight: theme.typography.sizes.body2.lineHeight,
        fontWeight: '400',
        letterSpacing: theme.typography.sizes.body2.letterSpacing,
      };
    case 'caption':
      return {
        fontSize: theme.typography.sizes.caption.fontSize,
        lineHeight: theme.typography.sizes.caption.lineHeight,
        fontWeight: '400',
        letterSpacing: theme.typography.sizes.caption.letterSpacing,
      };
    case 'overline':
      return {
        fontSize: theme.typography.sizes.overline.fontSize,
        lineHeight: theme.typography.sizes.overline.lineHeight,
        fontWeight: '500',
        letterSpacing: theme.typography.sizes.overline.letterSpacing,
        textTransform: 'uppercase',
      };
    case 'button':
      return {
        fontSize: theme.typography.sizes.button.fontSize,
        lineHeight: theme.typography.sizes.button.lineHeight,
        fontWeight: '600',
        letterSpacing: theme.typography.sizes.button.letterSpacing,
      };
    default:
      return {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
      };
  }
}

// Helper function to get font family based on weight
function getFontFamily(weight: TextStyle['fontWeight']): string {
  switch (weight) {
    case '900':
    case '800':
      return 'Satoshi-Black';
    case '700':
      return 'Satoshi-Bold';
    case '600':
      return 'Satoshi-SemiBold';
    case '500':
      return 'Satoshi-Medium';
    case '400':
    case '300':
    case '200':
    case '100':
    case 'normal':
    default:
      return 'Satoshi-Regular';
  }
}

// Predefined typography components for common use cases
export const Display1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="display1" {...props} />
);

export const Display2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="display2" {...props} />
);

export const H1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" {...props} />
);

export const H2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" {...props} />
);

export const H3 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" {...props} />
);

export const H4 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h4" {...props} />
);

export const H5 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h5" {...props} />
);

export const H6 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h6" {...props} />
);

export const Subtitle1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="subtitle1" {...props} />
);

export const Subtitle2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="subtitle2" {...props} />
);

export const Body1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body1" {...props} />
);

export const Body2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body2" {...props} />
);

export const Caption = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" {...props} />
);

export const Overline = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="overline" {...props} />
);

export const ButtonText = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="button" {...props} />
);

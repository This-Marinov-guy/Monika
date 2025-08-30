import { getTypography } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';
import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'caption' | 'overline' | 'button' | 'title' | 'subtitle';
  color?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body1',
  color,
  ...rest
}: ThemedTextProps) {
  const { getThemedColor } = useTheme();
  
  // Map legacy types to new design system types
  const mappedType = mapLegacyTypeToDesignSystem(type);
  
  // Get typography styles from design system
  const typographyStyle = getTypography(`sizes.${mappedType}`);
  
  // Get color from props or default
  const textColor = color 
    ? getThemedColor(color) 
    : getThemedColor(lightColor || darkColor || 'neutral.charcoal');

  // Get the appropriate font family based on weight
  const fontFamily = getFontFamily(typographyStyle.fontWeight);

  return (
    <Text
      style={[
        { color: textColor },
        typographyStyle,
        { fontFamily },
        style,
      ]}
      {...rest}
    />
  );
}

// Helper function to map legacy types to design system types
function mapLegacyTypeToDesignSystem(type: ThemedTextProps['type']): string {
  switch (type) {
    case 'title':
      return 'h2';
    case 'subtitle':
      return 'h5';
    default:
      return type;
  }
}

// Helper function to get the appropriate font family based on weight
function getFontFamily(fontWeight: string | number): string {
  if (typeof fontWeight === 'string') {
    switch (fontWeight) {
      case 'bold':
      case '700':
        return 'Satoshi-Bold';
      case '800':
      case '900':
        return 'Satoshi-Black';
      case '600':
        return 'Satoshi-SemiBold';
      case '500':
        return 'Satoshi-Medium';
      default:
        return 'Satoshi-Regular';
    }
  } else {
    // Numeric font weights
    if (fontWeight >= 800) {
      return 'Satoshi-Black';
    } else if (fontWeight >= 700) {
      return 'Satoshi-Bold';
    } else if (fontWeight >= 600) {
      return 'Satoshi-SemiBold';
    } else if (fontWeight >= 500) {
      return 'Satoshi-Medium';
    } else {
      return 'Satoshi-Regular';
    }
  }
}
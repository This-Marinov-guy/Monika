import { getTypography } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';
import { Text, type TextProps, type TextStyle } from 'react-native';

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
      return type || 'body1';
  }
}

// Helper function to get font family based on weight
function getFontFamily(weight: TextStyle['fontWeight']): string {
  // Use Satoshi font family
  switch (weight) {
    case '900':
    case '800':
      return 'Satoshi-Black';
    case '700':
      return 'Satoshi-Bold';
    case '600':
    case '500':
      return 'Satoshi-Medium';
    case '300':
    case '200':
    case '100':
      return 'Satoshi-Light';
    case '400':
    case 'normal':
    default:
      return 'Satoshi-Regular';
  }
}
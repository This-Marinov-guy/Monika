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
      return type;
  }
}

// Helper function to get font family based on weight
function getFontFamily(weight: TextStyle['fontWeight']): string {
  // Use system fonts since we're not loading Satoshi
  switch (weight) {
    case '900':
    case '800':
      return 'System';
    case '700':
      return 'System';
    case '600':
      return 'System';
    case '500':
      return 'System';
    case '400':
    case '300':
    case '200':
    case '100':
    case 'normal':
    default:
      return 'System';
  }
}
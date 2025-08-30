import { useTheme } from '@/context/ThemeContext';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  backgroundColor?: string;
  variant?: 'default' | 'card' | 'cardElevated' | 'cardOutlined' | 'cardFlat';
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  backgroundColor,
  variant = 'default',
  ...otherProps 
}: ThemedViewProps) {
  const { getThemedColor } = useTheme();
  
  // Get background color based on variant or props
  const bgColor = getBackgroundColor(variant, backgroundColor, lightColor, darkColor, getThemedColor);
  
  // Get additional styles based on variant
  const variantStyles = getVariantStyles(variant, getThemedColor);

  return <View style={[{ backgroundColor: bgColor }, variantStyles, style]} {...otherProps} />;
}

// Helper function to get background color based on variant and props
function getBackgroundColor(
  variant: ThemedViewProps['variant'],
  backgroundColor?: string,
  lightColor?: string,
  darkColor?: string,
  getThemedColor?: (color: string) => string
): string {
  // If explicit backgroundColor is provided, use it
  if (backgroundColor && getThemedColor) {
    return getThemedColor(backgroundColor);
  }
  
  // If light/dark colors are provided, use them
  if ((lightColor || darkColor) && getThemedColor) {
    return getThemedColor(lightColor || darkColor || 'neutral.white');
  }
  
  // Otherwise, use variant-based background color
  if (getThemedColor) {
    switch (variant) {
      case 'card':
        return getThemedColor('neutral.white');
      case 'cardElevated':
        return getThemedColor('neutral.white');
      case 'cardOutlined':
        return getThemedColor('neutral.white');
      case 'cardFlat':
        return getThemedColor('neutral.offWhite');
      default:
        return getThemedColor('neutral.white');
    }
  }
  
  return '#FFFFFF'; // Fallback
}

// Helper function to get additional styles based on variant
function getVariantStyles(
  variant: ThemedViewProps['variant'],
  getThemedColor?: (color: string) => string
): object {
  if (!getThemedColor) return {};
  
  switch (variant) {
    case 'card':
      return {
        borderRadius: 12,
        padding: 16,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      };
    case 'cardElevated':
      return {
        borderRadius: 12,
        padding: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      };
    case 'cardOutlined':
      return {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: getThemedColor('neutral.lightGrey'),
      };
    case 'cardFlat':
      return {
        borderRadius: 12,
        padding: 16,
      };
    default:
      return {};
  }
}
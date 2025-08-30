import { theme } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

type CardVariant = 'default' | 'elevated' | 'gradient' | 'subtle' | 'profile';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: CardVariant;
  onPress?: () => void;
  gradientColors?: string[];
  gradientStart?: { x: number, y: number };
  gradientEnd?: { x: number, y: number };
  fullWidth?: boolean;
};

export function Card({ 
  children, 
  style, 
  variant = 'default',
  onPress,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 0, y: 1 },
  fullWidth = false
}: CardProps) {
  const { getThemedColor } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  
  // Define styles based on variant
  const getCardStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      overflow: 'hidden',
      width: fullWidth ? '100%' : undefined,
    };
    
    switch(variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: getThemedColor('neutral.white'),
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        };
      case 'gradient':
        return {
          ...baseStyle,
          // Gradient will be applied separately
        };
      case 'subtle':
        return {
          ...baseStyle,
          backgroundColor: getThemedColor('neutral.offWhite'),
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        };
      case 'profile':
        return {
          ...baseStyle,
          padding: 0,
          borderRadius: theme.borderRadius.lg,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 15,
          elevation: 10,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: getThemedColor('neutral.white'),
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        };
    }
  };
  
  // Get default gradient colors based on theme
  const defaultGradientColors = [
    getThemedColor('primary.dark'),
    getThemedColor('primary.base'),
    getThemedColor('secondary.base'),
  ];
  
  const cardStyle = getCardStyle();
  
  // Determine if we need to render a gradient background
  const renderWithGradient = variant === 'gradient';
  
  const content = (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
  
  // If it's a gradient card, wrap content in LinearGradient
  if (renderWithGradient) {
    return (
      <TouchableOpacity 
        activeOpacity={onPress ? 0.9 : 1}
        onPress={onPress}
        style={styles.touchable}
        disabled={!onPress}
      >
        <LinearGradient
          colors={gradientColors || defaultGradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={[cardStyle, style]}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  // If card is pressable, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={0.95}
        onPress={onPress}
        style={styles.touchable}
      >
        {content}
      </TouchableOpacity>
    );
  }
  
  // Otherwise just return the card
  return content;
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
});

import { getComponentStyle, theme } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'gradient' | 'action';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  gradientColors?: string[];
};

export function EnhancedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  fullWidth = false,
  gradientColors,
}: ButtonProps) {
  const { getThemedColor } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Get component styles from design system
  const buttonVariantStyle = getComponentStyle(`Button.variants.${variant === 'action' || variant === 'gradient' ? 'primary' : variant}`);
  const buttonSizeStyle = getComponentStyle(`Button.sizes.${size}`);
  
  // Get colors
  const backgroundColor = disabled
    ? getThemedColor(buttonVariantStyle.states?.disabled?.backgroundColor || 'neutral.grey')
    : getThemedColor(buttonVariantStyle.backgroundColor);
    
  const textColor = disabled
    ? getThemedColor(buttonVariantStyle.states?.disabled?.textColor || 'neutral.darkGrey')
    : getThemedColor(buttonVariantStyle.textColor);
  
  // Animation for press feedback
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  // Create styles
  const containerStyle = {
    backgroundColor: variant === 'gradient' ? 'transparent' : backgroundColor,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    height: buttonSizeStyle.height,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    opacity: disabled ? 0.7 : 1,
    width: fullWidth ? '100%' : undefined,
    ...style,
  };
  
  // Add border for outline variant
  if (variant === 'outline') {
    containerStyle.borderWidth = 1;
    containerStyle.borderColor = disabled
      ? getThemedColor(buttonVariantStyle.states?.disabled?.borderColor || 'neutral.grey')
      : getThemedColor(buttonVariantStyle.borderColor);
  }
  
  // Special styling for action buttons
  if (variant === 'action') {
    containerStyle.borderRadius = 100; // Fully rounded
    containerStyle.height = 56;
    containerStyle.width = 56;
    containerStyle.paddingHorizontal = 0;
    containerStyle.shadowOffset = { width: 0, height: 4 };
    containerStyle.shadowOpacity = 0.2;
    containerStyle.shadowRadius = 8;
    containerStyle.elevation = 6;
  }

  // Default gradient colors
  const defaultGradientColors = variant === 'action' 
    ? [getThemedColor('primary.dark'), getThemedColor('primary.base')] 
    : [getThemedColor('primary.dark'), getThemedColor('primary.base'), getThemedColor('secondary.base')];
  
  const buttonContent = (
    <>
      {leftIcon && !loading && <View style={styles.leftIcon}>{leftIcon}</View>}
      
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={[
            {
              color: textColor,
              fontSize: buttonSizeStyle.fontSize,
              fontFamily: 'System',
              textAlign: 'center',
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
      
      {rightIcon && !loading && <View style={styles.rightIcon}>{rightIcon}</View>}
    </>
  );

  // Render with gradient if gradient variant
  if (variant === 'gradient' || variant === 'action') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.baseButton, { width: containerStyle.width }]}
          onPress={onPress}
          disabled={disabled || loading}
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <LinearGradient
            colors={gradientColors || defaultGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[containerStyle, styles.gradientContainer]}
          >
            {buttonContent}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Regular button
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: containerStyle.width }}>
      <TouchableOpacity
        style={[containerStyle, styles.baseButton]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {buttonContent}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    overflow: 'hidden',
  },
  gradientContainer: {
    width: '100%',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

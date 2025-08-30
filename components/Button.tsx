import { getComponentStyle } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Button({
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
}: ButtonProps) {
  const { getThemedColor } = useTheme();
  
  // Get component styles from design system
  const buttonVariantStyle = getComponentStyle(`Button.variants.${variant}`);
  const buttonSizeStyle = getComponentStyle(`Button.sizes.${size}`);
  
  // Get colors
  const backgroundColor = disabled
    ? getThemedColor(buttonVariantStyle.states?.disabled?.backgroundColor || 'neutral.grey')
    : getThemedColor(buttonVariantStyle.backgroundColor);
    
  const textColor = disabled
    ? getThemedColor(buttonVariantStyle.states?.disabled?.textColor || 'neutral.darkGrey')
    : getThemedColor(buttonVariantStyle.textColor);
  
  // Create styles
  const containerStyle = {
    backgroundColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    height: buttonSizeStyle.height,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    opacity: disabled ? 0.7 : 1,
    ...style,
  };
  
  // Add border for outline variant
  if (variant === 'outline') {
    containerStyle.borderWidth = 1;
    containerStyle.borderColor = disabled
      ? getThemedColor(buttonVariantStyle.states?.disabled?.borderColor || 'neutral.grey')
      : getThemedColor(buttonVariantStyle.borderColor);
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {leftIcon && !loading && <View style={styles.leftIcon}>{leftIcon}</View>}
      
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={[
            {
              color: textColor,
              fontSize: buttonSizeStyle.fontSize,
              fontWeight: '600',
              textAlign: 'center',
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
      
      {rightIcon && !loading && <View style={styles.rightIcon}>{rightIcon}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
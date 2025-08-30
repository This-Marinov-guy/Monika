import { getComponentStyle } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Input({
  label,
  error,
  containerStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: InputProps) {
  const { getThemedColor } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Get component styles from design system
  const inputStyle = getComponentStyle('Input.default');
  
  // Determine border color based on state
  let borderColor = getThemedColor(inputStyle.borderColor);
  
  if (error) {
    borderColor = getThemedColor(inputStyle.states.error.borderColor);
  } else if (isFocused) {
    borderColor = getThemedColor(inputStyle.states.focused.borderColor);
  }
  
  // Determine background color
  const backgroundColor = rest.editable === false
    ? getThemedColor(inputStyle.states.disabled.backgroundColor)
    : getThemedColor(inputStyle.backgroundColor);
  
  // Determine text color
  const textColor = getThemedColor(inputStyle.textColor);
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText
          type="body2"
          style={[styles.label, labelStyle]}
          color="neutral.darkGrey"
        >
          {label}
        </ThemedText>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            {
              height: inputStyle.height,
              borderWidth: inputStyle.borderWidth,
              borderColor,
              borderRadius: inputStyle.borderRadius,
              paddingHorizontal: inputStyle.paddingHorizontal,
              backgroundColor,
              color: textColor,
              fontSize: inputStyle.fontSize,
              opacity: rest.editable === false ? 0.7 : 1,
              paddingLeft: leftIcon ? 40 : inputStyle.paddingHorizontal,
              paddingRight: rightIcon ? 40 : inputStyle.paddingHorizontal,
            },
            style,
          ]}
          placeholderTextColor={getThemedColor('neutral.darkGrey')}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus && rest.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur && rest.onBlur(e);
          }}
          {...rest}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {error && (
        <ThemedText
          type="caption"
          style={[styles.error, errorStyle]}
          color="error"
        >
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  error: {
    marginTop: 4,
  },
});

import { theme } from '@/constants/Theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type DefaultProfileImageProps = {
  size?: number;
  name?: string;
};

export function DefaultProfileImage({ size = 400, name = '' }: DefaultProfileImageProps) {
  // Get first letter of name, or use a default
  const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : 'P';
  
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size * 1.5,
          borderRadius: size * 0.05,
        },
      ]}
    >
      <View style={styles.circle}>
        <ThemedText
          style={[
            styles.initial,
            {
              fontSize: size * 0.3,
            },
          ]}
          color="neutral.white"
        >
          {initial}
        </ThemedText>
      </View>
      <ThemedText
        style={[
          styles.text,
          {
            fontSize: size * 0.06,
          },
        ]}
        color="neutral.darkGrey"
      >
        No Image Available
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: theme.colors.neutral.darkGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
  },
  initial: {
    fontWeight: '700',
  },
  text: {
    fontWeight: '500',
  },
});

export default DefaultProfileImage;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type AppIconProps = {
  size?: number;
};

export function AppIcon({ size = 100 }: AppIconProps) {
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size * 0.2, // 20% of size for rounded corners
      }
    ]}>
      <ThemedText 
        style={[
          styles.letter, 
          { 
            fontSize: size * 0.6, // 60% of size for the letter
            lineHeight: size * 0.8, // 80% of size for line height
          }
        ]}
        color="neutral.white"
      >
        M
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4BB675', // Primary base color
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontWeight: '800',
    textAlign: 'center',
  },
});

import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Default system fonts as fallbacks
          'System-Regular': require('expo-font/build/FontLoader').FontLoader.resolveAsync('System', 'normal'),
          'System-Medium': require('expo-font/build/FontLoader').FontLoader.resolveAsync('System', 'medium'),
          'System-Bold': require('expo-font/build/FontLoader').FontLoader.resolveAsync('System', 'bold'),
          
          // SpaceMono font
          'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          
          // Use system fonts as substitutes for Satoshi until we have the actual font files
          'Satoshi-Regular': require('expo-font/build/FontLoader').FontLoader.resolveAsync('System', 'normal'),
          'Satoshi-Medium': require('expo-font/build/FontLoader').FontLoader.resolveAsync('System', 'medium'),
          'Satoshi-SemiBold': require('expo-font/build/FontLoader').FontLoader.resolveAsync('System', 'semibold'),
          'Satoshi-Bold': require('expo-font/build/FontLoader').FontLoader.resolveAsync('System', 'bold'),
          'Satoshi-Black': require('expo-font/build/FontLoader').FontLoader.resolveAsync('System', 'bold'),
        });
        setFontsLoaded(true);
      } catch (e) {
        setError(e as Error);
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, error };
}

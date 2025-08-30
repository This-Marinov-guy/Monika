import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // SpaceMono font
          'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Font loading error:', e);
        // Even if fonts fail to load, we can continue with system fonts
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, error };
}

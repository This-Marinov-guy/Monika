import * as Font from "expo-font";
import { useEffect, useState } from "react";

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Bricolage fonts
          "BricolageGrotesque-Regular": require("../assets/fonts/Bricolage/BricolageGrotesque-Regular.ttf"),
          "BricolageGrotesque-Bold": require("../assets/fonts/Bricolage/BricolageGrotesque-Bold.ttf"),
          "BricolageGrotesque-Light": require("../assets/fonts/Bricolage/BricolageGrotesque-Light.ttf"),
          "BricolageGrotesque-Medium": require("../assets/fonts/Bricolage/BricolageGrotesque-Medium.ttf"),
          "BricolageGrotesque-Black": require("../assets/fonts/Bricolage/BricolageGrotesque-Black.ttf"),
          "BricolageGrotesque-Italic": require("../assets/fonts/Bricolage/BricolageGrotesque-Italic.ttf"),
          "BricolageGrotesque-BoldItalic": require("../assets/fonts/Bricolage/BricolageGrotesque-BoldItalic.ttf"),
          "BricolageGrotesque-LightItalic": require("../assets/fonts/Bricolage/BricolageGrotesque-LightItalic.ttf"),
          "BricolageGrotesque-MediumItalic": require("../assets/fonts/Bricolage/BricolageGrotesque-MediumItalic.ttf"),
          "BricolageGrotesque-BlackItalic": require("../assets/fonts/Bricolage/BricolageGrotesque-BlackItalic.ttf"),

          // Satoshi fonts
          "Satoshi-Regular": require("../assets/fonts/Satoshi/Satoshi-Regular.otf"),
          "Satoshi-Bold": require("../assets/fonts/Satoshi/Satoshi-Bold.otf"),
          "Satoshi-Light": require("../assets/fonts/Satoshi/Satoshi-Light.otf"),
          "Satoshi-Medium": require("../assets/fonts/Satoshi/Satoshi-Medium.otf"),
          "Satoshi-Black": require("../assets/fonts/Satoshi/Satoshi-Black.otf"),
          "Satoshi-Italic": require("../assets/fonts/Satoshi/Satoshi-Italic.otf"),
          "Satoshi-BoldItalic": require("../assets/fonts/Satoshi/Satoshi-BoldItalic.otf"),
          "Satoshi-LightItalic": require("../assets/fonts/Satoshi/Satoshi-LightItalic.otf"),
          "Satoshi-MediumItalic": require("../assets/fonts/Satoshi/Satoshi-MediumItalic.otf"),
          "Satoshi-BlackItalic": require("../assets/fonts/Satoshi/Satoshi-BlackItalic.otf"),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn("Font loading error:", e);
        // Even if fonts fail to load, we can continue with system fonts
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, error };
}

import designSystem from '../monika-mobile-design-system.json';

// Type definitions for the design system
export type ColorPalette = typeof designSystem.colorPalette;
export type Typography = typeof designSystem.typography;
export type Spacing = typeof designSystem.spacing;
export type BorderRadius = typeof designSystem.borderRadius;
export type Shadows = typeof designSystem.shadows;
export type Components = typeof designSystem.components;
export type Animations = typeof designSystem.animations;

// Export the design system
export const theme = {
  colors: designSystem.colorPalette,
  typography: designSystem.typography,
  spacing: designSystem.spacing,
  borderRadius: designSystem.borderRadius,
  shadows: designSystem.shadows,
  components: designSystem.components,
  animations: designSystem.animations,
};

// Helper function to get color value
export const getColor = (colorPath: string): string => {
  const parts = colorPath.split('.');
  let result: any = theme.colors;
  
  for (const part of parts) {
    if (result && result[part]) {
      result = result[part];
    } else {
      return colorPath; // Return the original value if path not found
    }
  }
  
  return typeof result === 'string' ? result : colorPath;
};

// Helper function to get spacing value
export const getSpacing = (spacingKey: keyof typeof theme.spacing): number => {
  return theme.spacing[spacingKey] || 0;
};

// Helper function to get border radius
export const getBorderRadius = (radiusKey: keyof typeof theme.borderRadius): number => {
  return theme.borderRadius[radiusKey] || 0;
};

// Helper function to get shadow style
export const getShadow = (shadowKey: keyof typeof theme.shadows) => {
  return theme.shadows[shadowKey] || {};
};

// Helper function to get typography style
export const getTypography = (typographyKey: string) => {
  const parts = typographyKey.split('.');
  if (parts.length !== 2) return {};
  
  const [category, style] = parts;
  if (theme.typography.sizes[style]) {
    return {
      fontSize: theme.typography.sizes[style].fontSize,
      lineHeight: theme.typography.sizes[style].lineHeight,
      letterSpacing: theme.typography.sizes[style].letterSpacing,
      fontWeight: theme.typography.weights[theme.typography.sizes[style].weight] || 'normal',
    };
  }
  
  return {};
};

// Helper function to get component style
export const getComponentStyle = (componentPath: string) => {
  const parts = componentPath.split('.');
  let result: any = theme.components;
  
  for (const part of parts) {
    if (result && result[part]) {
      result = result[part];
    } else {
      return {}; // Return empty object if path not found
    }
  }
  
  return result || {};
};

// Dark mode helpers
export const getDarkModeColor = (lightModeColor: string): string => {
  const mapping = designSystem.darkModeMapping.colors[lightModeColor];
  return mapping ? getColor(mapping) : getColor(lightModeColor);
};

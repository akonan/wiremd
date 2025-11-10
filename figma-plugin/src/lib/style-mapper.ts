/**
 * Style Mapping System
 * Maps wiremd themes to Figma visual styles
 */

export type Theme = 'sketch' | 'clean' | 'wireframe' | 'none';

export interface ColorStyle {
  r: number;
  g: number;
  b: number;
}

export interface ThemeStyles {
  // Colors
  background: ColorStyle;
  surface: ColorStyle;
  primary: ColorStyle;
  secondary: ColorStyle;
  danger: ColorStyle;
  text: ColorStyle;
  textSecondary: ColorStyle;
  border: ColorStyle;

  // Typography
  fontFamily: string;
  fontStyle: string;

  // Effects
  shadows: boolean;
  cornerRadius: number;
  borderWidth: number;

  // Spacing
  paddingSmall: number;
  paddingMedium: number;
  paddingLarge: number;
  spacing: number;
}

const SKETCH_THEME: ThemeStyles = {
  background: { r: 0.98, g: 0.98, b: 0.95 },
  surface: { r: 1, g: 1, b: 1 },
  primary: { r: 0.2, g: 0.5, b: 1 },
  secondary: { r: 0.9, g: 0.9, b: 0.9 },
  danger: { r: 0.9, g: 0.2, b: 0.2 },
  text: { r: 0.1, g: 0.1, b: 0.1 },
  textSecondary: { r: 0.5, g: 0.5, b: 0.5 },
  border: { r: 0.8, g: 0.8, b: 0.8 },

  fontFamily: 'Comic Sans MS',
  fontStyle: 'Regular',

  shadows: true,
  cornerRadius: 4,
  borderWidth: 2,

  paddingSmall: 8,
  paddingMedium: 16,
  paddingLarge: 24,
  spacing: 16,
};

const CLEAN_THEME: ThemeStyles = {
  background: { r: 1, g: 1, b: 1 },
  surface: { r: 0.98, g: 0.98, b: 0.98 },
  primary: { r: 0, g: 0.48, b: 1 },
  secondary: { r: 0.95, g: 0.95, b: 0.97 },
  danger: { r: 0.96, g: 0.26, b: 0.21 },
  text: { r: 0, g: 0, b: 0 },
  textSecondary: { r: 0.45, g: 0.45, b: 0.45 },
  border: { r: 0.9, g: 0.9, b: 0.9 },

  fontFamily: 'Inter',
  fontStyle: 'Regular',

  shadows: true,
  cornerRadius: 8,
  borderWidth: 1,

  paddingSmall: 12,
  paddingMedium: 20,
  paddingLarge: 32,
  spacing: 20,
};

const WIREFRAME_THEME: ThemeStyles = {
  background: { r: 1, g: 1, b: 1 },
  surface: { r: 0.97, g: 0.97, b: 0.97 },
  primary: { r: 0.2, g: 0.2, b: 0.2 },
  secondary: { r: 0.85, g: 0.85, b: 0.85 },
  danger: { r: 0.5, g: 0.5, b: 0.5 },
  text: { r: 0, g: 0, b: 0 },
  textSecondary: { r: 0.6, g: 0.6, b: 0.6 },
  border: { r: 0.6, g: 0.6, b: 0.6 },

  fontFamily: 'Helvetica Neue',
  fontStyle: 'Regular',

  shadows: false,
  cornerRadius: 0,
  borderWidth: 1,

  paddingSmall: 8,
  paddingMedium: 16,
  paddingLarge: 24,
  spacing: 16,
};

const NONE_THEME: ThemeStyles = {
  background: { r: 1, g: 1, b: 1 },
  surface: { r: 0.95, g: 0.95, b: 0.95 },
  primary: { r: 0, g: 0, b: 0 },
  secondary: { r: 0.85, g: 0.85, b: 0.85 },
  danger: { r: 0.5, g: 0.5, b: 0.5 },
  text: { r: 0, g: 0, b: 0 },
  textSecondary: { r: 0.5, g: 0.5, b: 0.5 },
  border: { r: 0.8, g: 0.8, b: 0.8 },

  fontFamily: 'Arial',
  fontStyle: 'Regular',

  shadows: false,
  cornerRadius: 0,
  borderWidth: 1,

  paddingSmall: 8,
  paddingMedium: 16,
  paddingLarge: 24,
  spacing: 16,
};

export function getThemeStyles(theme: Theme = 'sketch'): ThemeStyles {
  switch (theme) {
    case 'sketch':
      return SKETCH_THEME;
    case 'clean':
      return CLEAN_THEME;
    case 'wireframe':
      return WIREFRAME_THEME;
    case 'none':
      return NONE_THEME;
    default:
      return SKETCH_THEME;
  }
}

export function createSolidPaint(color: ColorStyle, opacity: number = 1): SolidPaint {
  return {
    type: 'SOLID',
    color,
    opacity,
  };
}

export function createDropShadow(theme: Theme): Effect | null {
  if (!getThemeStyles(theme).shadows) {
    return null;
  }

  return {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: 'NORMAL',
  };
}

export function getTextStyle(theme: Theme, fontSize: number = 16, bold: boolean = false): {
  fontFamily: string;
  fontStyle: string;
  fontSize: number;
} {
  const styles = getThemeStyles(theme);

  // Try to use available fonts, fallback to defaults
  let fontStyle = bold ? 'Bold' : styles.fontStyle;

  // For sketch theme, try Comic Sans MS, fallback to Chalkboard
  if (theme === 'sketch') {
    return {
      fontFamily: 'Chalkboard',
      fontStyle: bold ? 'Bold' : 'Regular',
      fontSize,
    };
  }

  // For clean theme, use Inter
  if (theme === 'clean') {
    return {
      fontFamily: 'Inter',
      fontStyle: bold ? 'Bold' : 'Regular',
      fontSize,
    };
  }

  // For wireframe and none, use Helvetica
  return {
    fontFamily: 'Helvetica Neue',
    fontStyle: bold ? 'Bold' : 'Regular',
    fontSize,
  };
}

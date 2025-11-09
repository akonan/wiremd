/**
 * Style Mapper Tests
 */

import { describe, it, expect } from 'vitest';
import {
  getThemeStyles,
  createSolidPaint,
  createDropShadow,
  getTextStyle,
  type Theme,
} from '../src/lib/style-mapper';

describe('getThemeStyles', () => {
  it('should return sketch theme styles', () => {
    const styles = getThemeStyles('sketch');
    expect(styles.fontFamily).toBe('Chalkboard');
    expect(styles.shadows).toBe(true);
    expect(styles.cornerRadius).toBe(4);
  });

  it('should return clean theme styles', () => {
    const styles = getThemeStyles('clean');
    expect(styles.fontFamily).toBe('Inter');
    expect(styles.shadows).toBe(true);
    expect(styles.cornerRadius).toBe(8);
  });

  it('should return wireframe theme styles', () => {
    const styles = getThemeStyles('wireframe');
    expect(styles.fontFamily).toBe('Helvetica Neue');
    expect(styles.shadows).toBe(false);
    expect(styles.cornerRadius).toBe(0);
  });

  it('should return none theme styles', () => {
    const styles = getThemeStyles('none');
    expect(styles.fontFamily).toBe('Arial');
    expect(styles.shadows).toBe(false);
    expect(styles.cornerRadius).toBe(0);
  });

  it('should default to sketch theme for invalid input', () => {
    const styles = getThemeStyles('invalid' as Theme);
    expect(styles.fontFamily).toBe('Chalkboard');
  });

  it('should have consistent color structure', () => {
    const themes: Theme[] = ['sketch', 'clean', 'wireframe', 'none'];

    themes.forEach((theme) => {
      const styles = getThemeStyles(theme);

      // Check all required color properties exist
      expect(styles.background).toBeDefined();
      expect(styles.surface).toBeDefined();
      expect(styles.primary).toBeDefined();
      expect(styles.secondary).toBeDefined();
      expect(styles.danger).toBeDefined();
      expect(styles.text).toBeDefined();
      expect(styles.textSecondary).toBeDefined();
      expect(styles.border).toBeDefined();

      // Check color values are in valid range
      Object.values([
        styles.background,
        styles.surface,
        styles.primary,
        styles.text,
      ]).forEach((color) => {
        expect(color.r).toBeGreaterThanOrEqual(0);
        expect(color.r).toBeLessThanOrEqual(1);
        expect(color.g).toBeGreaterThanOrEqual(0);
        expect(color.g).toBeLessThanOrEqual(1);
        expect(color.b).toBeGreaterThanOrEqual(0);
        expect(color.b).toBeLessThanOrEqual(1);
      });
    });
  });

  it('should have consistent spacing values', () => {
    const styles = getThemeStyles('sketch');

    expect(styles.paddingSmall).toBeLessThan(styles.paddingMedium);
    expect(styles.paddingMedium).toBeLessThan(styles.paddingLarge);
    expect(styles.spacing).toBeGreaterThan(0);
  });
});

describe('createSolidPaint', () => {
  it('should create solid paint with default opacity', () => {
    const paint = createSolidPaint({ r: 1, g: 0.5, b: 0 });

    expect(paint.type).toBe('SOLID');
    expect(paint.color).toEqual({ r: 1, g: 0.5, b: 0 });
    expect(paint.opacity).toBe(1);
  });

  it('should create solid paint with custom opacity', () => {
    const paint = createSolidPaint({ r: 0.2, g: 0.5, b: 1 }, 0.5);

    expect(paint.type).toBe('SOLID');
    expect(paint.opacity).toBe(0.5);
  });

  it('should handle edge case colors', () => {
    const black = createSolidPaint({ r: 0, g: 0, b: 0 });
    const white = createSolidPaint({ r: 1, g: 1, b: 1 });

    expect(black.color).toEqual({ r: 0, g: 0, b: 0 });
    expect(white.color).toEqual({ r: 1, g: 1, b: 1 });
  });
});

describe('createDropShadow', () => {
  it('should create drop shadow for themes with shadows enabled', () => {
    const shadow = createDropShadow('sketch');

    expect(shadow).not.toBeNull();
    expect(shadow?.type).toBe('DROP_SHADOW');
    expect(shadow?.visible).toBe(true);
    expect(shadow?.blendMode).toBe('NORMAL');
  });

  it('should return null for themes without shadows', () => {
    const wireframeShadow = createDropShadow('wireframe');
    const noneShadow = createDropShadow('none');

    expect(wireframeShadow).toBeNull();
    expect(noneShadow).toBeNull();
  });

  it('should have consistent shadow properties', () => {
    const shadow = createDropShadow('clean');

    if (shadow) {
      expect(shadow.offset).toBeDefined();
      expect(shadow.radius).toBeGreaterThan(0);
      expect(shadow.color.a).toBeGreaterThan(0);
      expect(shadow.color.a).toBeLessThanOrEqual(1);
    }
  });
});

describe('getTextStyle', () => {
  it('should return correct font for sketch theme', () => {
    const style = getTextStyle('sketch', 16, false);

    expect(style.fontFamily).toBe('Chalkboard');
    expect(style.fontStyle).toBe('Regular');
    expect(style.fontSize).toBe(16);
  });

  it('should return bold style when requested', () => {
    const style = getTextStyle('clean', 20, true);

    expect(style.fontFamily).toBe('Inter');
    expect(style.fontStyle).toBe('Bold');
    expect(style.fontSize).toBe(20);
  });

  it('should handle different font sizes', () => {
    const sizes = [12, 16, 20, 24, 36, 48];

    sizes.forEach((size) => {
      const style = getTextStyle('clean', size, false);
      expect(style.fontSize).toBe(size);
    });
  });

  it('should return appropriate fonts for each theme', () => {
    expect(getTextStyle('sketch').fontFamily).toBe('Chalkboard');
    expect(getTextStyle('clean').fontFamily).toBe('Inter');
    expect(getTextStyle('wireframe').fontFamily).toBe('Helvetica Neue');
    expect(getTextStyle('none').fontFamily).toBe('Helvetica Neue');
  });

  it('should use default values when not specified', () => {
    const style = getTextStyle('clean');

    expect(style.fontSize).toBe(16);
    expect(style.fontStyle).toBe('Regular');
  });
});

describe('Theme consistency', () => {
  it('should have darker text than background', () => {
    const themes: Theme[] = ['sketch', 'clean', 'wireframe', 'none'];

    themes.forEach((theme) => {
      const styles = getThemeStyles(theme);

      // Calculate brightness (simple approximation)
      const bgBrightness = (styles.background.r + styles.background.g + styles.background.b) / 3;
      const textBrightness = (styles.text.r + styles.text.g + styles.text.b) / 3;

      // Text should be darker than background for readability
      expect(textBrightness).toBeLessThan(bgBrightness);
    });
  });

  it('should have consistent border width', () => {
    const themes: Theme[] = ['sketch', 'clean', 'wireframe', 'none'];

    themes.forEach((theme) => {
      const styles = getThemeStyles(theme);
      expect(styles.borderWidth).toBeGreaterThan(0);
      expect(styles.borderWidth).toBeLessThanOrEqual(4);
    });
  });
});

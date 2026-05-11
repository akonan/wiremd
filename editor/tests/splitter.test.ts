import { describe, expect, it } from 'vitest';
import {
  calculateSplitPercent,
  clampSplit,
  getEditorPanelStyle,
  getSplitLayout,
  isVerticalLayout,
} from '../src/splitter.js';

describe('editor splitter helpers', () => {
  it('clamps split percentages to the supported range', () => {
    expect(clampSplit(10)).toBe(20);
    expect(clampSplit(50)).toBe(50);
    expect(clampSplit(95)).toBe(80);
  });

  it('selects the vertical layout at and below the mobile breakpoint', () => {
    expect(isVerticalLayout(768)).toBe(true);
    expect(getSplitLayout(768)).toBe('vertical');
    expect(getSplitLayout(769)).toBe('horizontal');
  });

  it('calculates the horizontal split from pointer position', () => {
    const split = calculateSplitPercent(
      'horizontal',
      { clientX: 250, clientY: 0 },
      { left: 100, top: 0, width: 400, height: 600 },
      50,
    );

    expect(split).toBe(37.5);
  });

  it('calculates and clamps the vertical split from pointer position', () => {
    const split = calculateSplitPercent(
      'vertical',
      { clientX: 0, clientY: 580 },
      { left: 0, top: 100, width: 600, height: 400 },
      50,
    );

    expect(split).toBe(80);
  });

  it('falls back to the current split when bounds are invalid', () => {
    const split = calculateSplitPercent(
      'horizontal',
      { clientX: 300, clientY: 0 },
      { left: 0, top: 0, width: 0, height: 300 },
      55,
    );

    expect(split).toBe(55);
  });

  it('returns editor panel dimensions for the active layout', () => {
    expect(getEditorPanelStyle('horizontal', 60, 40)).toEqual({
      width: '60%',
      height: '',
    });

    expect(getEditorPanelStyle('vertical', 60, 40)).toEqual({
      width: '100%',
      height: '40%',
    });
  });
});

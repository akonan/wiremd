export const MIN_SPLIT_PERCENT = 20;
export const MAX_SPLIT_PERCENT = 80;
export const MOBILE_LAYOUT_MAX_WIDTH = 768;

export type SplitLayout = 'horizontal' | 'vertical';

export interface SplitBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SplitPointerPosition {
  clientX: number;
  clientY: number;
}

export interface EditorPanelStyle {
  width: string;
  height: string;
}

export function clampSplit(percent: number): number {
  return Math.min(Math.max(percent, MIN_SPLIT_PERCENT), MAX_SPLIT_PERCENT);
}

export function isVerticalLayout(viewportWidth: number): boolean {
  return viewportWidth <= MOBILE_LAYOUT_MAX_WIDTH;
}

export function getSplitLayout(viewportWidth: number): SplitLayout {
  return isVerticalLayout(viewportWidth) ? 'vertical' : 'horizontal';
}

export function calculateSplitPercent(
  layout: SplitLayout,
  pointer: SplitPointerPosition,
  bounds: SplitBounds,
  fallbackSplit: number,
): number {
  const size = layout === 'vertical' ? bounds.height : bounds.width;
  if (size <= 0) {
    return fallbackSplit;
  }

  const offset = layout === 'vertical'
    ? pointer.clientY - bounds.top
    : pointer.clientX - bounds.left;

  return clampSplit((offset / size) * 100);
}

export function getEditorPanelStyle(
  layout: SplitLayout,
  horizontalSplit: number,
  verticalSplit: number,
): EditorPanelStyle {
  if (layout === 'vertical') {
    return {
      width: '100%',
      height: `${verticalSplit}%`,
    };
  }

  return {
    width: `${horizontalSplit}%`,
    height: '',
  };
}

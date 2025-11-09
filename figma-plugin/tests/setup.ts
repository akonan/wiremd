/**
 * Figma API Mock Setup
 * Provides mock implementations of Figma API for testing
 */

import { vi } from 'vitest';

// Mock Figma node classes
class MockSceneNode {
  x: number = 0;
  y: number = 0;
  name: string = '';
  visible: boolean = true;
  locked: boolean = false;
  removed: boolean = false;

  remove() {
    this.removed = true;
  }
}

class MockFrameNode extends MockSceneNode {
  type = 'FRAME' as const;
  children: SceneNode[] = [];
  layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL' = 'NONE';
  primaryAxisSizingMode: 'FIXED' | 'AUTO' = 'FIXED';
  counterAxisSizingMode: 'FIXED' | 'AUTO' = 'FIXED';
  paddingLeft: number = 0;
  paddingRight: number = 0;
  paddingTop: number = 0;
  paddingBottom: number = 0;
  itemSpacing: number = 0;
  cornerRadius: number = 0;
  fills: readonly Paint[] = [];
  strokes: readonly Paint[] = [];
  strokeWeight: number = 0;
  strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER' = 'INSIDE';
  effects: readonly Effect[] = [];
  width: number = 100;
  height: number = 100;

  appendChild(child: SceneNode) {
    this.children.push(child);
  }

  insertChild(index: number, child: SceneNode) {
    this.children.splice(index, 0, child);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

class MockTextNode extends MockSceneNode {
  type = 'TEXT' as const;
  characters: string = '';
  fontSize: number = 16;
  fontName: FontName = { family: 'Roboto', style: 'Regular' };
  textDecoration: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH' = 'NONE';
  fills: readonly Paint[] = [];
  lineHeight: LineHeight = { value: 100, unit: 'PERCENT' };
  layoutGrow: number = 0;
}

class MockRectangleNode extends MockSceneNode {
  type = 'RECTANGLE' as const;
  cornerRadius: number = 0;
  fills: readonly Paint[] = [];
  strokes: readonly Paint[] = [];
  strokeWeight: number = 0;
  width: number = 100;
  height: number = 100;

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

class MockEllipseNode extends MockSceneNode {
  type = 'ELLIPSE' as const;
  fills: readonly Paint[] = [];
  strokes: readonly Paint[] = [];
  strokeWeight: number = 0;
  width: number = 100;
  height: number = 100;

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

class MockPageNode extends MockSceneNode {
  type = 'PAGE' as const;
  children: SceneNode[] = [];

  appendChild(child: SceneNode) {
    this.children.push(child);
  }
}

// Mock Figma global object
const mockFigma = {
  createFrame: vi.fn(() => new MockFrameNode() as any),
  createText: vi.fn(() => new MockTextNode() as any),
  createRectangle: vi.fn(() => new MockRectangleNode() as any),
  createEllipse: vi.fn(() => new MockEllipseNode() as any),
  createPage: vi.fn(() => new MockPageNode() as any),

  loadFontAsync: vi.fn(async (fontName: FontName) => {
    // Simulate successful font loading
    return Promise.resolve();
  }),

  notify: vi.fn((message: string, options?: any) => {
    // Mock notification
  }),

  closePlugin: vi.fn(() => {
    // Mock plugin close
  }),

  currentPage: null as any,
  viewport: {
    scrollAndZoomIntoView: vi.fn((nodes: SceneNode[]) => {
      // Mock viewport scroll
    }),
  },

  ui: {
    postMessage: vi.fn((message: any) => {
      // Mock UI message
    }),
    onmessage: null as any,
  },

  showUI: vi.fn((html: string, options?: any) => {
    // Mock show UI
  }),
};

// Set global figma object
(global as any).figma = mockFigma;

// Export for use in tests
export { mockFigma, MockFrameNode, MockTextNode, MockRectangleNode, MockEllipseNode, MockPageNode };

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  mockFigma.currentPage = new MockPageNode() as any;
});

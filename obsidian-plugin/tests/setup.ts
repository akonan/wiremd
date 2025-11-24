import { vi } from 'vitest';

// Mock global objects
global.window = global.window || {};
global.document = global.document || {};

// Mock navigator
global.navigator = {
  ...global.navigator,
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  },
  maxTouchPoints: 0
} as any;

// Mock URL APIs
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock Blob
global.Blob = class Blob {
  constructor(public parts: any[], public options?: any) {}
} as any;

// Setup DOM for testing
if (typeof window !== 'undefined') {
  window.setTimeout = setTimeout as any;
  window.clearTimeout = clearTimeout as any;
  window.innerWidth = 1024;
  window.innerHeight = 768;
}

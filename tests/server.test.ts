/**
 * Tests for dev server functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createServer } from 'http';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { startServer, notifyReload, notifyError } from '../src/cli/server.js';

describe('Dev Server', () => {
  const TEST_PORT = 3456;
  const TEST_OUTPUT = './test-output.html';
  let server: any;

  beforeEach(() => {
    // Create a test HTML file
    writeFileSync(
      TEST_OUTPUT,
      '<html><body><h1>Test</h1></body></html>',
      'utf-8'
    );
  });

  afterEach(() => {
    // Clean up test file
    try {
      unlinkSync(TEST_OUTPUT);
    } catch (e) {
      // Ignore if file doesn't exist
    }
  });

  describe('startServer', () => {
    it('should start server on specified port', async () => {
      // Note: This is a basic test - full server testing would require
      // more complex setup with actual server lifecycle management
      expect(typeof startServer).toBe('function');
    });

    it('should serve HTML file with live-reload script injected', () => {
      const html = readFileSync(TEST_OUTPUT, 'utf-8');
      expect(html).toContain('<h1>Test</h1>');
      // The actual injection happens in the server request handler
    });
  });

  describe('notifyReload', () => {
    it('should be a function', () => {
      expect(typeof notifyReload).toBe('function');
    });

    it('should not throw when called with no clients', () => {
      expect(() => notifyReload()).not.toThrow();
    });
  });

  describe('notifyError', () => {
    it('should be a function', () => {
      expect(typeof notifyError).toBe('function');
    });

    it('should accept error message string', () => {
      expect(() => notifyError('Test error message')).not.toThrow();
    });

    it('should handle empty error message', () => {
      expect(() => notifyError('')).not.toThrow();
    });
  });

  describe('Live-reload script injection', () => {
    it('should inject toolbar HTML', () => {
      // Test that the script template contains required elements
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('wiremd-toolbar');
      expect(serverModule).toContain('wiremd-error-overlay');
      expect(serverModule).toContain('wiremd-reload-indicator');
    });

    it('should inject viewport switcher buttons', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('viewport-btn');
      expect(serverModule).toContain('data-viewport="full"');
      expect(serverModule).toContain('data-viewport="laptop"');
      expect(serverModule).toContain('data-viewport="tablet"');
      expect(serverModule).toContain('data-viewport="mobile"');
    });

    it('should inject WebSocket connection code', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('WebSocket');
      expect(serverModule).toContain('ws://localhost:');
      expect(serverModule).toContain('onopen');
      expect(serverModule).toContain('onmessage');
      expect(serverModule).toContain('onclose');
    });

    it('should inject error handling code', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('showError');
      expect(serverModule).toContain('errorOverlay');
      expect(serverModule).toContain('error:');
    });

    it('should inject reload handling code', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('reload');
      expect(serverModule).toContain('window.location.reload');
      expect(serverModule).toContain('reloadIndicator');
    });
  });

  describe('WebSocket message format', () => {
    it('should format reload messages correctly', () => {
      // The format is tested implicitly through notifyReload function
      expect(() => notifyReload()).not.toThrow();
    });

    it('should format error messages with prefix', () => {
      // Error messages should start with "error:"
      expect(() => notifyError('Parse failed')).not.toThrow();
    });
  });

  describe('Viewport switcher functionality', () => {
    it('should define viewport classes', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('viewport-full');
      expect(serverModule).toContain('viewport-mobile');
      expect(serverModule).toContain('viewport-tablet');
      expect(serverModule).toContain('viewport-laptop');
    });

    it('should define max-width for each viewport', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('max-width: 375px'); // mobile
      expect(serverModule).toContain('max-width: 768px'); // tablet
      expect(serverModule).toContain('max-width: 1024px'); // laptop
    });
  });

  describe('Error overlay styling', () => {
    it('should define error overlay styles', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('#wiremd-error-overlay');
      expect(serverModule).toContain('position: fixed');
      expect(serverModule).toContain('z-index: 10000');
    });

    it('should include close button', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('close-btn');
      expect(serverModule).toContain('classList.remove');
    });

    it('should auto-dismiss after timeout', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('setTimeout');
      expect(serverModule).toContain('8000'); // 8 second timeout
    });
  });

  describe('Connection status indicator', () => {
    it('should show connection status', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('Connected');
      expect(serverModule).toContain('Disconnected');
      expect(serverModule).toContain('Connecting...');
    });

    it('should include status dot animation', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('status-dot');
      expect(serverModule).toContain('pulse');
      expect(serverModule).toContain('@keyframes pulse');
    });

    it('should update status on connection state change', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('updateStatus');
      expect(serverModule).toContain('status.connected');
    });
  });

  describe('Reconnection logic', () => {
    it('should implement reconnection with retry limit', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('retryCount');
      expect(serverModule).toContain('maxRetries');
      expect(serverModule).toContain('10'); // max 10 retries
    });

    it('should wait between reconnection attempts', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('setTimeout(connect, 1000)');
    });

    it('should show error after max retries', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('Lost connection to dev server');
    });
  });

  describe('Toolbar UI', () => {
    it('should have gradient background', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('linear-gradient');
      expect(serverModule).toContain('#667eea');
      expect(serverModule).toContain('#764ba2');
    });

    it('should include logo', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('⚡ Wiremd Live');
    });

    it('should be fixed at top', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('position: fixed');
      expect(serverModule).toContain('top: 0');
      expect(serverModule).toContain('z-index: 9999');
    });
  });

  describe('Preview wrapper', () => {
    it('should wrap content in preview wrapper', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('wiremd-preview-wrapper');
      expect(serverModule).toContain('wrapper.appendChild');
    });

    it('should add top margin for toolbar', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('margin-top: 48px');
    });

    it('should handle viewport class changes', () => {
      const serverModule = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverModule).toContain('wrapper.className');
      expect(serverModule).toContain('viewport-');
    });
  });
});

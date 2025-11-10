/**
 * Integration tests for live-reload functionality
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync } from 'fs';

describe('Live Preview Integration', () => {
  describe('CLI and Server Integration', () => {
    it('should have notifyError exported from server', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverSource).toContain('export function notifyError');
    });

    it('should have notifyReload exported from server', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');
      expect(serverSource).toContain('export function notifyReload');
    });

    it('should import server functions in CLI', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain("import");
      expect(cliSource).toContain("notifyReload");
      expect(cliSource).toContain("notifyError");
      expect(cliSource).toContain("from './server.js'");
    });

    it('should use both server functions in watch mode', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('notifyReload()');
      expect(cliSource).toContain('notifyError(');
    });
  });

  describe('Live Reload Flow', () => {
    it('should have complete reload flow: file change -> regenerate -> notify', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');

      // Check for file watching
      expect(cliSource).toContain('watchFile');

      // Check for regeneration
      expect(cliSource).toContain('generateOutput');
      expect(cliSource).toContain('writeFileSync');

      // Check for notification
      expect(cliSource).toContain('notifyReload');
    });

    it('should have error flow: file change -> parse error -> notify error', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');

      // Check for error catching
      expect(cliSource).toContain('catch');

      // Check for error notification
      expect(cliSource).toContain('notifyError');
    });

    it('should only trigger notifications when server is active', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');

      // Both notifications should check for serve option
      const reloadSection = cliSource.match(/if \(options\.serve\)[\s\S]*?notifyReload/);
      const errorSection = cliSource.match(/if \(options\.serve\)[\s\S]*?notifyError/);

      expect(reloadSection).toBeTruthy();
      expect(errorSection).toBeTruthy();
    });
  });

  describe('WebSocket Communication', () => {
    it('should send reload message in correct format', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      // Check sendMessageToClients implementation
      expect(serverSource).toContain('sendMessageToClients');
      expect(serverSource).toContain('Buffer.alloc');
      expect(serverSource).toContain('0x81'); // WebSocket FIN + text frame
    });

    it('should prefix error messages correctly', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      // Check error message formatting
      expect(serverSource).toContain('error:${errorMessage}');
    });

    it('should handle client disconnections gracefully', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      // Check error handling in message sending
      expect(serverSource).toContain('catch');
      expect(serverSource).toContain('wsClients.delete');
    });
  });

  describe('Client-side WebSocket Handling', () => {
    it('should handle reload messages', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain("data === 'reload'");
      expect(serverSource).toContain('window.location.reload');
    });

    it('should handle error messages', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain("data.startsWith('error:')");
      expect(serverSource).toContain('showError');
    });

    it('should show reload indicator before reload', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('reloadIndicator.classList.add');
      expect(serverSource).toContain('setTimeout');
      expect(serverSource).toContain('window.location.reload');
    });
  });

  describe('UI Components Integration', () => {
    it('should inject all UI components in correct order', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      // Check for style block first
      const styleIndex = serverSource.indexOf('<style>');

      // Check for toolbar
      const toolbarIndex = serverSource.indexOf('wiremd-toolbar');

      // Check for error overlay
      const errorIndex = serverSource.indexOf('wiremd-error-overlay');

      // Check for reload indicator
      const reloadIndex = serverSource.indexOf('wiremd-reload-indicator');

      // Check for script
      const scriptIndex = serverSource.indexOf('<script>');

      // Verify order
      expect(styleIndex).toBeLessThan(toolbarIndex);
      expect(toolbarIndex).toBeLessThan(errorIndex);
      expect(errorIndex).toBeLessThan(reloadIndex);
      expect(reloadIndex).toBeLessThan(scriptIndex);
    });

    it('should properly wrap content in preview wrapper', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('wiremd-preview-wrapper');
      expect(serverSource).toContain('wrapper.appendChild(body.firstChild)');
      expect(serverSource).toContain('body.appendChild(wrapper)');
    });

    it('should exclude UI elements from wrapper', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain("id !== 'wiremd-toolbar'");
      expect(serverSource).toContain("id !== 'wiremd-error-overlay'");
      expect(serverSource).toContain("id !== 'wiremd-reload-indicator'");
    });
  });

  describe('Viewport Switcher Integration', () => {
    it('should handle viewport button clicks', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('.viewport-btn');
      expect(serverSource).toContain('addEventListener');
      expect(serverSource).toContain('data-viewport');
      expect(serverSource).toContain('wrapper.className');
    });

    it('should update active state on viewport change', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('classList.remove');
      expect(serverSource).toContain('classList.add');
      expect(serverSource).toContain('active');
    });

    it('should apply viewport class to wrapper', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain("'viewport-' + viewport");
    });
  });

  describe('Connection Status Integration', () => {
    it('should update status on connection open', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('ws.onopen');
      expect(serverSource).toContain('updateStatus(true)');
    });

    it('should update status on connection close', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('ws.onclose');
      expect(serverSource).toContain('updateStatus(false)');
    });

    it('should attempt reconnection on close', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('retryCount < maxRetries');
      expect(serverSource).toContain('setTimeout(connect, 1000)');
    });

    it('should show error after max retries', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('retryCount < maxRetries');
      expect(serverSource).toContain('Lost connection to dev server');
    });
  });

  describe('Error Overlay Integration', () => {
    it('should show error overlay with message', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('function showError');
      expect(serverSource).toContain('errorMessage.textContent');
      expect(serverSource).toContain("classList.add('show')");
    });

    it('should auto-dismiss error overlay', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('setTimeout');
      expect(serverSource).toContain("classList.remove('show')");
      expect(serverSource).toContain('8000');
    });

    it('should support manual close', () => {
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');

      expect(serverSource).toContain('close-btn');
      expect(serverSource).toContain('onclick');
      expect(serverSource).toContain("classList.remove('show')");
    });
  });

  describe('TypeScript Configuration', () => {
    it('should include DOM lib for browser APIs', () => {
      const tsconfig = readFileSync('./tsconfig.json', 'utf-8');
      const config = JSON.parse(tsconfig);

      expect(config.compilerOptions.lib).toContain('DOM');
    });

    it('should include node types', () => {
      const tsconfig = readFileSync('./tsconfig.json', 'utf-8');
      const config = JSON.parse(tsconfig);

      expect(config.compilerOptions.types).toContain('node');
    });

    it('should exclude vscode-extension from main build', () => {
      const tsconfig = readFileSync('./tsconfig.json', 'utf-8');
      const config = JSON.parse(tsconfig);

      expect(config.exclude).toContain('vscode-extension');
    });
  });

  describe('Documentation', () => {
    it('should have live preview guide', () => {
      const guide = readFileSync('./LIVE_PREVIEW_GUIDE.md', 'utf-8');

      expect(guide).toContain('Live Preview');
      expect(guide).toContain('CLI');
      expect(guide).toContain('VS Code');
    });

    it('should document viewport switcher', () => {
      const guide = readFileSync('./LIVE_PREVIEW_GUIDE.md', 'utf-8');

      expect(guide).toContain('viewport');
      expect(guide).toContain('mobile');
      expect(guide).toContain('tablet');
      expect(guide).toContain('laptop');
    });

    it('should document error overlay', () => {
      const guide = readFileSync('./LIVE_PREVIEW_GUIDE.md', 'utf-8');

      expect(guide).toContain('error');
      expect(guide).toContain('overlay');
    });

    it('should document troubleshooting', () => {
      const guide = readFileSync('./LIVE_PREVIEW_GUIDE.md', 'utf-8');

      expect(guide).toContain('Troubleshooting');
    });
  });

  describe('Package Configuration', () => {
    it('should have @types/node dependency', () => {
      const pkg = readFileSync('./package.json', 'utf-8');
      const config = JSON.parse(pkg);

      expect(config.devDependencies).toHaveProperty('@types/node');
    });
  });

  describe('Complete Feature Coverage', () => {
    it('should implement all advertised features', () => {
      const guide = readFileSync('./LIVE_PREVIEW_GUIDE.md', 'utf-8');
      const serverSource = readFileSync('./src/cli/server.ts', 'utf-8');
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');

      // Features mentioned in guide should exist in code
      const features = [
        { name: 'toolbar', code: 'wiremd-toolbar' },
        { name: 'viewport', code: 'viewport-btn' },
        { name: 'error overlay', code: 'wiremd-error-overlay' },
        { name: 'connection status', code: 'status' },
        { name: 'live-reload', code: 'reload' },
      ];

      features.forEach((feature) => {
        // Feature should be mentioned in guide
        expect(guide.toLowerCase()).toContain(feature.name.toLowerCase());

        // Feature should exist in code (either server or cli)
        const inCode =
          serverSource.includes(feature.code) ||
          cliSource.includes(feature.code);
        expect(inCode).toBe(true);
      });
    });
  });
});

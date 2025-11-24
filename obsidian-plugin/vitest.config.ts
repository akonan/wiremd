import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.*',
        'main.js'
      ]
    }
  },
  resolve: {
    alias: {
      'obsidian': path.resolve(__dirname, './tests/mocks/obsidian.ts'),
      'wiremd': path.resolve(__dirname, '../wiremd/dist/index.js')
    }
  }
});

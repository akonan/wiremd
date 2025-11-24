/**
 * Vitest Configuration for wiremd tests
 * 
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules/', 'dist/', 'figma-plugin/tests/', 'obsidian-plugin/tests/'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
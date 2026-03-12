/**
 * Vitest Configuration for wiremd tests
 * 
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

const focusedRendererTests = [
  'tests/angular-renderer.test.ts',
  'tests/react-renderer.test.ts',
  'tests/render-routing.test.ts',
  'tests/renderer-branches.test.ts',
  'tests/renderer.test.ts',
  'tests/svelte-renderer.test.ts',
  'tests/tailwind-renderer.test.ts',
  'tests/vue-renderer.test.ts',
];

const focusedPluginTests = [
  'tests/plugin-utils.test.ts',
  'tests/plugins.test.ts',
];

const focusedRendererAndPluginTests = [
  ...focusedPluginTests,
  ...focusedRendererTests,
];

const fullSuiteInclude = ['tests/**/*.test.ts'];
const testScope = process.env.WIREMD_TEST_SCOPE || 'focused';
const isFullSuite = testScope === 'full';
const isPluginSuite = testScope === 'plugins';
const isRendererSuite = testScope === 'renderers';

function getIncludedTests(): string[] {
  if (isFullSuite) {
    return fullSuiteInclude;
  }

  if (isPluginSuite) {
    return focusedPluginTests;
  }

  if (isRendererSuite) {
    return focusedRendererTests;
  }

  return focusedRendererAndPluginTests;
}

function getCoverageInclude(): string[] {
  if (isFullSuite) {
    return ['src/**/*.ts'];
  }

  if (isPluginSuite) {
    return [
      'src/index.ts',
      'src/renderer/builtin-plugins.ts',
      'src/renderer/plugin-registry.ts',
      'src/renderer/plugin-utils.ts',
    ];
  }

  if (isRendererSuite) {
    return [
      'src/renderer/angular-renderer.ts',
      'src/renderer/html-renderer.ts',
      'src/renderer/react-renderer.ts',
      'src/renderer/render-implementations.ts',
      'src/renderer/svelte-renderer.ts',
      'src/renderer/tailwind-renderer.ts',
      'src/renderer/vue-renderer.ts',
    ];
  }

  return ['src/renderer/**/*.ts'];
}

function getCoverageThresholds() {
  if (isFullSuite) {
    return {
      'src/*.ts': {
        statements: 80,
        branches: 60,
        functions: 80,
        lines: 75,
      },
      'src/cli/**/*.ts': {
        statements: 80,
        branches: 60,
        functions: 80,
        lines: 75,
      },
      'src/parser/**/*.ts': {
        statements: 80,
        branches: 60,
        functions: 80,
        lines: 75,
      },
      'src/renderer/**/*.ts': {
        statements: 80,
        branches: 60,
        functions: 80,
        lines: 75,
      },
    };
  }

  if (isPluginSuite) {
    return {
      statements: 80,
      branches: 60,
      functions: 80,
      lines: 75,
    };
  }

  if (isRendererSuite) {
    return {
      statements: 80,
      branches: 60,
      functions: 80,
      lines: 75,
    };
  }

  return {
    'src/renderer/**/*.ts': {
      statements: 80,
      branches: 60,
      functions: 80,
      lines: 75,
    },
  };
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: getIncludedTests(),
    exclude: ['node_modules/', 'dist/', 'figma-plugin/tests/', 'obsidian-plugin/tests/'],
    coverage: {
      provider: 'v8',
      all: true,
      reportsDirectory: 'coverage',
      reporter: ['text', 'html', 'json', 'lcov'],
      include: getCoverageInclude(),
      exclude: [
        'src/**/*.d.ts',
        'src/**/__tests__/**',
        'src/**/test-utils/**',
        ...(!isFullSuite ? ['src/renderer/styles.ts'] : []),
      ],
      thresholds: getCoverageThresholds(),
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

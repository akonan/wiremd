import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  ssr: {
    // Bundle all dependencies into the CJS build
    noExternal: true,
  },
  build: {
    ssr: true, // This is a Node.js library, not a browser library
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        parser: resolve(__dirname, 'src/parser/index.ts'),
        renderer: resolve(__dirname, 'src/renderer/index.ts'),
        'cli/index': resolve(__dirname, 'src/cli/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs';
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: (id) => {
        // For CommonJS build, only externalize Node.js built-ins
        // Bundle all npm dependencies to avoid ESM/CJS issues
        const nodeBuiltins = [
          'fs', 'path', 'http', 'https', 'crypto', 'os', 'stream',
          'util', 'events', 'buffer', 'process', 'url', 'querystring',
          'fs/promises'
        ];
        return nodeBuiltins.includes(id);
      },
      output: {
        exports: 'named',
      },
    },
    sourcemap: true,
    minify: false,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
});

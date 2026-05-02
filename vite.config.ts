import { defineConfig } from 'vite';
import { resolve, isAbsolute } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
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
        if (/^node:/.test(id)) return true;
        const nodeBuiltins = [
          'fs', 'path', 'http', 'https', 'crypto', 'os', 'stream',
          'util', 'events', 'buffer', 'process', 'url', 'querystring',
          'fs/promises'
        ];
        if (nodeBuiltins.includes(id)) return true;
        // Don't externalize entry files / relative imports / @/ aliases.
        // Use isAbsolute() so Windows paths (D:\...) are recognized too.
        if (id.startsWith('.') || id.startsWith('@/') || isAbsolute(id)) return false;
        // Everything else is a bare specifier (npm package) — externalize.
        return true;
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

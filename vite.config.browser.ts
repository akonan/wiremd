import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

/**
 * Vite configuration for browser build
 * Creates UMD and ES modules optimized for browser usage
 */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/browser.ts'),
      name: 'wiremd',
      formats: ['umd', 'es'],
      fileName: (format) => {
        if (format === 'umd') return 'wiremd.umd.js';
        return 'wiremd.es.js';
      },
    },
    rollupOptions: {
      // All dependencies are bundled for the browser
      output: {
        exports: 'named',
        globals: {},
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
  plugins: [
    dts({
      include: ['src/browser.ts', 'src/types.ts', 'src/parser/**/*.ts', 'src/renderer/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'src/cli/**/*.ts'],
      outDir: 'dist',
      entryRoot: 'src',
    }),
  ],
});

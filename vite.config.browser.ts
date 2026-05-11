import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Vite configuration for the UMD bundle.
 * Produces dist/wiremd.umd.js for <script> / CDN consumers who don't run a bundler.
 * All npm dependencies are inlined; Node.js built-ins are not required by the
 * parser/renderer core so no externals are needed here.
 */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'wiremd',
      formats: ['umd'],
      fileName: () => 'wiremd.umd.js',
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
});

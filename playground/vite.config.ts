import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname),
  server: {
    port: 5174,
    open: true,
  },
  resolve: {
    alias: {
      wiremd: resolve(__dirname, '../src/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
  },
});

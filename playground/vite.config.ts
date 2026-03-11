import { defineConfig } from 'vite';
import { resolve } from 'path';

const projectSrcRoot = resolve(__dirname, '../src/');

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
    // Monaco remains the primary editor dependency. We budget its isolated chunk
    // explicitly instead of relying on Vite's generic 500 kB warning.
    chunkSizeWarningLimit: 3900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/monaco-editor/esm/vs/basic-languages/html/')) {
            return 'monaco-html';
          }

          if (id.includes('/node_modules/monaco-editor/')) {
            return 'monaco';
          }

          if (
            id.startsWith(projectSrcRoot) ||
            id.includes('/node_modules/unified/') ||
            id.includes('/node_modules/remark/') ||
            id.includes('/node_modules/remark-parse/') ||
            id.includes('/node_modules/remark-gfm/') ||
            id.includes('/node_modules/mdast-util-') ||
            id.includes('/node_modules/unist-util-') ||
            id.includes('/node_modules/micromark') ||
            id.includes('/node_modules/decode-named-character-reference') ||
            id.includes('/node_modules/html-void-elements') ||
            id.includes('/node_modules/property-information') ||
            id.includes('/node_modules/hast-util-') ||
            id.includes('/node_modules/vfile') ||
            id.includes('/node_modules/trough')
          ) {
            return 'wiremd-core';
          }
        },
      },
    },
  },
});

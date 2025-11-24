import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'parser/index': resolve(__dirname, 'src/parser/index.ts'),
        'renderer/index': resolve(__dirname, 'src/renderer/index.ts'),
        'cli/index': resolve(__dirname, 'src/cli/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs';
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: [
        'chalk',
        'chokidar',
        'mdast-util-from-markdown',
        'mdast-util-to-markdown',
        'remark',
        'remark-gfm',
        'remark-parse',
        'unified',
        'unist-util-visit',
        'fs',
        'path',
        'fs/promises',
      ],
      output: {
        preserveModules: false,
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});

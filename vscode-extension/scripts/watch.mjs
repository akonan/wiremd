import { watch } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const distFile = path.join(root, '../dist/index.cjs');

let debounce;

watch(distFile, () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    console.log('[wiremd-ext] detected wiremd rebuild, bundling...');
    try {
      execSync('npm run bundle', { cwd: root, stdio: 'inherit' });
      console.log('[wiremd-ext] done — reload VS Code window to pick up changes');
    } catch {
      console.error('[wiremd-ext] bundle failed');
    }
  }, 200);
});

console.log('[wiremd-ext] watching ../dist/index.cjs...');

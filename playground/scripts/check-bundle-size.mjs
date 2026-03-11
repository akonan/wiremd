import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const distAssetsDir = path.resolve('dist/assets');

const bundleBudgets = [
  { prefix: 'index-', maxBytes: 20 * 1024 },
  { prefix: 'wiremd-core-', maxBytes: 220 * 1024 },
  { prefix: 'monaco-html-', maxBytes: 40 * 1024 },
  { prefix: 'monaco-', maxBytes: 3900 * 1024 },
];

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

async function findBundleFile(prefix) {
  const entries = await readdir(distAssetsDir);
  const filename = entries.find((entry) => entry.startsWith(prefix) && entry.endsWith('.js'));

  if (!filename) {
    throw new Error(`Missing bundle with prefix "${prefix}" in ${distAssetsDir}`);
  }

  return path.join(distAssetsDir, filename);
}

async function checkBudget({ prefix, maxBytes }) {
  const filename = await findBundleFile(prefix);
  const fileStats = await stat(filename);

  if (fileStats.size > maxBytes) {
    throw new Error(
      `${path.basename(filename)} is ${formatKiB(fileStats.size)} (limit ${formatKiB(maxBytes)})`,
    );
  }

  return `${path.basename(filename)}: ${formatKiB(fileStats.size)} / ${formatKiB(maxBytes)}`;
}

async function main() {
  const results = await Promise.all(bundleBudgets.map(checkBudget));
  for (const result of results) {
    console.log(result);
  }
}

await main();

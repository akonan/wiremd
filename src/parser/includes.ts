/**
 * wiremd file-include resolution (Node-only)
 *
 * Expands `![[file.md]]` directives by reading sibling files from disk.
 * Lives in its own module so the browser-safe parser entry doesn't
 * pull `fs` / `path` for consumers that don't use includes.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const INCLUDE_PATTERN = /!\[\[\s*([^\]]+?\.md)\s*\]\]/g;

export function resolveIncludes(markdown: string, basePath: string): string {
  const dir = dirname(resolve(basePath));

  const parts = markdown.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) return part;
    return part.replace(INCLUDE_PATTERN, (_match, relPath: string) => {
      const targetPath = resolve(dir, relPath.trim());
      if (!existsSync(targetPath)) {
        return `> ⚠️ Could not include: ${relPath}`;
      }
      try {
        return readFileSync(targetPath, 'utf-8');
      } catch {
        return `> ⚠️ Could not include: ${relPath}`;
      }
    });
  }).join('');
}

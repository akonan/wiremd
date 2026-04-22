import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { resolveIncludes } from '../src/parser/index.js';

const tmp = join(tmpdir(), 'wiremd-includes-test');

beforeEach(() => {
  mkdirSync(tmp, { recursive: true });
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('resolveIncludes', () => {
  it('returns markdown unchanged when there are no includes', () => {
    const md = '# Hello\n\nSome content.';
    expect(resolveIncludes(md, join(tmp, 'index.md'))).toBe(md);
  });

  it('inlines a referenced file', () => {
    const partial = '## Section\n\nContent from partial.';
    writeFileSync(join(tmp, 'partial.md'), partial);
    const md = '# Main\n\n![[partial.md]]';
    const result = resolveIncludes(md, join(tmp, 'index.md'));
    expect(result).toBe('# Main\n\n' + partial);
  });

  it('replaces a missing file with a warning blockquote', () => {
    const result = resolveIncludes('![[missing.md]]', join(tmp, 'index.md'));
    expect(result).toContain('⚠️');
    expect(result).toContain('missing.md');
  });

  it('resolves includes relative to the base file, not cwd', () => {
    const subdir = join(tmp, 'pages');
    mkdirSync(subdir);
    writeFileSync(join(subdir, 'header.md'), '# Header');
    const md = '![[header.md]]';
    const result = resolveIncludes(md, join(subdir, 'index.md'));
    expect(result).toBe('# Header');
  });

  it('handles multiple includes in one file', () => {
    writeFileSync(join(tmp, 'a.md'), 'A');
    writeFileSync(join(tmp, 'b.md'), 'B');
    const result = resolveIncludes('![[a.md]]\n![[b.md]]', join(tmp, 'index.md'));
    expect(result).toBe('A\nB');
  });

  it('ignores syntax that does not end in .md', () => {
    const md = '![[image.png]]';
    expect(resolveIncludes(md, join(tmp, 'index.md'))).toBe(md);
  });

  it('trims whitespace from the path inside brackets', () => {
    writeFileSync(join(tmp, 'partial.md'), 'Trimmed');
    const result = resolveIncludes('![[ partial.md ]]', join(tmp, 'index.md'));
    expect(result).toBe('Trimmed');
  });
});

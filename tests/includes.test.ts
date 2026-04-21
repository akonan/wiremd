import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, readFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { resolveIncludes, parse } from '../src/parser/index.js';
import { generateOutput } from '../src/cli/index.js';

// ---------------------------------------------------------------------------
// Temp directory helpers
// ---------------------------------------------------------------------------

let tmpDir: string;

beforeEach(() => {
  tmpDir = join(tmpdir(), `wiremd-test-${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

function write(rel: string, content: string): string {
  const abs = join(tmpDir, rel);
  mkdirSync(join(abs, '..'), { recursive: true });
  writeFileSync(abs, content, 'utf-8');
  return abs;
}

// ---------------------------------------------------------------------------
// resolveIncludes unit tests
// ---------------------------------------------------------------------------

describe('resolveIncludes', () => {
  it('splices included file content inline', () => {
    write('nav.md', '[[ Home | About | Contact ]]');
    const srcPath = write('index.md', `# Page\n\n![[nav.md]]\n\n## Hero`);

    const result = resolveIncludes(readFileSync(srcPath, 'utf-8'), srcPath);

    expect(result).toContain('[[ Home | About | Contact ]]');
    expect(result).not.toContain('![[nav.md]]');
    expect(result).toContain('# Page');
    expect(result).toContain('## Hero');
  });

  it('resolves path relative to the source file, not cwd', () => {
    write('shared/footer.md', '© 2025 wiremd');
    const srcPath = write('pages/home.md', `![[../shared/footer.md]]`);

    const result = resolveIncludes(readFileSync(srcPath, 'utf-8'), srcPath);

    expect(result).toContain('© 2025 wiremd');
  });

  it('handles multiple includes in one file', () => {
    write('header.md', '# Header');
    write('footer.md', '---\n© Footer');
    const srcPath = write('page.md', `![[header.md]]\n\nBody content\n\n![[footer.md]]`);

    const result = resolveIncludes(readFileSync(srcPath, 'utf-8'), srcPath);

    expect(result).toContain('# Header');
    expect(result).toContain('Body content');
    expect(result).toContain('© Footer');
  });

  it('returns warning blockquote for a missing file', () => {
    const srcPath = write('page.md', `![[missing.md]]`);

    const result = resolveIncludes(readFileSync(srcPath, 'utf-8'), srcPath);

    expect(result).toContain('> ⚠️');
    expect(result).toContain('missing.md');
  });

  it('leaves non-.md wikilinks untouched', () => {
    const srcPath = write('page.md', `![[image.png]]\n![[style.css]]`);

    const result = resolveIncludes(readFileSync(srcPath, 'utf-8'), srcPath);

    expect(result).toContain('![[image.png]]');
    expect(result).toContain('![[style.css]]');
  });

  it('leaves regular image markdown untouched', () => {
    const srcPath = write('page.md', `![logo](logo.png)\n![alt text](./img/hero.png)`);

    const result = resolveIncludes(readFileSync(srcPath, 'utf-8'), srcPath);

    expect(result).toContain('![logo](logo.png)');
    expect(result).toContain('![alt text](./img/hero.png)');
  });

  it('does nothing when there are no includes', () => {
    const srcPath = write('page.md', `# Hello\n\nJust a paragraph.`);

    const result = resolveIncludes(readFileSync(srcPath, 'utf-8'), srcPath);

    expect(result).toBe('# Hello\n\nJust a paragraph.');
  });

  it('included content is itself parseable by wiremd', () => {
    write('nav.md', '[[ Logo | Home | About | [Sign In]* ]]');
    const srcPath = write('page.md', `![[nav.md]]\n\n## Body`);

    const result = resolveIncludes(readFileSync(srcPath, 'utf-8'), srcPath);

    const ast = parse(result);
    expect(ast.type).toBe('document');
    expect(ast.children.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// CLI integration: generateOutput processes includes
// ---------------------------------------------------------------------------

describe('generateOutput with includes', () => {
  it('renders included file content in HTML output', () => {
    write('nav.md', '[[ Home | About ]]');
    const srcPath = write('index.md', `![[nav.md]]\n\n## Welcome`);

    const html = generateOutput({ input: srcPath, format: 'html', style: 'sketch', pretty: false });

    expect(html).toContain('Home');
    expect(html).toContain('About');
    expect(html).toContain('Welcome');
  });

  it('renders missing-include warning in HTML output', () => {
    const srcPath = write('index.md', `![[does-not-exist.md]]`);

    const html = generateOutput({ input: srcPath, format: 'html', style: 'sketch', pretty: false });

    expect(html).toContain('does-not-exist.md');
  });
});

import { describe, it, expect } from 'vitest';
import { parse } from '../../src/parser/index.js';

describe('Spec 1 & 11: Document Structure Conformance', () => {
  it('returns a document root node', () => {
    const ast = parse('');

    expect(ast.type).toBe('document');
    expect(typeof ast.version).toBe('string');
    expect(ast.version.length).toBeGreaterThan(0);
  });

  it('includes meta object with required baseline fields', () => {
    const ast = parse('# Title');

    expect(ast.meta).toBeDefined();
    expect(typeof ast.meta).toBe('object');
    expect(ast.meta.viewport).toBeDefined();
    expect(ast.meta.theme).toBeDefined();
  });

  it('always exposes children as an array', () => {
    const ast = parse('Plain paragraph');

    expect(Array.isArray(ast.children)).toBe(true);
    expect(ast.children.length).toBeGreaterThan(0);
  });

  it('preserves node shape contract for top-level children', () => {
    const ast = parse('## Heading\n\n[Button]\n\n[___]');

    for (const node of ast.children) {
      expect(node).toBeDefined();
      expect(typeof node).toBe('object');
      expect(typeof node.type).toBe('string');
    }
  });

  it('supports strict document-level serialization shape', () => {
    const ast = parse('## Header');

    const serialized = JSON.parse(JSON.stringify(ast));
    expect(serialized).toHaveProperty('type', 'document');
    expect(serialized).toHaveProperty('version');
    expect(serialized).toHaveProperty('meta');
    expect(serialized).toHaveProperty('children');
  });
});

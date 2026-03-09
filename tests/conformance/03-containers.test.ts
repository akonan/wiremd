import { describe, it, expect } from 'vitest';
import { parse } from '../../src/parser/index.js';

function getRootNode(markdown: string): any {
  const ast = parse(markdown);
  expect(ast.type).toBe('document');
  expect(ast.children.length).toBeGreaterThan(0);
  return ast.children[0];
}

describe('Spec 3: Container Syntax', () => {
  describe('3.1 Generic Containers', () => {
    it('parses ::: hero ... ::: as generic container', () => {
      const container = getRootNode(`::: hero\nContent\n:::`);

      expect(container.type).toBe('container');
      expect(container.containerType).toBe('hero');
      expect(Array.isArray(container.children)).toBe(true);
      expect(container.children[0].type).toBe('paragraph');
      expect(container.children[0].content).toBe('Content');
    });

    it('parses attributes on opening container line', () => {
      const container = getRootNode(`::: card {.shadow data-role:"panel"}\nContent\n:::`);

      expect(container.type).toBe('container');
      expect(container.containerType).toBe('card');
      expect(container.props?.classes).toContain('shadow');
      expect(container.props?.['data-role']).toBe('panel');
    });

    it('supports nested containers', () => {
      const layout = getRootNode(`::: layout\n::: sidebar\nNav\n:::\n::: main\nBody\n:::\n:::`);

      expect(layout.type).toBe('container');
      expect(layout.containerType).toBe('layout');
      const nestedContainers = (layout.children || []).filter((n: any) => n.type === 'container');

      expect(nestedContainers.length).toBeGreaterThanOrEqual(2);
      expect(nestedContainers[0].containerType).toBe('sidebar');
      expect(nestedContainers[1].containerType).toBe('main');
    });
  });

  describe('3.2 Compact Inline Containers', () => {
    it('parses [[ A | B | C ]] into an inline/nav container with 3 items', () => {
      const nav = getRootNode('[[ A | B | C ]]');
      expect(nav.type).toBe('nav');
      expect(Array.isArray(nav.children)).toBe(true);
      expect(nav.children).toHaveLength(3);
      expect(nav.children[0].type).toBe('nav-item');
      expect(nav.children[1].type).toBe('nav-item');
      expect(nav.children[2].type).toBe('nav-item');
    });

    it('supports text, icon, and button items in inline container', () => {
      const nav = getRootNode('[[ :logo: Brand | Home | [Sign In]* ]]{.nav}');
      expect(nav.type).toBe('nav');

      const hasBrand = nav.children.some((n: any) => n.type === 'brand');
      const hasButton = nav.children.some((n: any) => n.type === 'button');
      expect(hasBrand).toBe(true);
      expect(hasButton).toBe(true);
      expect(nav.props?.classes).toContain('nav');
    });

    it('does not parse malformed inline container [[ A | B ] as valid container', () => {
      const root = getRootNode('[[ A | B ]');
      expect(root.type).not.toBe('nav');
      expect(root.type).not.toBe('container');
    });
  });
});

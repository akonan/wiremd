import { describe, it, expect } from 'vitest';
import { parse } from '../../src/parser/index.js';

function getRoot(markdown: string): any {
  const ast = parse(markdown);
  expect(ast.type).toBe('document');
  expect(ast.children.length).toBeGreaterThan(0);
  return ast.children[0];
}

describe('Spec 7 & 8: Special Patterns & States', () => {
  describe('7.2 Breadcrumbs', () => {
    it('parses >-separated breadcrumb pattern into breadcrumbs node', () => {
      const node = getRoot('Home > Products > Details');
      expect(node.type).toBe('breadcrumbs');
      expect(Array.isArray(node.children)).toBe(true);
      expect(node.children).toHaveLength(3);
    });

    it('parses breadcrumbs with icons and class marker', () => {
      const ast = parse(':house: Home > :folder: Products > Category\n{.breadcrumbs}');
      const node = ast.children[0];
      expect(node.type).toBe('breadcrumbs');
      expect(node.props?.classes).toContain('breadcrumbs');
    });
  });

  describe('7.3 Tabs', () => {
    it('parses tabs and marks active tab via * suffix', () => {
      const node = getRoot('[Overview]* | Details | Reviews | FAQ');
      expect(node.type).toBe('tabs');
      expect(Array.isArray(node.children)).toBe(true);
      expect(node.children).toHaveLength(4);

      const activeTabs = node.children.filter((t: any) => t.type === 'tab' && t.active === true);
      expect(activeTabs).toHaveLength(1);
      expect(activeTabs[0].label).toBe('Overview');
    });

    it('associates following content with active tab section', () => {
      const ast = parse('[Overview]* | Details\n\nContent for Overview tab...');
      const tabs = ast.children[0];
      expect(tabs.type).toBe('tabs');
      const overview = tabs.children.find((t: any) => t.label === 'Overview');
      expect(overview).toBeDefined();
      expect(Array.isArray(overview.children)).toBe(true);
      expect(overview.children.length).toBeGreaterThan(0);
    });
  });

  describe('7.4 Badges/Pills', () => {
    it('parses inline code in badge contexts as badge nodes', () => {
      const first = getRoot('Status `active`');
      const second = getRoot('Notifications `3`');

      expect(first.type).toBe('badge');
      expect(first.content).toBe('active');
      expect(second.type).toBe('badge');
      expect(second.content).toBe('3');
    });
  });

  describe('8.x Component States', () => {
    it('parses loading state container as loading-state node', () => {
      const node = getRoot('::: loading\n:spinner: Loading...\nPlease wait\n:::');
      expect(node.type).toBe('loading-state');
    });

    it('parses empty state container as empty-state node', () => {
      const node = getRoot('::: empty-state\n:empty-box:\n## No items found\n:::');
      expect(node.type).toBe('empty-state');
    });

    it('parses error state container as error-state node', () => {
      const node = getRoot('::: error-state\n:warning:\n## Something went wrong\n:::');
      expect(node.type).toBe('error-state');
    });

    it('parses state attributes on components', () => {
      const loadingBtn = getRoot('[Submit]{:loading}');
      const errorBtn = getRoot('[Retry]{:error}');
      expect(loadingBtn.type).toBe('button');
      expect(loadingBtn.props?.state).toBe('loading');
      expect(errorBtn.type).toBe('button');
      expect(errorBtn.props?.state).toBe('error');
    });
  });
});

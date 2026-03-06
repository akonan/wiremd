import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');

describe('extension wiring and security configuration', () => {
  it('declares markdown-it plugin wiring for host-side extension rendering', () => {
    const packageJsonPath = resolve(root, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      contributes?: {
        'markdown.markdownItPlugins'?: boolean;
        grammars?: Array<{
          scopeName: string;
          path: string;
          injectTo?: string[];
        }>;
        configuration?: {
          properties?: Record<string, unknown>;
        };
      };
    };

    expect(packageJson.contributes?.['markdown.markdownItPlugins']).toBe(true);

    const wiremdInjectionGrammar = packageJson.contributes?.grammars?.find(
      (grammar) => grammar.scopeName === 'wiremd.markdown.injection'
    );

    expect(wiremdInjectionGrammar?.path).toBe('./syntaxes/wiremd-injection.tmLanguage.json');
    expect(wiremdInjectionGrammar?.injectTo).toContain('text.html.markdown');
  });

  it('registers .wmd files as markdown language', () => {
    const packageJsonPath = resolve(root, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      contributes?: {
        languages?: Array<{
          id: string;
          extensions?: string[];
        }>;
      };
    };

    const markdownLanguage = packageJson.contributes?.languages?.find((language) => language.id === 'markdown');
    expect(markdownLanguage?.extensions).toContain('.wmd');
  });

  it('declares snippet contributions for markdown wiremd patterns', () => {
    const packageJsonPath = resolve(root, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      contributes?: {
        snippets?: Array<{
          language: string;
          path: string;
        }>;
      };
    };

    const snippetContribution = packageJson.contributes?.snippets?.find(
      (snippet) => snippet.language === 'markdown'
    );

    expect(snippetContribution?.path).toBe('./snippets/wiremd.code-snippets');
  });

  it('uses activation events that cover markdown preview opening paths', () => {
    const packageJsonPath = resolve(root, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      activationEvents?: string[];
    };

    expect(packageJson.activationEvents).toEqual(
      expect.arrayContaining([
        'onLanguage:markdown',
        'onCommand:markdown.showPreview',
        'onCommand:markdown.showPreviewToSide',
        'onCommand:wiremd.openPreview',
        'onCommand:wiremd.openPreviewToSide',
        'onStartupFinished',
        'workspaceContains:**/*.wmd'
      ])
    );
  });

  it('declares preview commands and preview configuration', () => {
    const packageJsonPath = resolve(root, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      contributes?: {
        commands?: Array<{ command: string }>;
        configuration?: {
          properties?: Record<string, unknown>;
        };
      };
    };

    const commands = packageJson.contributes?.commands ?? [];
    const commandIds = commands.map((command) => command.command);
    expect(commandIds).toEqual(
      expect.arrayContaining([
        'wiremd.openPreview',
        'wiremd.openPreviewToSide',
        'wiremd.refreshPreview',
        'wiremd.changeStyle',
        'wiremd.changeViewport'
      ])
    );
    expect(packageJson.contributes?.configuration?.properties).toMatchObject({
      'wiremd.defaultStyle': expect.any(Object),
      'wiremd.autoRefresh': expect.any(Object),
      'wiremd.refreshDelay': expect.any(Object),
      'wiremd.showErrorOverlay': expect.any(Object)
    });
  });
});

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
        configuration?: {
          properties?: Record<string, unknown>;
        };
      };
    };

    expect(packageJson.contributes?.['markdown.markdownItPlugins']).toBe(true);
  });

  it('uses activation events that cover markdown preview opening paths', () => {
    const packageJsonPath = resolve(root, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      activationEvents?: string[];
    };

    expect(packageJson.activationEvents).toEqual([
      'onLanguage:markdown',
      'onCommand:markdown.showPreview',
      'onCommand:markdown.showPreviewToSide',
      'onStartupFinished'
    ]);
  });

  it('does not declare preview commands or preview configuration', () => {
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
    expect(commands).toHaveLength(0);
    expect(packageJson.contributes?.configuration).toBeUndefined();
  });
});
